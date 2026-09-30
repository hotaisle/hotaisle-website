import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';

const PROJECT_ROOT = import.meta.dirname;
const LOCAL_PORT = 4174;
const STATIC_INDEX_PATH = resolve(PROJECT_ROOT, 'dist-static/index.html');

export default defineConfig(({ command }) => {
	if (command === 'build' && !existsSync(STATIC_INDEX_PATH)) {
		throw new Error(
			'Static site output is missing. Run bun run build before packaging the Worker.'
		);
	}

	const https =
		command === 'serve'
			? {
					cert: readFileSync(resolve(PROJECT_ROOT, '.dev-localhost-cert.pem')),
					key: readFileSync(resolve(PROJECT_ROOT, '.dev-localhost-key.pem')),
				}
			: undefined;

	return {
		define: {
			__dirname: JSON.stringify('/'),
			__filename: JSON.stringify('/worker.js'),
		},
		plugins: [cloudflare({ types: { generate: false } })],
		preview: { host: 'localhost', https, port: LOCAL_PORT, strictPort: true },
		// Astro owns the static build; copy its audited output without transforming it.
		publicDir: 'dist-static',
		resolve: {
			alias: {
				'@': resolve(PROJECT_ROOT, 'src'),
				'cpu-features': resolve(PROJECT_ROOT, 'src/worker/cpu-features-stub.cjs'),
			},
		},
		server: { host: 'localhost', https, port: LOCAL_PORT, strictPort: true },
	};
});
