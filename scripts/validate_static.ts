import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const STATIC_OUTPUT_DIRECTORY = path.join(PROJECT_ROOT, 'dist-static');
const HTML_EXTENSION = '.html';
const MINIMUM_EXPECTED_PAGE_COUNT = 20;
const FORBIDDEN_FRAMEWORK_MARKERS = [
	'__VINEXT',
	'/_next/static/',
	'bootstrap.rsc',
	'react-server-dom',
	'vinext',
] as const;
const REQUIRED_OPEN_GRAPH_PROPERTIES = [
	'og:description',
	'og:image',
	'og:image:alt',
	'og:locale',
	'og:site_name',
	'og:title',
	'og:type',
	'og:url',
] as const;
const REQUIRED_TWITTER_NAMES = [
	'twitter:card',
	'twitter:creator',
	'twitter:description',
	'twitter:image',
	'twitter:image:alt',
	'twitter:site',
	'twitter:title',
] as const;
const TAG_ATTRIBUTE_REGEX = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const LINK_TAG_REGEX = /<link\b[^>]*>/g;
const META_TAG_REGEX = /<meta\b[^>]*>/g;
const HREF_REGEX = /\shref=(?:"([^"]+)"|'([^']+)')/g;

interface HtmlDocument {
	html: string;
	relativePath: string;
}

const generatedHtmlDocuments = await readHtmlDocuments();
if (generatedHtmlDocuments.length < MINIMUM_EXPECTED_PAGE_COUNT) {
	throw new Error(
		`Astro generated ${generatedHtmlDocuments.length} pages; expected at least ${MINIMUM_EXPECTED_PAGE_COUNT}`
	);
}

assertNoForbiddenFrameworkMarkers(generatedHtmlDocuments);
assertCompleteSocialMetadata(generatedHtmlDocuments);
await assertInternalLinksResolve(generatedHtmlDocuments);

console.log(`Validated ${generatedHtmlDocuments.length} static HTML pages.`);

async function readHtmlDocuments(): Promise<HtmlDocument[]> {
	const entries = await readdir(STATIC_OUTPUT_DIRECTORY, { recursive: true });
	const htmlPaths = entries.filter((entry) => entry.endsWith(HTML_EXTENSION));

	return await Promise.all(
		htmlPaths.map(async (relativePath) => ({
			html: await readFile(path.join(STATIC_OUTPUT_DIRECTORY, relativePath), 'utf8'),
			relativePath,
		}))
	);
}

function assertNoForbiddenFrameworkMarkers(documents: readonly HtmlDocument[]): void {
	for (const { html, relativePath } of documents) {
		const marker = FORBIDDEN_FRAMEWORK_MARKERS.find((candidate) =>
			html.toLowerCase().includes(candidate.toLowerCase())
		);
		if (marker) {
			throw new Error(`${relativePath} contains obsolete framework marker ${marker}`);
		}
	}
}

function assertCompleteSocialMetadata(documents: readonly HtmlDocument[]): void {
	const incompletePages: string[] = [];

	for (const { html, relativePath } of documents) {
		const metaAttributes = [...html.matchAll(META_TAG_REGEX)].map(([tag]) =>
			getTagAttributes(tag)
		);
		const linkAttributes = [...html.matchAll(LINK_TAG_REGEX)].map(([tag]) =>
			getTagAttributes(tag)
		);
		const openGraphProperties = new Set(
			metaAttributes
				.map(({ property }) => property)
				.filter((value): value is string => value !== undefined)
		);
		const twitterNames = new Set(
			metaAttributes
				.map(({ name }) => name)
				.filter((value): value is string => value !== undefined)
		);
		const hasCanonicalLink = linkAttributes.some(({ rel }) => rel === 'canonical');
		const missingFields = [
			...(hasCanonicalLink ? [] : ['canonical link']),
			...REQUIRED_OPEN_GRAPH_PROPERTIES.filter(
				(property) => !openGraphProperties.has(property)
			),
			...REQUIRED_TWITTER_NAMES.filter((name) => !twitterNames.has(name)),
		];

		if (missingFields.length > 0) {
			incompletePages.push(`${relativePath}: ${missingFields.join(', ')}`);
		}
	}

	if (incompletePages.length > 0) {
		throw new Error(`Static pages are missing metadata:\n${incompletePages.join('\n')}`);
	}
}

async function assertInternalLinksResolve(documents: readonly HtmlDocument[]): Promise<void> {
	const internalLinks = new Map<string, { href: string; relativePath: string }>();

	for (const { html, relativePath } of documents) {
		for (const match of html.matchAll(HREF_REGEX)) {
			const href = match[1] ?? match[2];
			if (!href?.startsWith('/') || href.startsWith('//')) {
				continue;
			}

			const targetPath = toStaticOutputPath(href);
			if (!targetPath) {
				continue;
			}

			internalLinks.set(`${relativePath} -> ${href}`, { href: targetPath, relativePath });
		}
	}

	const checkedLinks = await Promise.all(
		[...internalLinks.entries()].map(async ([description, { href }]) => {
			const exists = await access(href)
				.then(() => true)
				.catch(() => false);
			return exists ? null : description;
		})
	);
	const missingLinks = checkedLinks.filter((link): link is string => link !== null);

	if (missingLinks.length > 0) {
		throw new Error(`Static pages contain broken internal links:\n${missingLinks.join('\n')}`);
	}
}

function toStaticOutputPath(href: string): string | null {
	const { pathname } = new URL(href, 'https://hotaisle.xyz');
	const decodedPathname = decodeURIComponent(pathname);

	if (decodedPathname.startsWith('/api/')) {
		return null;
	}

	if (decodedPathname === '/') {
		return path.join(STATIC_OUTPUT_DIRECTORY, 'index.html');
	}

	const relativePath = decodedPathname.replace(/^\/|\/$/g, '');
	if (!relativePath) {
		return path.join(STATIC_OUTPUT_DIRECTORY, 'index.html');
	}

	if (path.extname(relativePath)) {
		return path.join(STATIC_OUTPUT_DIRECTORY, relativePath);
	}

	return path.join(STATIC_OUTPUT_DIRECTORY, relativePath, 'index.html');
}

function getTagAttributes(tag: string): Record<string, string> {
	const attributes: Record<string, string> = {};
	const tagBody = tag.slice(tag.indexOf(' ') + 1, tag.lastIndexOf('>'));

	for (const match of tagBody.matchAll(TAG_ATTRIBUTE_REGEX)) {
		const [, name, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
		if (!name) {
			continue;
		}

		attributes[name.toLowerCase()] =
			doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? '';
	}

	return attributes;
}
