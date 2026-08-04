import { describe, expect, test } from 'bun:test';
import { Renderer } from '@wterm/dom';

const DEFAULT_COLOR = 256;
const TERMINAL_TEXT = 'Checkout: https://admin.hotaisle.app/r/example.';
const SSH_COMMAND_TEXT = 'SSH: ssh hotaisle@23.183.40.70';
const SSH_URL_TEXT = 'Open ssh://hotaisle@23.183.40.70';
const FLAG_DIM = 0x02;

const toCell = (character: string) => ({
	bg: DEFAULT_COLOR,
	char: character.codePointAt(0) ?? 32,
	fg: DEFAULT_COLOR,
	flags: 0,
	width: 1,
});

const renderCell = (cell: object): string => {
	const renderer: object = Reflect.construct(Renderer, [{}]);
	Reflect.set(renderer, 'cols', 1);
	const row = { innerHTML: '' };
	const buildRowContent = Reflect.get(renderer, '_buildRowContent');

	Reflect.apply(buildRowContent, renderer, [row, () => cell, 1, -1]);
	return row.innerHTML;
};

describe('terminal renderer', () => {
	test('turns web URLs into safe links without including trailing punctuation', () => {
		const renderer: object = Reflect.construct(Renderer, [{}]);
		Reflect.set(renderer, 'cols', TERMINAL_TEXT.length);
		const row = { innerHTML: '' };
		const cells = Array.from(TERMINAL_TEXT, toCell);
		const readCell = (column: number) => cells[column] ?? toCell(' ');
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');

		Reflect.apply(buildRowContent, renderer, [row, readCell, TERMINAL_TEXT.length, -1]);

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
		const renderer: object = Reflect.construct(Renderer, [{}]);
		Reflect.set(renderer, 'cols', text.length);
		const row = { innerHTML: '' };
		const cells = Array.from(text, toCell);
		const readCell = (column: number) => cells[column] ?? toCell(' ');
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');

		Reflect.apply(buildRowContent, renderer, [row, readCell, text.length, -1]);

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
			cell: { ...toCell('A'), flags: FLAG_DIM },
			expected: 'opacity:var(--term-dim-opacity,0.5);',
			name: 'uses the theme-specific faint opacity',
		},
	])('$name', ({ cell, expected }) => {
		expect(renderCell(cell)).toContain(expected);
	});

	test('preserves two-column characters and skips their continuation cells', () => {
		const renderer: object = Reflect.construct(Renderer, [{}]);
		Reflect.set(renderer, 'cols', 3);
		const row = { innerHTML: '' };
		const cells = [{ ...toCell('界'), width: 2 }, { ...toCell(' '), width: 0 }, toCell('A')];
		const readCell = (column: number) => cells[column] ?? toCell(' ');
		const buildRowContent = Reflect.get(renderer, '_buildRowContent');

		Reflect.apply(buildRowContent, renderer, [row, readCell, cells.length, -1]);

		expect(row.innerHTML).toContain(
			'<span class="term-wide" style="width:calc(2 * var(--term-cell-width, 1ch));">界</span>'
		);
		expect(row.innerHTML).toContain(
			'<span style="width:calc(1 * var(--term-cell-width, 1ch));">A</span>'
		);
	});
});
