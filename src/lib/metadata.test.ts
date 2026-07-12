import { describe, expect, it } from 'bun:test';
import { createPageMetadata } from '@/lib/metadata.ts';

describe('createPageMetadata', () => {
	it('creates complete canonical and social metadata for the default share image', () => {
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
			height: 630,
			type: 'image/png',
			width: 1200,
		});
	});

	it('uses page keywords and does not claim default image dimensions for custom imagery', () => {
		const metadata = createPageMetadata({
			description: 'AMD Instinct MI300X compute for production inference.',
			image: '/assets/mi300x/mi300x-inference-pixel-art.png',
			keywords: ['AMD MI300X', 'production inference'],
			path: '/mi300x',
			title: 'AMD MI300X',
		});

		expect(metadata.keywords).toEqual(
			expect.arrayContaining(['AMD MI300X', 'production inference'])
		);
		expect(metadata.openGraph.images[0]).toMatchObject({ type: 'image/png' });
		expect(metadata.openGraph.images[0]).not.toHaveProperty('height');
		expect(metadata.openGraph.images[0]).not.toHaveProperty('width');
	});
});
