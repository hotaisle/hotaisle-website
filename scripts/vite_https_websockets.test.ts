import { describe, expect, test } from 'bun:test';
import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { forwardWebSocketProtocol } from './vite_https_websockets.ts';

const CASES = [
	{ encrypted: true, expected: 'https', forwarded: undefined, name: 'direct HTTPS' },
	{ encrypted: false, expected: 'http', forwarded: undefined, name: 'direct HTTP' },
	{ encrypted: false, expected: 'https', forwarded: 'https', name: 'TLS proxy' },
	{ encrypted: true, expected: 'http', forwarded: 'http', name: 'HTTP proxy over TLS' },
] as const;

describe('Vite WebSocket protocol forwarding', () => {
	for (const { encrypted, expected, forwarded, name } of CASES) {
		test(name, () => {
			const request = new IncomingMessage(new Socket());
			Object.defineProperty(request.socket, 'encrypted', { value: encrypted });
			request.headers.host = 'localhost:4174';
			request.headers.origin = `${expected}://localhost:4174`;
			request.headers['x-forwarded-proto'] = forwarded;
			try {
				forwardWebSocketProtocol(request);
				const forwardedOrigin = `${request.headers['x-forwarded-proto']}://${request.headers.host}`;
				expect(forwardedOrigin).toBe(request.headers.origin);
				expect(request.headers.origin).toBe(`${expected}://localhost:4174`);
			} finally {
				request.destroy();
			}
		});
	}

	test('keeps a mismatched browser origin visible to the Worker', () => {
		const request = new IncomingMessage(new Socket());
		Object.defineProperty(request.socket, 'encrypted', { value: true });
		request.headers.host = 'localhost:4174';
		request.headers.origin = 'https://example.invalid';
		try {
			forwardWebSocketProtocol(request);
			expect(request.headers['x-forwarded-proto']).toBe('https');
			expect(request.headers.origin).toBe('https://example.invalid');
		} finally {
			request.destroy();
		}
	});
});
