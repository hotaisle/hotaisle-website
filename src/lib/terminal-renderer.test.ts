import { describe, expect, test } from 'bun:test';
import { Renderer } from '@wterm/dom';

const DEFAULT_COLOR = 256;
const TERMINAL_TEXT = 'Checkout: https://admin.hotaisle.app/r/example.';
const SSH_COMMAND_TEXT = 'SSH: ssh hotaisle@23.183.40.70';
const SSH_URL_TEXT = 'Open ssh://hotaisle@23.183.40.70';
const FLAG_DIM = 0x02;
const FLAG_REVERSE = 0x20;

const toCell = (character: string) => ({
	bg: DEFAULT_COLOR,
	char: character.codePointAt(0) ?? 32,
	fg: DEFAULT_COLOR,
	flags: 0,
	width: 1,
});

const createRenderer = (columns: number): object => {
	const renderer: object = Object.create(Renderer.prototype);
	Reflect.set(renderer, 'cols', columns);
	Reflect.set(renderer, 'prevRowBg', []);
	Reflect.set(renderer, 'rowParts', new WeakMap());
	Reflect.set(renderer, 'rowBackground', new WeakMap());
	Reflect.set(renderer, 'rowText', new WeakMap());
	return renderer;
};

const createRow = () => ({ innerHTML: '', style: { background: '' } });

const renderCell = (cell: object): string => {
	const renderer = createRenderer(1);
	const row = createRow();
	const buildRowContent = Reflect.get(renderer, '_buildRowContent');

	Reflect.apply(buildRowContent, renderer, [row, () => cell, 1, -1, -1]);
	return row.innerHTML;
};

describe('terminal renderer', () => {
	test('turns web URLs into safe links without including trailing punctuation', () => {
		const renderer = createRenderer(TERMINAL_TEXT.length);
		const row = createRow();
		const cells = Array.from(TERMINAL_TEXT, toCell);
		const readCell = (column: number) => cells[column] ?? toCell(' ');
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');

		Reflect.apply(buildRowContent, renderer, [row, readCell, TERMINAL_TEXT.length, -1, -1]);

		expect(row.innerHTML).toContain(
			'<a class="term-link" href="https://admin.hotaisle.app/r/example" target="_blank" rel="noopener noreferrer">https://admin.hotaisle.app/r/example</a>.'
		);
	});

	test.each([
		{
			expected:
				'<a class="term-link" href="ssh://hotaisle@23.183.40.70" target="_blank" rel="noopener noreferrer">ssh hotaisle@23.183.40.70</a>',
			name: 'turns visible SSH commands into SSH links',
			text: SSH_COMMAND_TEXT,
		},
		{
			expected:
				'<a class="term-link" href="ssh://hotaisle@23.183.40.70" target="_blank" rel="noopener noreferrer">ssh://hotaisle@23.183.40.70</a>',
			name: 'links explicit SSH URLs',
			text: SSH_URL_TEXT,
		},
	])('$name', ({ expected, text }) => {
		const renderer = createRenderer(text.length);
		const row = createRow();
		const cells = Array.from(text, toCell);
		const readCell = (column: number) => cells[column] ?? toCell(' ');
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');

		Reflect.apply(buildRowContent, renderer, [row, readCell, text.length, -1, -1]);

		expect(row.innerHTML).toContain(expected);
	});

	test.each([
		{
			cell: { ...toCell('A'), fgRgb: 0x93_c5_fd },
			expected:
				'color:color-mix(in srgb,rgb(147,197,253) var(--term-direct-fg-weight,100%),var(--term-direct-fg-mix,transparent));',
			name: 'adjusts direct foreground colors on the default background',
		},
		{
			cell: { ...toCell('A'), bgRgb: 0x16_80_3c, fgRgb: 0xff_ff_ff },
			expected: 'color:rgb(255,255,255);background:rgb(22,128,60);',
			name: 'preserves direct foreground colors on colored backgrounds',
		},
		{
			cell: { ...toCell('A'), bgRgb: 0x93_c5_fd, flags: FLAG_REVERSE },
			expected:
				'color:color-mix(in srgb,rgb(147,197,253) var(--term-direct-fg-weight,100%),var(--term-direct-fg-mix,transparent));background:var(--term-app-fg, var(--term-fg));',
			name: 'adjusts reversed foreground colors on a default background',
		},
		{
			cell: { ...toCell('A'), fgRgb: 0x93_c5_fd, flags: FLAG_REVERSE },
			expected: 'color:var(--term-app-bg, var(--term-bg));background:rgb(147,197,253);',
			name: 'preserves direct colors used as reversed backgrounds',
		},
		{
			cell: { ...toCell('A'), flags: FLAG_DIM },
			expected: 'opacity:var(--term-dim-opacity,0.5);',
			name: 'uses the theme-specific faint opacity',
		},
	])('$name', ({ cell, expected }) => {
		expect(renderCell(cell)).toContain(expected);
	});

	test('creates a link when an existing plain-text run is redrawn as a URL', () => {
		const renderer = createRenderer(TERMINAL_TEXT.length);
		const textNode = { nodeType: 3, nodeValue: ' '.repeat(TERMINAL_TEXT.length) };
		const row = {
			...createRow(),
			childNodes: [{ childNodes: [textNode], firstChild: textNode }],
		};
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');
		Reflect.apply(buildRowContent, renderer, [
			row,
			() => toCell(' '),
			TERMINAL_TEXT.length,
			-1,
			-1,
		]);

		const cells = Array.from(TERMINAL_TEXT, toCell);
		Reflect.apply(buildRowContent, renderer, [
			row,
			(column: number) => cells[column] ?? toCell(' '),
			TERMINAL_TEXT.length,
			-1,
			-1,
		]);

		expect(row.innerHTML).toContain('<a class="term-link"');
		expect(row.innerHTML).toContain('href="https://admin.hotaisle.app/r/example"');
	});

	test('preserves two-column characters and skips their continuation cells', () => {
		const renderer = createRenderer(3);
		const row = createRow();
		const cells = [{ ...toCell('界'), width: 2 }, { ...toCell(' '), width: 0 }, toCell('A')];
		const readCell = (column: number) => cells[column] ?? toCell(' ');
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');

		Reflect.apply(buildRowContent, renderer, [row, readCell, cells.length, -1, -1]);

		expect(row.innerHTML).toContain('<span class="term-wide">界</span>');
		expect(row.innerHTML).toContain('<span>A</span>');
	});
});
