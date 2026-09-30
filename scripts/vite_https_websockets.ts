import type { IncomingMessage } from 'node:http';
import type { Plugin, ViteDevServer } from 'vite';

export const forwardWebSocketProtocol = (request: IncomingMessage): void => {
	if (request.headers['x-forwarded-proto'] !== undefined) {
		return;
	}

	const isEncrypted = 'encrypted' in request.socket && request.socket.encrypted;
	request.headers['x-forwarded-proto'] = isEncrypted ? 'https' : 'http';
};

const configureServer = ({ httpServer }: Pick<ViteDevServer, 'httpServer'>): void => {
	httpServer?.prependListener('upgrade', forwardWebSocketProtocol);
	httpServer?.once('close', () => {
		httpServer.off('upgrade', forwardWebSocketProtocol);
	});
};

// The Cloudflare Vite beta defaults WebSocket upgrade URLs to HTTP, even over TLS.
export const httpsWebSockets = (): Plugin => ({
	configurePreviewServer: configureServer,
	configureServer,
	name: 'https-websocket-protocol',
});
