import { createServer } from 'node:net';
import path from 'node:path';
import { file, serve } from 'bun';

const INDEX_FILE_NAME = 'index.html';
const HTML_EXTENSION = '.html';
const HTML_CONTENT_TYPE = 'text/html; charset=utf-8';

export type StaticServerTlsOptions = Bun.TLSOptions;

export interface StartStaticServerOptions {
	development: boolean;
	directory: string;
	handleRequest?: (request: Request) => Promise<Response | null> | Response | null;
	hostname: string;
	port: number;
	tls?: StaticServerTlsOptions;
	transformHtml?: (html: string, request: Request) => Promise<string> | string;
}

export async function startStaticServer({
	development,
	directory,
	hostname,
	port,
	tls,
	transformHtml,
	handleRequest,
}: StartStaticServerOptions): Promise<Bun.Server<unknown>> {
	const resolvedPort = await resolvePreferredPort(hostname, port);

	return serve({
		development,
		fetch: async (request: Request): Promise<Response> => {
			const handledResponse = await handleRequest?.(request);
			if (handledResponse) {
				return handledResponse;
			}

			return await createStaticResponse({
				directory,
				request,
				transformHtml,
			});
		},
		hostname,
		port: resolvedPort,
		tls,
	});
}

interface CreateStaticResponseOptions {
	directory: string;
	request: Request;
	transformHtml?: (html: string, request: Request) => Promise<string> | string;
}

export async function createStaticResponse({
	directory,
	request,
	transformHtml,
}: CreateStaticResponseOptions): Promise<Response> {
	const requestUrl = new URL(request.url);
	const filePath = resolveStaticFilePath(directory, requestUrl.pathname);

	if (!filePath) {
		return new Response('Not found', { status: 404 });
	}

	const staticFile = file(filePath);
	if (!(await staticFile.exists())) {
		return new Response('Not found', { status: 404 });
	}

	if (filePath.endsWith(HTML_EXTENSION) && transformHtml) {
		const html = await staticFile.text();
		const transformedHtml = await transformHtml(html, request);

		return new Response(transformedHtml, {
			headers: {
				'content-type': HTML_CONTENT_TYPE,
			},
		});
	}

	return new Response(staticFile);
}

export function resolveStaticFilePath(directory: string, requestPath: string): string | null {
	const normalizedDirectory = path.resolve(directory);
	const normalizedPath = normalizeRequestPath(requestPath);
	if (!normalizedPath) {
		return null;
	}

	let relativePath = INDEX_FILE_NAME;
	if (hasFileExtension(normalizedPath)) {
		relativePath = normalizedPath.slice(1);
	} else if (normalizedPath !== '/') {
		relativePath = path.join(normalizedPath.slice(1), INDEX_FILE_NAME);
	}

	const resolvedPath = path.resolve(normalizedDirectory, relativePath);

	if (
		resolvedPath !== normalizedDirectory &&
		!resolvedPath.startsWith(`${normalizedDirectory}${path.sep}`)
	) {
		return null;
	}

	return resolvedPath;
}

function normalizeRequestPath(requestPath: string): string | null {
	try {
		const decodedPath = decodeURIComponent(requestPath);
		if (decodedPath.includes('\0')) {
			return null;
		}

		if (hasFileExtension(decodedPath)) {
			return decodedPath;
		}

		return decodedPath.endsWith('/') ? decodedPath : `${decodedPath}/`;
	} catch {
		return null;
	}
}

function hasFileExtension(requestPath: string): boolean {
	return path.posix.extname(requestPath) !== '';
}

export async function resolvePreferredPort(
	hostname: string,
	requestedPort: number
): Promise<number> {
	const preferredPort = await probePort(hostname, requestedPort);
	if (preferredPort !== null) {
		return preferredPort;
	}

	const fallbackPort = await probePort(hostname, 0);
	if (fallbackPort !== null) {
		return fallbackPort;
	}

	throw new Error(`Unable to find an available port for ${hostname}`);
}

async function probePort(hostname: string, port: number): Promise<number | null> {
	return await new Promise<number | null>((resolve, reject) => {
		const probeServer = createServer();

		probeServer.once('error', (error: NodeJS.ErrnoException) => {
			probeServer.close();

			if (isUnavailablePortError(error)) {
				resolve(null);
				return;
			}

			reject(error);
		});

		probeServer.listen({ host: hostname, port }, () => {
			const address = probeServer.address();
			if (!address || typeof address === 'string') {
				probeServer.close((error) => {
					if (error) {
						reject(error);
						return;
					}

					resolve(null);
				});
				return;
			}

			probeServer.close((error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(address.port);
			});
		});
	});
}

function isUnavailablePortError(error: NodeJS.ErrnoException): boolean {
	return error.code === 'EACCES' || error.code === 'EADDRINUSE' || error.code === 'EPERM';
}
