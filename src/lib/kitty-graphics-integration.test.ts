import { describe, expect, spyOn, test } from 'bun:test';
import { Renderer } from '@wterm/dom';
import { GhosttyCore } from '@wterm/ghostty';
import { Window } from 'happy-dom';
import { KittyGraphicsBridge } from '@/lib/kitty-graphics.ts';

const WASM_URL = new URL('../../public/assets/terminal/ghostty-vt.wasm', import.meta.url).href;
const ESC = '\x1b';
const PLACEHOLDER = '\u{10eeee}';
const ENCODER = new TextEncoder();
const COLUMNS = 80;
const ROWS = 24;
const QR_COLUMNS = 20;
const QR_ROWS = 10;
const QR_COLUMN = 8;
const QR_ROW = 4;
const IMAGE_ID = 42;
const PNG_BASE64 =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=';
// First 20 entries from Kitty's rowcolumn-diacritics.txt. This matches
// hotManager's enhancedQRCodePlaceholder: one base plus row/column marks per cell.
const DIACRITICS = [
	0x03_05, 0x03_0d, 0x03_0e, 0x03_10, 0x03_12, 0x03_3d, 0x03_3e, 0x03_3f, 0x03_46, 0x03_4a,
	0x03_4b, 0x03_4c, 0x03_50, 0x03_51, 0x03_52, 0x03_57, 0x03_5b, 0x03_63, 0x03_64, 0x03_65,
] as const;

const command = (control: string, payload = ''): string => `${ESC}_G${control};${payload}${ESC}\\`;
const UPLOAD =
	command(`a=t,f=100,t=d,q=2,i=${IMAGE_ID},m=1`, PNG_BASE64.slice(0, 32)) +
	command('m=0', PNG_BASE64.slice(32)) +
	command(`a=p,U=1,q=2,c=${QR_COLUMNS},r=${QR_ROWS},i=${IMAGE_ID}`);
const DELETE_IMAGE = command(`a=d,d=I,i=${IMAGE_ID}`);

const placeholderFrame = (): string => {
	let frame = `${ESC}[?25l`;
	for (let row = 0; row < QR_ROWS; row += 1) {
		frame += `${ESC}[${QR_ROW + row + 1};${QR_COLUMN}HL${ESC}[38;5;${IMAGE_ID}m`;
		for (let column = 0; column < QR_COLUMNS; column += 1) {
			frame += PLACEHOLDER + String.fromCodePoint(DIACRITICS[row], DIACRITICS[column]);
		}
		frame += `${ESC}[0mR`;
	}
	return frame;
};

const createFixture = async (alternateScreen = true) => {
	const window = new Window();
	const { document } = window;
	const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
	Object.defineProperty(globalThis, 'document', { configurable: true, value: document });
	const terminal = document.createElement('div');
	terminal.style.setProperty('--term-cell-width', '8px');
	terminal.style.setProperty('--term-row-height', '16px');
	const grid = document.createElement('div');
	terminal.append(grid);
	document.body.append(terminal);
	const createUrl = spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:checkout-qr');
	const revokeUrl = spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined);
	const core = await GhosttyCore.load({ wasmPath: WASM_URL });
	core.init(COLUMNS, ROWS);
	if (alternateScreen) {
		core.writeString(`${ESC}[?1049h`);
	}
	const renderer = new Renderer(grid as unknown as HTMLElement);
	renderer.render(core);
	const responses: string[] = [];
	const bridge = new KittyGraphicsBridge({
		core,
		grid: grid as unknown as HTMLElement,
		sendResponse: (response) => responses.push(response),
		writeTerminal: (bytes) => core.writeRaw(bytes),
	});
	const paint = async (): Promise<void> => {
		renderer.render(core);
		await window.happyDOM.waitUntilComplete();
	};
	const write = (value: string, chunkSize: number): void => {
		const bytes = ENCODER.encode(value);
		for (let offset = 0; offset < bytes.length; offset += chunkSize) {
			bridge.write(bytes.slice(offset, offset + chunkSize));
		}
	};
	const destroy = async (): Promise<void> => {
		bridge.destroy();
		renderer.destroy();
		core.dispose();
		createUrl.mockRestore();
		revokeUrl.mockRestore();
		if (previousDocument) {
			Object.defineProperty(globalThis, 'document', previousDocument);
		} else {
			Reflect.deleteProperty(globalThis, 'document');
		}
		await window.happyDOM.close();
	};
	return {
		bridge,
		core,
		createUrl,
		destroy,
		grid,
		paint,
		responses,
		revokeUrl,
		terminal,
		window,
		write,
	};
};

describe('checkout QR rendering with installed wterm and Ghostty WASM', () => {
	test.each([
		{ chunkSize: 65_536, name: 'upload before placeholders', placeholdersFirst: false },
		{ chunkSize: 65_536, name: 'placeholders before upload', placeholdersFirst: true },
		{ chunkSize: 1, name: 'every UTF-8 and graphics byte split', placeholdersFirst: false },
		{ chunkSize: 7, name: 'fragmented placeholders before upload', placeholdersFirst: true },
	])(
		'$name leaves no placeholder glyphs and preserves adjacent text',
		async ({ chunkSize, placeholdersFirst }) => {
			const fixture = await createFixture();
			try {
				const frame = placeholderFrame();
				fixture.write(command('a=q,f=100,i=18497', PNG_BASE64), chunkSize);
				fixture.write(placeholdersFirst ? frame : UPLOAD, chunkSize);
				await fixture.paint();
				expect(fixture.grid.textContent).not.toContain(PLACEHOLDER);
				fixture.write(placeholdersFirst ? UPLOAD : frame, chunkSize);
				await fixture.paint();
				expect(fixture.responses).toEqual([`${ESC}_Gi=18497;OK${ESC}\\`]);
				const rows = fixture.grid.querySelectorAll('.term-row');
				for (let row = 0; row < QR_ROWS; row += 1) {
					expect(rows[QR_ROW + row]?.textContent).toBe(
						`${' '.repeat(QR_COLUMN - 1)}L${' '.repeat(QR_COLUMNS)}R${' '.repeat(COLUMNS - QR_COLUMN - QR_COLUMNS - 1)}`
					);
					for (let column = 0; column < QR_COLUMNS; column += 1) {
						expect(
							fixture.core.getCell(QR_ROW + row, QR_COLUMN + column)
						).toMatchObject({
							char: PLACEHOLDER.codePointAt(0),
							chars:
								PLACEHOLDER +
								String.fromCodePoint(DIACRITICS[row], DIACRITICS[column]),
							width: 1,
						});
					}
				}
				expect(fixture.grid.querySelectorAll('img.term-image')).toHaveLength(1);
				expect(fixture.createUrl).toHaveBeenCalledTimes(1);
				const blob = fixture.createUrl.mock.calls[0]?.[0];
				if (!blob) {
					throw new Error('Expected an uploaded QR image');
				}
				expect(blob.type).toBe('image/png');
				expect(new Uint8Array(await blob.arrayBuffer())).toEqual(
					Buffer.from(PNG_BASE64, 'base64')
				);
			} finally {
				await fixture.destroy();
			}
		}
	);

	test('keeps image geometry tied to cell metrics across font changes and grid rebuilds', async () => {
		const fixture = await createFixture();
		try {
			fixture.write(UPLOAD + placeholderFrame(), 65_536);
			await fixture.paint();
			const originalImage = fixture.grid.querySelector('img.term-image');
			if (!originalImage) {
				throw new Error('Expected a QR image before resizing');
			}
			expect(fixture.window.getComputedStyle(originalImage).width).toBe('calc(20 * 8px)');
			fixture.terminal.style.setProperty('--term-cell-width', '9.5px');
			fixture.terminal.style.setProperty('--term-row-height', '19px');
			fixture.core.resize(COLUMNS + 10, ROWS);
			await fixture.paint();
			const images = fixture.grid.querySelectorAll('img.term-image');
			expect(images).toHaveLength(1);
			const [image] = images;
			expect(image).toBe(originalImage);
			const style = fixture.window.getComputedStyle(originalImage);
			expect(style.width).toBe('calc(20 * 9.5px)');
			expect(style.height).toBe('calc(10 * 19px)');
			expect(style.left).toBe('calc(8 * 9.5px)');
			expect(style.top).toBe('calc(4 * 19px)');
			expect(fixture.createUrl).toHaveBeenCalledTimes(1);
		} finally {
			await fixture.destroy();
		}
	});

	test('keeps placeholders invisible after their rows enter scrollback', async () => {
		const fixture = await createFixture(false);
		try {
			fixture.write(UPLOAD + placeholderFrame(), 65_536);
			await fixture.paint();
			fixture.write(`${DELETE_IMAGE}${ESC}[${ROWS};1H${'\r\n'.repeat(ROWS)}`, 65_536);
			await fixture.paint();
			expect(fixture.core.getScrollbackCount()).toBeGreaterThan(0);
			expect(fixture.grid.querySelectorAll('.term-scrollback-row').length).toBeGreaterThan(0);
			expect(fixture.grid.textContent).not.toContain(PLACEHOLDER);
			expect(fixture.grid.textContent).toContain(`L${' '.repeat(QR_COLUMNS)}R`);
		} finally {
			await fixture.destroy();
		}
	});

	test('clears image resources on reconnect and can display the next QR', async () => {
		const fixture = await createFixture();
		try {
			fixture.write(UPLOAD + placeholderFrame(), 65_536);
			await fixture.paint();
			fixture.bridge.reset();
			expect(fixture.grid.querySelectorAll('img.term-image')).toHaveLength(0);
			expect(fixture.revokeUrl).toHaveBeenCalledTimes(1);
			fixture.write(UPLOAD + placeholderFrame(), 7);
			await fixture.paint();
			expect(fixture.grid.querySelectorAll('img.term-image')).toHaveLength(1);
			expect(fixture.createUrl).toHaveBeenCalledTimes(2);
			expect(fixture.grid.textContent).not.toContain(PLACEHOLDER);
		} finally {
			await fixture.destroy();
		}
	});

	test('removes the image and revokes its URL when the checkout closes', async () => {
		const fixture = await createFixture();
		try {
			fixture.write(UPLOAD + placeholderFrame(), 65_536);
			await fixture.paint();
			fixture.write(`${DELETE_IMAGE}${ESC}[2J${ESC}[HCheckout closed`, 1);
			await fixture.paint();
			expect(fixture.grid.querySelectorAll('img.term-image')).toHaveLength(0);
			expect(fixture.grid.textContent).toContain('Checkout closed');
			expect(fixture.grid.textContent).not.toContain(PLACEHOLDER);
			expect(fixture.revokeUrl).toHaveBeenCalledWith('blob:checkout-qr');
		} finally {
			await fixture.destroy();
		}
	});

	test('keeps ordinary combining characters and text QR blocks intact', async () => {
		const fixture = await createFixture();
		try {
			fixture.write(`${ESC}[?25le\u0301 界 ▄▀█`, 1);
			await fixture.paint();
			expect(fixture.grid.querySelector('.term-row')?.textContent?.trim()).toBe(
				'e\u0301 界 ▄▀█'
			);
			expect(fixture.grid.querySelectorAll('img.term-image')).toHaveLength(0);
		} finally {
			await fixture.destroy();
		}
	});
});
