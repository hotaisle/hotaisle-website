import { readFile } from 'node:fs/promises';
import { normalizePath, type Plugin } from 'vite';

const WTERM_MODULE_PATTERN = /\/node_modules\/@wterm\/(?:core|dom|ghostty)\/dist\/[^?#]+\.js$/;
const SOURCE_MAP_COMMENT_PATTERN = /^[\t ]*\/\/[#@][\t ]*sourceMappingURL=[^\r\n]*/gm;

// wterm publishes maps without their TypeScript sources or sourcesContent.
// Load its distributed JS directly so Vite does not follow those broken maps.
// The local renderer patch also makes the original renderer map inaccurate.
export const wtermSourceMaps = () =>
	({
		enforce: 'pre',
		async load(id: string) {
			const [file, query] = id.split('?', 2);
			if (!WTERM_MODULE_PATTERN.test(normalizePath(file))) {
				return null;
			}
			// Leave Vite's raw, URL, and other specialized imports to their loaders.
			for (const key of new URLSearchParams(query).keys()) {
				if (key !== 'v') {
					return null;
				}
			}
			const code = await readFile(file, 'utf8');
			return { code: code.replace(SOURCE_MAP_COMMENT_PATTERN, ''), map: null };
		},
		name: 'wterm-distributed-source-maps',
	}) satisfies Plugin;
