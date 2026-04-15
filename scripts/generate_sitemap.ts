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
		url: `${BASE_URL}${route}`,
		lastmod: CURRENT_ISO_DATE,
		changefreq: 'weekly',
		priority: route === '' ? 1 : 0.8,
	}));
}

function createBlogEntries(): SitemapEntry[] {
	return BLOG_POSTS.map((post) => ({
		url: `${BASE_URL}/blog/${post.slug}`,
		lastmod: post.date,
		changefreq: 'monthly',
		priority: 0.6,
	}));
}

function createPolicyEntries(): SitemapEntry[] {
	return POLICIES.map((policy) => ({
		url: `${BASE_URL}/policies/${policy.slug}`,
		lastmod: CURRENT_ISO_DATE,
		changefreq: 'yearly',
		priority: 0.5,
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
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
