import { describe, expect, it } from 'bun:test';
import { createPageMetadata } from '@/lib/metadata.ts';

describe('createPageMetadata', () => {
	it('creates complete canonical and social metadata for a page-specific share image', () => {
		const metadata = createPageMetadata({
			description: 'Provision isolated AMD GPU compute for production inference.',
			path: '/quick-start/',
			title: 'Quick Start',
		});

		expect(metadata.alternates.canonical).toBe('https://hotaisle.xyz/quick-start');
		expect(metadata.openGraph.url).toBe('https://hotaisle.xyz/quick-start');
		expect(metadata.twitter.card).toBe('summary_large_image');
		expect(metadata.keywords).toContain('Quick Start');
		expect(metadata.openGraph.images[0]).toMatchObject({
			url: 'https://hotaisle.xyz/assets/og/hotaisle-quick-start-v1.png',
			height: 630,
			type: 'image/png',
			width: 1200,
		});
	});

	it.each([
		{ path: '/', filename: 'home' },
		{ path: '/pricing/', filename: 'pricing' },
		{ path: '/docs/api', filename: 'api' },
		{ path: '/blog/post-without-a-cover', filename: 'home' },
	])('selects a branded preview for $path', ({ path, filename }) => {
		const metadata = createPageMetadata({
			description: 'Hot Aisle infrastructure.',
			path,
			title: 'Hot Aisle',
		});
		expect(metadata.openGraph.images[0]).toMatchObject({
			url: `https://hotaisle.xyz/assets/og/hotaisle-${filename}-v1.png`,
			height: 630,
			width: 1200,
		});
		expect(metadata.twitter.images).toEqual(metadata.openGraph.images);
	});

	it('uses page keywords and does not claim default image dimensions for custom imagery', () => {
		const metadata = createPageMetadata({
			description: 'AMD Instinct MI300X compute for production inference.',
			image: '/assets/mi300x/mi300x-inference-pixel-art.png',
			imageAlt: 'An AMD Instinct MI300X accelerator',
			keywords: ['AMD MI300X', 'production inference'],
			path: '/mi300x',
			title: 'AMD MI300X',
		});

		expect(metadata.keywords).toEqual(
			expect.arrayContaining(['AMD MI300X', 'production inference'])
		);
		expect(metadata.openGraph.images[0]).toMatchObject({
			alt: 'An AMD Instinct MI300X accelerator',
			url: 'https://hotaisle.xyz/assets/mi300x/mi300x-inference-pixel-art.png',
			type: 'image/png',
		});
		expect(metadata.openGraph.images[0]).not.toHaveProperty('height');
		expect(metadata.openGraph.images[0]).not.toHaveProperty('width');
	});
});
