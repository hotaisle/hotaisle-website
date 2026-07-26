import { type CollectionEntry, getCollection } from 'astro:content';
import { type SearchResult, STATIC_SEARCH_PAGES } from '@/lib/search.ts';

const HTML_TAG_REGEX = /<[^>]+>/g;
const HTML_ENTITY_REGEX = /&(?:[a-zA-Z]+|#\d+|#x[\da-fA-F]+);/g;
const WHITESPACE_REGEX = /\s+/g;

const toSearchText = (html: string): string =>
	html
		.replace(HTML_TAG_REGEX, ' ')
		.replace(HTML_ENTITY_REGEX, ' ')
		.replace(WHITESPACE_REGEX, ' ')
		.trim();

export const buildSearchIndex = async (): Promise<SearchResult[]> => {
	const [blogEntries, policyEntries] = await Promise.all([
		getCollection('blog'),
		getCollection('policies'),
	]);

	return [
		...STATIC_SEARCH_PAGES,
		...blogEntries.map((entry: CollectionEntry<'blog'>) => ({
			category: 'Blog' as const,
			description: entry.data.description || 'Read our latest blog post.',
			searchText: toSearchText(entry.data.contentHtml),
			title: entry.data.title,
			type: 'Article',
			url: `/blog/${entry.id}`,
		})),
		...policyEntries.map((entry: CollectionEntry<'policies'>) => ({
			category: 'Policy' as const,
			description: entry.data.description || 'Legal document.',
			searchText: toSearchText(entry.rendered?.html ?? ''),
			title: entry.data.title,
			type: 'Legal',
			url: `/policies/${entry.id}`,
		})),
	];
};
