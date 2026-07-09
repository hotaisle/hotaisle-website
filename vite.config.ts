import fs from 'node:fs';
import path from 'node:path';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vinext from 'vinext';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';

const APP_DIRECTORY = path.resolve(import.meta.dirname, './src/app');
const LOCAL_TLS_CERT_PATH = path.resolve(import.meta.dirname, './.dev-localhost-cert.pem');
const LOCAL_TLS_KEY_PATH = path.resolve(import.meta.dirname, './.dev-localhost-key.pem');
const DEV_SERVER_PORT = 4174;

const getInlineScriptHotReloadPaths = (): Set<string> => {
	const inlineScriptPaths = new Set<string>([path.resolve(APP_DIRECTORY, 'layout.tsx')]);
	const appEntries = fs.readdirSync(APP_DIRECTORY, { withFileTypes: true });

	for (const entry of appEntries) {
		if (!(entry.isFile() && entry.name.endsWith('-script.ts'))) {
			continue;
		}

		inlineScriptPaths.add(path.resolve(APP_DIRECTORY, entry.name));
	}

	return inlineScriptPaths;
};

const fullReloadForInlineScripts = (): PluginOption => {
	const inlineScriptPaths = getInlineScriptHotReloadPaths();

	return {
		handleHotUpdate({ file, server }) {
			if (!inlineScriptPaths.has(file)) {
				return;
			}

			server.ws.send({ type: 'full-reload' });
			return [];
		},
		name: 'full-reload-inline-scripts',
	};
};

export default defineConfig({
	optimizeDeps: {
		exclude: ['lucide-react'],
	},
	plugins: [
		fullReloadForInlineScripts(),
		tailwindcss(),
		vinext(),
		cloudflare({
			viteEnvironment: {
				childEnvironments: ['ssr'],
				name: 'rsc',
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
	server: {
		https: {
			cert: fs.readFileSync(LOCAL_TLS_CERT_PATH),
			key: fs.readFileSync(LOCAL_TLS_KEY_PATH),
		},
		port: DEV_SERVER_PORT,
		strictPort: true,
	},
});
