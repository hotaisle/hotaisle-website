import { describe, expect, test } from 'bun:test';
import type { CellData, TerminalCore } from '@wterm/core';
import {
	createKittyGraphicsQueryResponse,
	findKittyPlaceholder,
	KittyGraphicsBridge,
	KittyGraphicsParser,
	type KittyGraphicsParserEvent,
} from '@/lib/kitty-graphics.ts';

const ESC = '\x1b';
const PLACEHOLDER_CODEPOINT = 0x10_ee_ee;
const TEXT_ENCODER = new TextEncoder();

const encode = (value: string): Uint8Array => TEXT_ENCODER.encode(value);

const kittyCommand = (control: string, payload = ''): Uint8Array =>
	encode(`${ESC}_G${control}${payload ? `;${payload}` : ''}${ESC}\\`);

const textFromEvents = (events: KittyGraphicsParserEvent[]): string =>
	events
		.filter(
			(event): event is Extract<KittyGraphicsParserEvent, { type: 'text' }> =>
				event.type === 'text'
		)
		.map((event) => new TextDecoder().decode(event.bytes))
		.join('');

const graphicsFromEvents = (
	events: KittyGraphicsParserEvent[]
): Extract<KittyGraphicsParserEvent, { type: 'graphics' }>[] =>
	events.filter(
		(event): event is Extract<KittyGraphicsParserEvent, { type: 'graphics' }> =>
			event.type === 'graphics'
	);

class FakeElement {
	alt = '';
	children: FakeElement[] = [];
	className = '';
	draggable = true;
	ownerDocument: FakeDocument;
	parentElement: FakeElement | null = null;
	removed = false;
	src = '';
	style: Record<string, string> = {};

	constructor(ownerDocument: FakeDocument) {
		this.ownerDocument = ownerDocument;
	}

	append(child: FakeElement): void {
		child.parentElement = this;
		this.children.push(child);
	}

	remove(): void {
		this.removed = true;
		if (this.parentElement) {
			this.parentElement.children = this.parentElement.children.filter(
				(child) => child !== this
			);
		}
	}
}

class FakeDocument {
	readonly createdUrls: string[] = [];
	readonly revokedUrls: string[] = [];
	readonly defaultView = {
		Blob,
		getComputedStyle: () => ({
			getPropertyValue: (property: string): string => {
				if (property === '--term-cell-width') {
					return '8px';
				}
				if (property === '--term-row-height') {
					return '16px';
				}
				return '';
			},
		}),
		URL: {
			createObjectURL: (): string => {
				const url = `blob:test-${this.createdUrls.length + 1}`;
				this.createdUrls.push(url);
				return url;
			},
			revokeObjectURL: (url: string): void => {
				this.revokedUrls.push(url);
			},
		},
	};

	createElement(): FakeElement {
		return new FakeElement(this);
	}
}

const createFakeCore = (getCell: (row: number, column: number) => CellData): TerminalCore => ({
	bracketedPaste: () => false,
	clearDirty: () => undefined,
	cursorKeysApp: () => false,
	getCell,
	getCols: () => 12,
	getCursor: () => ({ col: 0, row: 0, visible: false }),
	getResponse: () => null,
	getRows: () => 8,
	getScrollbackCell: () => ({ bg: 256, char: 32, fg: 256, flags: 0 }),
	getScrollbackCount: () => 3,
	getScrollbackLineLen: () => 0,
	getTitle: () => null,
	getUnhandledSequences: () => [],
	init: () => undefined,
	isDirtyRow: () => false,
	resize: () => undefined,
	usingAltScreen: () => false,
	writeRaw: () => undefined,
	writeString: () => undefined,
});

describe('KittyGraphicsParser', () => {
	test.each([
		['plain text', 'hello world'],
		['CSI escape sequence', `${ESC}[38;5;14mcyan${ESC}[0m`],
		['non-Kitty APC', `${ESC}_Pignored${ESC}\\`],
	])('preserves %s', (_name, input) => {
		const parser = new KittyGraphicsParser();
		const events = parser.push(encode(input));

		expect(textFromEvents(events)).toBe(input);
		expect(graphicsFromEvents(events)).toHaveLength(0);
	});

	test('recognizes a capability query split across writes', () => {
		const parser = new KittyGraphicsParser();
		const first = parser.push(encode(`${ESC}_Gf=100,a=q,i=18497`));
		const second = parser.push(encode(`${ESC}\\`));
		const graphics = graphicsFromEvents([...first, ...second]);

		expect(graphics).toHaveLength(1);
		expect(graphics[0]?.command.control).toMatchObject({
			a: 'q',
			f: 100,
			i: 18_497,
		});
		expect(graphics[0]?.command.data).toEqual(new Uint8Array());
	});

	test('reassembles an ordered transfer when continuation chunks omit the image ID', () => {
		const parser = new KittyGraphicsParser();
		const expected = encode('Hot Aisle');
		const payload = btoa(String.fromCharCode(...expected));
		const splitAt = Math.floor(payload.length / 2);

		const first = parser.push(kittyCommand('a=t,f=100,i=42,m=1', payload.slice(0, splitAt)));
		const second = parser.push(kittyCommand('m=0', payload.slice(splitAt)));
		const graphics = graphicsFromEvents([...first, ...second]);

		expect(graphics).toHaveLength(1);
		expect(graphics[0]?.command.control).toMatchObject({
			a: 't',
			f: 100,
			i: 42,
		});
		expect(graphics[0]?.command.data).toEqual(expected);
	});

	test('drops invalid base64 without leaking Kitty protocol bytes into terminal text', () => {
		const parser = new KittyGraphicsParser();
		const events = parser.push(kittyCommand('a=t,f=100,i=7', 'not-valid-***'));

		expect(events).toEqual([]);
	});
});

describe('Kitty graphics capability response', () => {
	test('echoes the queried image ID and reports PNG support', () => {
		expect(createKittyGraphicsQueryResponse({ a: 'q', f: 100, i: 18_497 })).toBe(
			`${ESC}_Gi=18497;OK${ESC}\\`
		);
	});

	test('does not claim support for an unsupported pixel format', () => {
		expect(createKittyGraphicsQueryResponse({ a: 'q', f: 24, i: 18_497 })).toBeNull();
	});
});

describe('findKittyPlaceholder', () => {
	test('finds the first virtual-placement anchor in the viewport', () => {
		const cells: CellData[][] = Array.from({ length: 3 }, () =>
			Array.from({ length: 4 }, () => ({ bg: 256, char: 32, fg: 256, flags: 0 }))
		);
		const [, targetRow] = cells;
		if (!targetRow) {
			throw new Error('Expected test viewport row');
		}
		targetRow[2] = { bg: 256, char: PLACEHOLDER_CODEPOINT, fg: 42, flags: 0 };

		expect(
			findKittyPlaceholder({
				getCell: (row, column) =>
					cells[row]?.[column] ?? { bg: 256, char: 32, fg: 256, flags: 0 },
				getCols: () => 4,
				getRows: () => 3,
			})
		).toEqual({ column: 2, row: 1 });
	});
});

describe('KittyGraphicsBridge', () => {
	test('answers the probe and overlays an uploaded PNG on its virtual placeholder', () => {
		const document = new FakeDocument();
		const terminal = new FakeElement(document);
		const grid = new FakeElement(document);
		terminal.append(grid);
		let placeholderVisible = false;
		const core = createFakeCore((row, column) => ({
			bg: 256,
			char: placeholderVisible && row === 2 && column === 3 ? PLACEHOLDER_CODEPOINT : 32,
			fg: 256,
			flags: 0,
		}));
		const responses: string[] = [];
		const writes: Uint8Array[] = [];
		const bridge = new KittyGraphicsBridge({
			core,
			grid: grid as unknown as HTMLElement,
			sendResponse: (response) => responses.push(response),
			writeTerminal: (data) => {
				writes.push(data);
				placeholderVisible = true;
			},
		});

		bridge.write(kittyCommand('a=q,f=100,i=18497', 'AA=='));
		bridge.write(kittyCommand('a=t,f=100,i=42', 'iVBORw0KGgo='));
		bridge.write(kittyCommand('a=p,U=1,c=18,r=9,i=42'));
		bridge.write('render placeholders');

		expect(responses).toEqual([`${ESC}_Gi=18497;OK${ESC}\\`]);
		expect(writes.map((write) => new TextDecoder().decode(write))).toEqual([
			'render placeholders',
		]);
		const [imageLayer] = grid.children;
		expect(imageLayer.className).toBe('term-image-layer');
		const [image] = imageLayer.children;
		expect(image.className).toBe('term-image');
		expect(image.style).toMatchObject({
			height: '144px',
			left: '24px',
			top: '80px',
			width: '144px',
		});
		expect(image.src).toBe('blob:test-1');

		bridge.write(kittyCommand('a=d,d=I,i=42'));

		expect(image.removed).toBeTrue();
		expect(document.revokedUrls).toEqual(['blob:test-1']);
		bridge.destroy();
		expect(imageLayer.removed).toBeTrue();
	});
});
