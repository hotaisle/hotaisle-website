import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { wtermSourceMaps } from './vite_wterm_sourcemaps.ts';

const DOM_DIST = dirname(fileURLToPath(import.meta.resolve('@wterm/dom')));
const GHOSTTY_DIST = dirname(fileURLToPath(import.meta.resolve('@wterm/ghostty')));
const CORE_DIST = dirname(fileURLToPath(import.meta.resolve('@wterm/core')));
const SOURCE_MAP_COMMENT_PATTERN = /^[\t ]*\/\/[#@][\t ]*sourceMappingURL=[^\r\n]*/gm;

describe('wterm source map loading', () => {
	test.each([
		{ directory: DOM_DIST, file: 'index.js' },
		{ directory: DOM_DIST, file: 'renderer.js' },
		{ directory: DOM_DIST, file: 'wterm.js' },
		{ directory: DOM_DIST, file: 'input.js' },
		{ directory: DOM_DIST, file: 'debug.js' },
		{ directory: DOM_DIST, file: 'rectangle-drag.js' },
		{ directory: GHOSTTY_DIST, file: 'index.js' },
		{ directory: GHOSTTY_DIST, file: 'ghostty-core.js' },
		{ directory: CORE_DIST, file: 'index.js' },
	])('loads $directory/$file without changing executable code', async ({ directory, file }) => {
		const path = resolve(directory, file);
		const original = await readFile(path, 'utf8');
		const result = await wtermSourceMaps().load(path);

		expect(result).not.toBeNull();
		expect(result?.code).not.toContain('sourceMappingURL=');
		expect(result?.code).toBe(original.replace(SOURCE_MAP_COMMENT_PATTERN, ''));
		expect(result?.map).toBeNull();
	});

	test('handles Vite cache-version queries', async () => {
		const file = resolve(DOM_DIST, 'index.js');
		expect(await wtermSourceMaps().load(`${file}?v=123abc`)).toEqual(
			await wtermSourceMaps().load(file)
		);
	});

	test.each([
		'/project/src/index.js',
		'/project/node_modules/another-package/dist/index.js',
		'/project/node_modules/@wterm/other/dist/index.js',
		'/project/node_modules/@wterm/dom/src/terminal.css',
		'/project/node_modules/@wterm/ghostty/wasm/ghostty-vt.wasm',
		'/project/node_modules/@wterm/dom/dist/index.js.map',
		'/project/node_modules/@wterm/dom/dist/index.js?raw',
		'/project/node_modules/@wterm/dom/dist/index.js?url',
	])('leaves unrelated or specialized imports alone: %s', async (id) => {
		expect(await wtermSourceMaps().load(id)).toBeNull();
	});
});
