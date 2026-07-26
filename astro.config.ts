import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const LOCAL_TLS_CERT_PATH = path.resolve(import.meta.dirname, './.dev-localhost-cert.pem');
const LOCAL_TLS_KEY_PATH = path.resolve(import.meta.dirname, './.dev-localhost-key.pem');
const DEV_SERVER_PORT = 4174;
const hasLocalTlsCertificate = existsSync(LOCAL_TLS_CERT_PATH) && existsSync(LOCAL_TLS_KEY_PATH);
const localHttpsOptions = hasLocalTlsCertificate
	? {
			cert: readFileSync(LOCAL_TLS_CERT_PATH),
			key: readFileSync(LOCAL_TLS_KEY_PATH),
		}
	: undefined;

export default defineConfig({
	build: {
		format: 'directory',
		inlineStylesheets: 'always',
	},
	compressHTML: true,
	integrations: [react(), sitemap()],
	outDir: './dist-static',
	output: 'static',
	prefetch: true,
	server: {
		host: 'localhost',
		port: DEV_SERVER_PORT,
	},
	site: 'https://hotaisle.xyz',
	trailingSlash: 'never',
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(import.meta.dirname, './src'),
			},
		},
		server: {
			https: localHttpsOptions,
		},
	},
});
