import { describe, expect, it } from 'bun:test';
import { enhanceBlogTldrBlocks } from '@/lib/blog-tldr.ts';

describe('enhanceBlogTldrBlocks', () => {
	it('transforms labeled summaries and preserves ordinary blockquotes', () => {
		const testCases = [
			{
				expected:
					'<aside aria-label="TL;DR" class="blog-tldr"><p class="blog-tldr__label">TL;DR</p><p class="blog-tldr__summary">The short explanation.</p></aside>',
				html: '<blockquote>\n<p><strong>TL;DR:</strong> The short explanation.</p>\n</blockquote>',
			},
			{
				expected: '<blockquote><p>An ordinary quotation.</p></blockquote>',
				html: '<blockquote><p>An ordinary quotation.</p></blockquote>',
			},
		] as const;

		for (const { expected, html } of testCases) {
			expect(enhanceBlogTldrBlocks(html)).toBe(expected);
		}
	});
});
