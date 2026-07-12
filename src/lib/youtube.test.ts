import { describe, expect, it } from 'bun:test';
import { embedStandaloneYouTubeLinks, toYouTubeEmbedUrl } from '@/lib/youtube.ts';

describe('toYouTubeEmbedUrl', () => {
	const cases = [
		{
			expected: 'https://www.youtube-nocookie.com/embed/VKzoWsxsA38',
			input: 'https://www.youtube.com/watch?v=VKzoWsxsA38',
		},
		{
			expected: 'https://www.youtube-nocookie.com/embed/XgfcOGqBRkI',
			input: 'https://youtu.be/XgfcOGqBRkI?si=example',
		},
		{
			expected: 'https://www.youtube-nocookie.com/embed/WW1j7hZ4iD0',
			input: 'https://www.youtube.com/shorts/WW1j7hZ4iD0',
		},
		{ expected: null, input: 'https://example.com/watch?v=VKzoWsxsA38' },
		{ expected: null, input: 'https://youtu.be/not-a-video-id' },
	] as const;

	for (const { expected, input } of cases) {
		it(`converts ${input}`, () => {
			expect(toYouTubeEmbedUrl(input)).toBe(expected);
		});
	}
});

describe('embedStandaloneYouTubeLinks', () => {
	const cases = [
		{
			expected: '<iframe',
			input: '<p><a href="https://www.youtube.com/watch?v=VKzoWsxsA38" rel="noopener">https://www.youtube.com/watch?v=VKzoWsxsA38</a></p>',
		},
		{
			expected: '<p>Watch <a href="https://youtu.be/XgfcOGqBRkI">this video</a></p>',
			input: '<p>Watch <a href="https://youtu.be/XgfcOGqBRkI">this video</a></p>',
		},
	] as const;

	for (const { expected, input } of cases) {
		it(`transforms ${input}`, () => {
			expect(embedStandaloneYouTubeLinks(input)).toContain(expected);
		});
	}
});
