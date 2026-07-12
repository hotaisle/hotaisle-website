import { describe, expect, it } from 'bun:test';
import { toCanonicalDocumentHref } from '@/lib/canonical-href.ts';

describe('toCanonicalDocumentHref', () => {
	it('normalizes internal document hrefs to slashless routes', () => {
		const testCases = [
			{ expected: '/', href: '/' },
			{ expected: '/pricing', href: '/pricing' },
			{ expected: '/pricing', href: '/pricing/' },
			{ expected: '/pricing?plan=vm', href: '/pricing?plan=vm' },
			{ expected: '/pricing#hourly', href: '/pricing#hourly' },
			{ expected: '/blog/example-post', href: '/blog/example-post' },
			{
				expected: '/assets/branding/hotaisle-favicon.svg',
				href: '/assets/branding/hotaisle-favicon.svg',
			},
			{ expected: 'https://example.com/pricing', href: 'https://example.com/pricing' },
			{ expected: '//cdn.example.com/file.js', href: '//cdn.example.com/file.js' },
			{ expected: '#specs', href: '#specs' },
			{ expected: 'mailto:hello@hotaisle.ai', href: 'mailto:hello@hotaisle.ai' },
		] as const;

		for (const { expected, href } of testCases) {
			expect(toCanonicalDocumentHref(href)).toBe(expected);
		}
	});
});
