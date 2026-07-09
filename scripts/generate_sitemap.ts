import { BLOG_POSTS } from '@/generated/blog-data.ts';
import { POLICIES } from '@/generated/static-content-data.ts';

const BASE_URL = 'https://hotaisle.xyz';
const CURRENT_ISO_DATE = new Date().toISOString();
const STATIC_ROUTES = [
	'',
	'/compute',
	'/datacenter',
	'/networking',
	'/storage',
	'/pricing',
	'/partners',
	'/cluster',
	'/quick-start',
	'/benchmarks-and-analysis',
	'/mi300x',
	'/mi355x',
	'/blog',
	'/policies',
	'/about',
	'/contact',
] as const;

interface SitemapEntry {
	changefreq: 'monthly' | 'weekly' | 'yearly';
	lastmod: string;
	priority: number;
	url: string;
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function createStaticRouteEntries(): SitemapEntry[] {
	return STATIC_ROUTES.map((route) => ({
		changefreq: 'weekly',
		lastmod: CURRENT_ISO_DATE,
		priority: route === '' ? 1 : 0.8,
		url: `${BASE_URL}${route}`,
	}));
}

function createBlogEntries(): SitemapEntry[] {
	return BLOG_POSTS.map((post) => ({
		changefreq: 'monthly',
		lastmod: post.date,
		priority: 0.6,
		url: `${BASE_URL}/blog/${post.slug}`,
	}));
}

function createPolicyEntries(): SitemapEntry[] {
	return POLICIES.map((policy) => ({
		changefreq: 'yearly',
		lastmod: CURRENT_ISO_DATE,
		priority: 0.5,
		url: `${BASE_URL}/policies/${policy.slug}`,
	}));
}

function toSitemapXml(entries: SitemapEntry[]): string {
	const xmlEntries = entries
		.map(
			(entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="https://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml" xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1" xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
${xmlEntries}
</urlset>
`;
}

export function createSitemapXml(): string {
	const entries = [
		...createStaticRouteEntries(),
		...createBlogEntries(),
		...createPolicyEntries(),
	];
	return toSitemapXml(entries);
}
