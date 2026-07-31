import { describe, expect, test } from 'bun:test';
import { GhosttyCore } from '@wterm/ghostty';

const GHOSTTY_WASM_URL = new URL('../../public/assets/terminal/ghostty-vt.wasm', import.meta.url)
	.href;
const PRIMARY_SCREEN_TEXT = '\u001b[31mRED\u001b[0m';
const ALTERNATE_SCREEN_TEXT = '\u001b[?1049h\u001b[1;33mBOLD-YELLOW\u001b[?1049l';

describe('patched Ghostty WASM', () => {
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
});
