import { bindings, type CloudflareConfig, defineConfig, exports } from 'cf/config';

const config: CloudflareConfig = defineConfig({
	worker: {
		assets: {
			htmlHandling: 'drop-trailing-slash',
			notFoundHandling: '404-page',
			runWorkerFirst: ['/api/machine-status', '/api/terminal', '/api/ws'],
		},
		compatibilityDate: '2026-07-26',
		compatibilityFlags: ['nodejs_compat'],
		domains: ['hotaisle.xyz', 'www.hotaisle.xyz', 'blog.hotaisle.xyz', 'mta-sts.hotaisle.xyz'],
		entrypoint: './src/worker/index.ts',
		env: {
			ASSETS: bindings.assets(),
			IMAGES: bindings.images({}),
			MACHINE_STATUS_HUB: bindings.durableObject({
				exportName: 'MachineStatusHub',
				worker: 'hotaisle-website',
			}),
		},
		exports: {
			MachineStatusHub: exports.durableObject({ storage: 'sqlite' }),
		},
		name: 'hotaisle-website',
		observability: {
			enabled: true,
			headSamplingRate: 1,
			logs: { enabled: true, invocationLogs: true },
			traces: { enabled: true },
		},
	},
});

export default config;
