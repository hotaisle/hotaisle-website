import { describe, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { GhosttyCore } from '@wterm/ghostty';
import { GHOSTTY_WASM_PATH, GHOSTTY_WASM_SHA256 } from '@/lib/ghostty-wasm.ts';

const GHOSTTY_WASM_URL = new URL('../../public/assets/terminal/ghostty-vt.wasm', import.meta.url)
	.href;
const INSTALLED_GHOSTTY_WASM_URL = import.meta.resolve('@wterm/ghostty/ghostty-vt.wasm');
const PRIMARY_SCREEN_TEXT = '\u001b[31mRED\u001b[0m';
const ALTERNATE_SCREEN_TEXT = '\u001b[?1049h\u001b[1;33mBOLD-YELLOW\u001b[?1049l';

const sha256 = (binary: Uint8Array): string => createHash('sha256').update(binary).digest('hex');

describe('Ghostty WASM', () => {
	test('matches the binary shipped with the installed package', async () => {
		const [publicBinary, installedBinary] = await Promise.all([
			readFile(fileURLToPath(GHOSTTY_WASM_URL)),
			readFile(fileURLToPath(INSTALLED_GHOSTTY_WASM_URL)),
		]);

		const publicBinaryHash = sha256(publicBinary);
		expect(publicBinaryHash).toBe(sha256(installedBinary));
		expect(publicBinaryHash).toBe(GHOSTTY_WASM_SHA256);
		expect(String(GHOSTTY_WASM_PATH)).toBe(
			`/assets/terminal/ghostty-vt.wasm?v=${publicBinaryHash}`
		);
	});

	test('does not leak alternate-screen styling into default primary cells', async () => {
		const core = await GhosttyCore.load({ wasmPath: GHOSTTY_WASM_URL });
		core.init(20, 5);
		core.writeString(PRIMARY_SCREEN_TEXT);
		core.writeString(ALTERNATE_SCREEN_TEXT);

		expect(core.getCell(0, 5)).toMatchObject({
			bg: 256,
			char: 32,
			fg: 256,
			flags: 0,
		});
	});

	test('reports wide characters and their continuation cells', async () => {
		const core = await GhosttyCore.load({ wasmPath: GHOSTTY_WASM_URL });
		core.init(5, 2);
		core.writeString('界A');

		expect(core.getCell(0, 0).width).toBe(2);
		expect(core.getCell(0, 1).width).toBe(0);
		expect(core.getCell(0, 2)).toMatchObject({
			char: 'A'.codePointAt(0),
			width: 1,
		});
	});
});
