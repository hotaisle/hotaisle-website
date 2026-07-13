import { describe, expect, it } from 'bun:test';
import {
	hasVinextClientChunkReference,
	stripVinextClientChunkReferences,
} from '@/lib/static-export.ts';

describe('stripVinextClientChunkReferences', () => {
	const cases = [
		{
			expected:
				'<script>window.theme = "dark";</script><script src="https://www.googletagmanager.com/gtm.js"></script><link href="https://fonts.googleapis.com/css2?family=Inter" rel="preload">',
			input: '<script async src="/_next/static/chunks/rolldown-runtime.js" type="module"></script><script src="/_next/static/chunks/framework.js" type="module"></script><link fetchpriority=low href=/_next/static/chunks/index.js rel=modulepreload><link href=/_next/static/chunks/Navbar.js rel=modulepreload><script>window.theme = "dark";</script><script src="https://www.googletagmanager.com/gtm.js"></script><link href="https://fonts.googleapis.com/css2?family=Inter" rel="preload">',
			name: 'removes Vinext client scripts and module preloads while preserving inline, third-party, and style preloads',
		},
		{
			expected: '<script src="/assets/analytics.js"></script>',
			input: '<script src="/assets/analytics.js"></script>',
			name: 'preserves non-chunk script assets',
		},
	] as const;

	for (const { expected, input, name } of cases) {
		it(name, () => {
			expect(stripVinextClientChunkReferences(input)).toBe(expected);
		});
	}
});

describe('hasVinextClientChunkReference', () => {
	const cases = [
		{
			expected: true,
			input: '<link fetchpriority=low href=/_next/static/chunks/index.js rel=modulepreload>',
		},
		{
			expected: false,
			input: '<script src="https://www.googletagmanager.com/gtm.js"></script>',
		},
	] as const;

	for (const { expected, input } of cases) {
		it(`returns ${expected} for ${input}`, () => {
			expect(hasVinextClientChunkReference(input)).toBe(expected);
		});
	}
});
