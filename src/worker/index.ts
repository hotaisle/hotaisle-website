import { parseMachineStatusEvent } from '@/lib/machine-status.ts';
import appHandler from 'vinext/server/app-router-entry';

const BAD_REQUEST_STATUS = 400;
const FORBIDDEN_STATUS = 403;
const INTERNAL_SERVER_ERROR_STATUS = 500;
const METHOD_NOT_ALLOWED_STATUS = 405;
const NO_CONTENT_STATUS = 204;
const SWITCHING_PROTOCOLS_STATUS = 101;
const UPGRADE_REQUIRED_STATUS = 426;
const API_BASE_PATH = '/api';
const HOTAISLE_WEBSITE_SECRET = 'dev-secret';
const HOTAISLE_SECRET_HEADER = 'x-hotaisle-auth';
const HUB_OBJECT_NAME = 'global-machine-status-hub';
const HUB_SOCKET_TAG = 'machine-status-client';
const HUB_BROADCAST_PATH = '/broadcast';
const HUB_CONNECT_PATH = '/connect';
const MACHINE_STATUS_PATH = `${API_BASE_PATH}/machine-status`;
const WEBSOCKET_PATH = `${API_BASE_PATH}/ws`;
const IS_PRODUCTION = import.meta.env.PROD;

interface Env {
	ASSETS: FetcherLike;
	HOTAISLE_WEBSITE_SECRET?: string;
	MACHINE_STATUS_HUB: DurableObjectNamespaceLike;
}

interface ExecutionContextLike {
	passThroughOnException?(): void;
	waitUntil(promise: Promise<unknown>): void;
}

const worker = {
	async fetch(
		request: Request,
		env?: Env,
		ctx?: ExecutionContextLike
	): Promise<Response> {
		const requestUrl = new URL(request.url);

		if (requestUrl.pathname === MACHINE_STATUS_PATH) {
			return await handleEventRequest(request, env);
		}

		if (requestUrl.pathname === WEBSOCKET_PATH) {
			return await handleWebSocketRequest(request, env);
		}

		if (!IS_PRODUCTION || !env?.ASSETS) {
			return await appHandler.fetch(request, env, ctx);
		}

		return await env.ASSETS.fetch(request);
	},
};

export default worker;

export class MachineStatusHub {
	constructor(private readonly state: DurableObjectState, _env: Env) {}

	async fetch(request: Request): Promise<Response> {
		const requestUrl = new URL(request.url);

		if (requestUrl.pathname === HUB_CONNECT_PATH) {
			return this.handleConnectionRequest(request);
		}

		if (requestUrl.pathname === HUB_BROADCAST_PATH) {
			return await this.handleBroadcastRequest(request);
		}

		return new Response('Not found', { status: 404 });
	}

	webSocketClose(webSocket: WebSocket, _code: number, _reason: string, _wasClean: boolean): void {
		this.discardSocket(webSocket);
	}

	webSocketError(webSocket: WebSocket, _error: unknown): void {
		this.discardSocket(webSocket);
	}

	webSocketMessage(_webSocket: WebSocket, _message: string | ArrayBuffer): void {}

	private handleConnectionRequest(request: Request): Response {
		if (request.method !== 'GET') {
			return createMethodNotAllowedResponse('GET');
		}

		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader?.toLowerCase() !== 'websocket') {
			return new Response('Expected Upgrade: websocket', { status: UPGRADE_REQUIRED_STATUS });
		}

		const webSocketPair = new WebSocketPair();
		const clientSocket = webSocketPair[0];
		const serverSocket = webSocketPair[1];

		this.state.acceptWebSocket(serverSocket, [HUB_SOCKET_TAG]);

		return new Response(null, {
			status: SWITCHING_PROTOCOLS_STATUS,
			webSocket: clientSocket,
		});
	}

	private async handleBroadcastRequest(request: Request): Promise<Response> {
		if (request.method !== 'POST') {
			return createMethodNotAllowedResponse('POST');
		}

		const payload = await parseJsonBody(request);
		const event = parseMachineStatusEvent(payload);
		if (!event) {
			return new Response('Invalid machine status payload', { status: BAD_REQUEST_STATUS });
		}

		const message = JSON.stringify(event);

		for (const socket of this.state.getWebSockets(HUB_SOCKET_TAG)) {
			if (socket.readyState !== WebSocket.OPEN) {
				continue;
			}

			try {
				socket.send(message);
			} catch {
				socket.close(1011, 'Broadcast failed');
			}
		}

		return new Response(null, { status: NO_CONTENT_STATUS });
	}

	private discardSocket(webSocket: WebSocket): void {
		try {
			webSocket.close();
		} catch {
			return;
		}
	}
}

async function handleEventRequest(request: Request, env?: Env): Promise<Response> {
	if (request.method !== 'POST') {
		return createMethodNotAllowedResponse('POST');
	}

	if (!env) {
		return new Response('Missing worker environment', { status: INTERNAL_SERVER_ERROR_STATUS });
	}

	const machineStatusSecret =
		env.HOTAISLE_WEBSITE_SECRET ?? (!IS_PRODUCTION ? HOTAISLE_WEBSITE_SECRET : null);
	if (!machineStatusSecret) {
		return new Response('Missing HOTAISLE_WEBSITE_SECRET binding', {
			status: INTERNAL_SERVER_ERROR_STATUS,
		});
	}

	const providedSecret = request.headers.get(HOTAISLE_SECRET_HEADER);
	if (providedSecret !== machineStatusSecret) {
		return new Response('Forbidden', { status: FORBIDDEN_STATUS });
	}

	const payload = await parseJsonBody(request);
	const event = parseMachineStatusEvent(payload);
	if (!event) {
		return new Response('Invalid machine status payload', { status: BAD_REQUEST_STATUS });
	}

	const hubObjectId = env.MACHINE_STATUS_HUB.idFromName(HUB_OBJECT_NAME);
	const hubObject = env.MACHINE_STATUS_HUB.get(hubObjectId);

	return await hubObject.fetch(`https://machine-status.internal${HUB_BROADCAST_PATH}`, {
		body: JSON.stringify(event),
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
	});
}

async function handleWebSocketRequest(request: Request, env?: Env): Promise<Response> {
	if (request.method !== 'GET') {
		return createMethodNotAllowedResponse('GET');
	}

	if (!env) {
		return new Response('Missing worker environment', { status: INTERNAL_SERVER_ERROR_STATUS });
	}

	const hubObjectId = env.MACHINE_STATUS_HUB.idFromName(HUB_OBJECT_NAME);
	const hubObject = env.MACHINE_STATUS_HUB.get(hubObjectId);

	return await hubObject.fetch(`https://machine-status.internal${HUB_CONNECT_PATH}`, {
		headers: request.headers,
		method: request.method,
	});
}

function createMethodNotAllowedResponse(allowedMethod: string): Response {
	return new Response('Method not allowed', {
		headers: {
			allow: allowedMethod,
		},
		status: METHOD_NOT_ALLOWED_STATUS,
	});
}

async function parseJsonBody(request: Request): Promise<unknown> {
	try {
		return await request.json();
	} catch {
		return null;
	}
}
