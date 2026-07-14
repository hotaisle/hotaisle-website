import { MI300X_VM_PRICE } from '@/lib/pricing.ts';

export interface SearchResult {
	category: 'Page' | 'Blog' | 'Policy';
	description: string;
	searchText?: string;
	title: string;
	type: string;
	url: string;
}

const DEFAULT_SEARCH_LIMIT = 8;
const MIN_QUERY_LENGTH = 2;
const TITLE_EXACT_SCORE = 80;
const TITLE_TERM_SCORE = 20;
const DESCRIPTION_EXACT_SCORE = 30;
const DESCRIPTION_TERM_SCORE = 8;
const SEARCH_TEXT_EXACT_SCORE = 18;
const SEARCH_TEXT_TERM_SCORE = 4;
const TYPE_TERM_SCORE = 6;

interface ScoredSearchResult {
	result: SearchResult;
	score: number;
}

export const STATIC_SEARCH_PAGES: SearchResult[] = [
	{
		category: 'Page',
		description: 'AMD Exclusive AI Cloud. Direct access to AMD MI300x GPUs.',
		title: 'Home',
		type: 'Page',
		url: '/',
	},
	{
		category: 'Page',
		description: 'Dell PowerEdge XE9680 with 8x AMD MI300x GPUs.',
		title: 'Supercomputer (Compute)',
		type: 'Product',
		url: '/compute',
	},
	{
		category: 'Page',
		description: 'Tier 5 Platinum Secure Facilities in Grand Rapids, MI.',
		title: 'Datacenter',
		type: 'Infrastructure',
		url: '/datacenter',
	},
	{
		category: 'Page',
		description: '400Gbps InfiniBand Fabric & Custom Topology.',
		title: 'Networking',
		type: 'Infrastructure',
		url: '/networking',
	},
	{
		category: 'Page',
		description: `Transparent GPU pricing starting at ${MI300X_VM_PRICE}.`,
		title: 'Pricing',
		type: 'Page',
		url: '/pricing',
	},
	{
		category: 'Page',
		description: 'Custom high-performance compute clusters.',
		title: 'Cluster Design',
		type: 'Service',
		url: '/cluster',
	},
	{
		category: 'Page',
		description: 'Our ecosystem of technology partners.',
		title: 'Partners',
		type: 'Page',
		url: '/partners',
	},
	{
		category: 'Page',
		description: 'Get up and running with Hot Aisle in 60 seconds.',
		title: 'Quick Start Guide',
		type: 'Guide',
		url: '/quick-start',
	},
	{
		category: 'Page',
		description: 'Performance analysis of AMD MI300x.',
		title: 'Benchmarks',
		type: 'Research',
		url: '/benchmarks-and-analysis',
	},
	{
		category: 'Page',
		description: 'Technical specifications of the AMD MI300x Accelerator.',
		title: 'MI300x Details',
		type: 'Hardware',
		url: '/mi300x',
	},
	{
		category: 'Page',
		description: 'Our mission and company background.',
		title: 'About Us',
		type: 'Page',
		url: '/about',
	},
	{
		category: 'Page',
		description: 'Get in touch with our team.',
		title: 'Contact',
		type: 'Page',
		url: '/contact',
	},
];

export function findSearchResults(
	results: SearchResult[],
	query: string,
	limit = DEFAULT_SEARCH_LIMIT
): SearchResult[] {
	const normalizedQuery = normalizeSearchText(query);
	if (normalizedQuery.length < MIN_QUERY_LENGTH) {
		return [];
	}

	const queryTerms = normalizedQuery.split(' ').filter(Boolean);
	const scoredResults: ScoredSearchResult[] = [];

	for (const result of results) {
		const score = scoreSearchResult(result, normalizedQuery, queryTerms);
		if (score <= 0) {
			continue;
		}

		scoredResults.push({ result, score });
	}

	return scoredResults
		.sort(
			(left, right) =>
				right.score - left.score || left.result.title.localeCompare(right.result.title)
		)
		.slice(0, limit)
		.map(({ result }) => result);
}

function scoreSearchResult(
	result: SearchResult,
	normalizedQuery: string,
	queryTerms: string[]
): number {
	const weightedFields = [
		{
			exactScore: TITLE_EXACT_SCORE,
			termScore: TITLE_TERM_SCORE,
			value: normalizeSearchText(result.title),
		},
		{
			exactScore: DESCRIPTION_EXACT_SCORE,
			termScore: DESCRIPTION_TERM_SCORE,
			value: normalizeSearchText(result.description),
		},
		{
			exactScore: SEARCH_TEXT_EXACT_SCORE,
			termScore: SEARCH_TEXT_TERM_SCORE,
			value: normalizeSearchText(result.searchText ?? ''),
		},
		{
			exactScore: 0,
			termScore: TYPE_TERM_SCORE,
			value: normalizeSearchText(`${result.type} ${result.category}`),
		},
	] as const;
	let score = 0;

	for (const { exactScore, termScore, value } of weightedFields) {
		score += value.includes(normalizedQuery) ? exactScore : 0;
		for (const term of queryTerms) {
			score += value.includes(term) ? termScore : 0;
		}
	}

	return score;
}

function normalizeSearchText(value: string): string {
	return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
