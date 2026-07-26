import { initializeBlogImageModalScript } from '@/scripts/blog-image-modal.ts';
import { initializeCopyCommandScript } from '@/scripts/copy-command.ts';
import { initializeMachineStatusScript } from '@/scripts/machine-status.ts';
import { initializeMobileNavScript } from '@/scripts/mobile-nav.ts';
import { initializeSearchScript } from '@/scripts/search.ts';
import { initializeWebMcpScript } from '@/scripts/webmcp.ts';

const CLIENT_CONFIG_ID = 'hotaisle-client-config';

interface ClientConfig {
	apiBasePath: string;
	enableWebSocket: boolean;
	searchIndexUrl: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

const readClientConfig = (): ClientConfig => {
	const configElement = document.getElementById(CLIENT_CONFIG_ID);
	if (!(configElement instanceof HTMLScriptElement)) {
		throw new Error(`Missing client configuration element: #${CLIENT_CONFIG_ID}`);
	}

	const parsedConfig: unknown = JSON.parse(configElement.textContent ?? '');
	if (!isRecord(parsedConfig)) {
		throw new Error('Client configuration must be an object.');
	}

	const { apiBasePath, enableWebSocket, searchIndexUrl } = parsedConfig;
	if (
		typeof apiBasePath !== 'string' ||
		typeof enableWebSocket !== 'boolean' ||
		typeof searchIndexUrl !== 'string'
	) {
		throw new Error('Client configuration has an invalid shape.');
	}

	return { apiBasePath, enableWebSocket, searchIndexUrl };
};

initializeBlogImageModalScript();
initializeCopyCommandScript();
initializeMobileNavScript();
initializeWebMcpScript();

try {
	const { apiBasePath, enableWebSocket, searchIndexUrl } = readClientConfig();
	initializeMachineStatusScript({ apiBasePath, enabled: enableWebSocket });
	initializeSearchScript({ searchIndexUrl });
} catch (error: unknown) {
	console.error('Unable to initialize configured client features.', error);
}
