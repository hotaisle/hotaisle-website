import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from 'bun';
import { createStaticResponse, resolvePreferredPort } from './static_server.ts';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 4174;
const BUILD_COMMAND = ['run', 'build'] as const;
const LIVE_RELOAD_PATH = '/__hotaisle_live_reload';
const LIVE_RELOAD_RECONNECT_DELAY_MS = 1000;
const WATCH_DEBOUNCE_MS = 150;
const WATCH_EVENT_COOLDOWN_MS = 500;
const GENERATED_BLOG_ASSETS_DIRECTORY = 'assets/blog';
const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const DIST_STATIC_DIRECTORY = path.join(import.meta.dirname, '..', 'dist-static');
const RELOAD_EVENT = 'reload';
const BUILD_ERROR_EVENT = 'build-error';
const WATCH_TARGETS = [
	{ path: path.join(PROJECT_ROOT, 'content') },
	{
		path: path.join(PROJECT_ROOT, 'public'),
		shouldIgnore: (fileName: string) => isGeneratedBlogAssetPath(fileName),
	},
	{ path: path.join(PROJECT_ROOT, 'src', 'app') },
	{ path: path.join(PROJECT_ROOT, 'src', 'components') },
	{ path: path.join(PROJECT_ROOT, 'src', 'lib') },
] as const;

const host = process.env.HOST ?? DEFAULT_HOST;
const port = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);
const reloadClients = new Set<Bun.ServerWebSocket<undefined>>();

let isBuilding = false;
let pendingBuildReason: string | null = null;
let scheduledBuildTimer: NodeJS.Timeout | null = null;
let watchEventCooldownUntil = 0;

if (Number.isNaN(port)) {
	throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

await runBuildLoop('initial startup');

const resolvedPort = await resolvePreferredPort(host, port);
const server = serve({
	development: true,
	fetch(request: Request, bunServer): Response | Promise<Response> | undefined {
		const requestUrl = new URL(request.url);
		if (requestUrl.pathname === LIVE_RELOAD_PATH) {
			if (bunServer.upgrade(request)) {
				return;
			}

			return new Response('WebSocket upgrade failed', { status: 400 });
		}

		return createStaticResponse({
			directory: DIST_STATIC_DIRECTORY,
			request,
			transformHtml: (html: string) => injectLiveReloadScript(html),
		});
	},
	hostname: host,
	port: resolvedPort,
	websocket: {
		close(websocket) {
			reloadClients.delete(websocket);
		},
		message(_websocket, _message) {
			// Live reload only pushes server events; inbound messages are ignored.
		},
		open(websocket) {
			reloadClients.add(websocket);
		},
	},
});

console.log(`Serving dist-static with live reload at http://${server.hostname}:${server.port}`);

for (const watchTarget of WATCH_TARGETS) {
	startWatcher(watchTarget);
}

function injectLiveReloadScript(html: string): string {
	const liveReloadScript = `<script type="module">
let active = true;
let socket = null;

const connect = () => {
	if (!active) {
		return;
	}

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	socket = new WebSocket(\`\${protocol}//\${window.location.host}${LIVE_RELOAD_PATH}\`);

	socket.addEventListener('message', (event) => {
		const payload = JSON.parse(event.data);
		if (payload.type === '${RELOAD_EVENT}') {
			socket?.close();
			window.location.reload();
			return;
		}

		if (payload.type === '${BUILD_ERROR_EVENT}') {
			console.error('Static rebuild failed:', payload.message);
		}
	});

	socket.addEventListener('close', () => {
		socket = null;
		if (active) {
			window.setTimeout(connect, ${LIVE_RELOAD_RECONNECT_DELAY_MS});
		}
	});
};

window.addEventListener('pagehide', () => {
	active = false;
	socket?.close();
}, { once: true });

connect();
</script>`;

	if (html.includes('</body>')) {
		return html.replace('</body>', `${liveReloadScript}</body>`);
	}

	if (html.includes('</html>')) {
		return html.replace('</html>', `${liveReloadScript}</html>`);
	}

	return `${html}${liveReloadScript}`;
}

function startWatcher(watchTarget: {
	path: string;
	shouldIgnore?: (fileName: string) => boolean;
}): void {
	const { path: watchPath, shouldIgnore } = watchTarget;

	if (!fs.existsSync(watchPath)) {
		return;
	}

	fs.watch(watchPath, { recursive: true }, (_eventType, fileName) => {
		if (shouldSkipWatchEvent()) {
			return;
		}

		if (!shouldTriggerRebuild(fileName, shouldIgnore)) {
			return;
		}

		scheduleBuild(`${watchPath}${fileName ? `/${fileName}` : ''}`);
	});
}

function shouldTriggerRebuild(
	fileName: string | Buffer | null,
	shouldIgnore?: (fileName: string) => boolean
): boolean {
	if (!fileName) {
		return true;
	}

	const normalizedFileName = fileName.toString().replaceAll('\\', '/');
	if (normalizedFileName.startsWith('generated/')) {
		return false;
	}

	return !shouldIgnore?.(normalizedFileName);
}

function isGeneratedBlogAssetPath(fileName: string): boolean {
	return (
		fileName === GENERATED_BLOG_ASSETS_DIRECTORY ||
		fileName.startsWith(`${GENERATED_BLOG_ASSETS_DIRECTORY}/`)
	);
}

function scheduleBuild(reason: string): void {
	if (scheduledBuildTimer) {
		clearTimeout(scheduledBuildTimer);
	}

	scheduledBuildTimer = setTimeout(() => {
		scheduledBuildTimer = null;
		runBuildLoop(reason).catch((error: unknown) => {
			const message = error instanceof Error ? error.message : String(error);
			console.error(`Unexpected static rebuild failure: ${message}`);
		});
	}, WATCH_DEBOUNCE_MS);
}

function shouldSkipWatchEvent(): boolean {
	return isBuilding || Date.now() < watchEventCooldownUntil;
}

async function runBuildLoop(reason: string): Promise<void> {
	if (isBuilding) {
		pendingBuildReason = reason;
		return;
	}

	isBuilding = true;
	try {
		await runQueuedBuild(reason);
	} finally {
		isBuilding = false;
	}
}

async function runQueuedBuild(reason: string): Promise<void> {
	pendingBuildReason = null;
	console.log(`Rebuilding static site (${reason})...`);

	try {
		await runBuild();
		console.log('Static site rebuilt.');
		broadcastEvent(RELOAD_EVENT);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Static site rebuild failed: ${message}`);
		broadcastEvent(BUILD_ERROR_EVENT, message);
	}

	if (pendingBuildReason) {
		await runQueuedBuild(pendingBuildReason);
	}
}

async function runBuild(): Promise<void> {
	watchEventCooldownUntil = Number.POSITIVE_INFINITY;
	const buildProcess = spawn('bun', [...BUILD_COMMAND], {
		cwd: PROJECT_ROOT,
		stdio: 'inherit',
	});

	try {
		const exitCode = await new Promise<number>((resolve, reject) => {
			buildProcess.once('close', (code) => resolve(code ?? 1));
			buildProcess.once('error', reject);
		});

		if (exitCode !== 0) {
			throw new Error(`bun ${BUILD_COMMAND.join(' ')} exited with code ${exitCode}`);
		}
	} finally {
		watchEventCooldownUntil = Date.now() + WATCH_EVENT_COOLDOWN_MS;
	}
}

function broadcastEvent(type: string, message?: string): void {
	const payload = JSON.stringify({
		message,
		type,
	});

	for (const client of reloadClients) {
		if (client.readyState !== WebSocket.OPEN) {
			reloadClients.delete(client);
			continue;
		}

		client.send(payload);
	}
}
