import { describe, expect, it } from 'bun:test';
import { findSearchResults, type SearchResult } from '@/lib/search.ts';

const SEARCH_RESULTS: SearchResult[] = [
	{
		category: 'Page',
		description: 'Transparent GPU pricing starting at $2.99/GPU/hr.',
		title: 'Pricing',
		type: 'Page',
		url: '/pricing',
	},
	{
		category: 'Blog',
		description:
			'A guide to running OpenCode against a self-hosted vLLM instance with predictable pricing.',
		title: 'OpenCode with vLLM on Hot Aisle',
		type: 'Article',
		url: '/blog/opencode-vllm-hotaisle',
	},
	{
		category: 'Policy',
		description: 'How we collect, use, and protect your data.',
		title: 'Privacy Policy',
		type: 'Legal',
		url: '/policies/privacy-policy',
	},
	{
		category: 'Blog',
		description: 'Build a private chat interface on Hot Aisle.',
		searchText: 'The system will run the Qwen 3.5 35B model using vLLM.',
		title: 'Creating Your Own ChatXYZ',
		type: 'Article',
		url: '/blog/chatxyz-openwebui-hotaisle',
	},
];

describe('findSearchResults', () => {
	it('ranks exact title matches before description matches', () => {
		const results = findSearchResults(SEARCH_RESULTS, 'pricing');

		expect(results.map(({ title }) => title)).toEqual([
			'Pricing',
			'OpenCode with vLLM on Hot Aisle',
		]);
	});

	it('matches descriptions and result metadata', () => {
		const testCases = [
			{ expected: 'OpenCode with vLLM on Hot Aisle', query: 'self-hosted' },
			{ expected: 'Privacy Policy', query: 'legal' },
		] as const;

		for (const { expected, query } of testCases) {
			const [firstResult] = findSearchResults(SEARCH_RESULTS, query);

			expect(firstResult?.title).toBe(expected);
		}
	});

	it('matches indexed body text', () => {
		const [firstResult] = findSearchResults(SEARCH_RESULTS, 'qwen');

		expect(firstResult?.title).toBe('Creating Your Own ChatXYZ');
	});

	it('returns no results for short or blank queries', () => {
		const testCases = ['', ' ', 'g'] as const;

		for (const query of testCases) {
			expect(findSearchResults(SEARCH_RESULTS, query)).toEqual([]);
		}
	});
});
