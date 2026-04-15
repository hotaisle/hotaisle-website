import { spawn } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, stat, utimes, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { minify as minifyWithRolldown } from 'rolldown/utils';
import { BLOG_POSTS } from '@/generated/blog-data.ts';
import { POLICIES } from '@/generated/static-content-data.ts';
import { appRouter } from '../node_modules/vinext/dist/routing/app-router.js';
import { createSitemapXml } from './generate_sitemap.ts';

const EXPORT_ORIGIN = 'https://static.hotaisle.local';
const HTML_CLOSE_TAG = '</html>';
const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const BLOG_ASSET_SOURCE_DIRECTORY = path.join(PROJECT_ROOT, 'content', 'blog', 'assets');
const PUBLIC_DIRECTORY = path.join(PROJECT_ROOT, 'public');
const DIST_DIRECTORY = path.join(PROJECT_ROOT, 'dist');
const STATIC_DIST_DIRECTORY = path.join(PROJECT_ROOT, 'dist-static');
const CLIENT_DIRECTORY = path.join(DIST_DIRECTORY, 'client');
const CLIENT_BLOG_ASSET_DIRECTORY = path.join(CLIENT_DIRECTORY, 'assets', 'blog');
const SITEMAP_FILE_NAME = 'sitemap.xml';
const APP_DIRECTORY = path.join(PROJECT_ROOT, 'src', 'app');
const SERVER_ENTRY_PATH = path.join(DIST_DIRECTORY, 'server', 'index.js');
const INLINE_SCRIPT_FILE_NAME = 'inline-script.js';
const DS_STORE_FILE_NAME = '.DS_Store';
const VITE_METADATA_DIRECTORY_NAME = '.vite';
const WRANGLER_CONFIG_FILE_NAME = 'wrangler.json';
const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECT_HOPS = 10;
const PRE_BLOCK_REGEX = /<pre\b[^>]*>[\s\S]*?<\/pre>/gi;
const STYLESHEET_LINK_REGEX = /<link rel="stylesheet" href="([^"]+)"([^>]*)>/g;
const STYLESHEET_PRELOAD_REGEX = /<link rel="preload" href="([^"]+\.css)" as="style"[^>]*\/?>/g;
const INDEX_HTML_SUFFIX_REGEX = /\/index\.html$/;
const WINDOWS_PATH_SEPARATOR_REGEX = /\\/g;
const UNICODE_DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASHES_REGEX = /^-+|-+$/g;
interface CssSegment {
	isString: boolean;
	value: string;
}

process.env.NODE_ENV = 'production';

await rm(STATIC_DIST_DIRECTORY, { force: true, recursive: true });

const buildProcess = spawn('bun', ['run', 'vinext', 'build'], {
	cwd: PROJECT_ROOT,
	stdio: 'inherit',
});

const exitCode = await new Promise<number>((resolve, reject) => {
	buildProcess.on('close', (code) => resolve(code ?? 1));
	buildProcess.on('error', reject);
});

if (exitCode !== 0) {
	throw new Error(`vinext build failed with exit code ${exitCode}`);
}

await syncPublicAssetsToClientOutput();
await syncBlogAssetsToClientOutput();

await cp(CLIENT_DIRECTORY, STATIC_DIST_DIRECTORY, {
	filter: (sourcePath: string) => !shouldExcludeFromStaticExport(sourcePath),
	force: true,
	recursive: true,
});

await writeSitemapFiles();

const routes = await appRouter(APP_DIRECTORY);
const exportedPaths = new Set<string>();

for (const route of routes) {
	if (!route.pagePath || route.isDynamic) {
		continue;
	}

	exportedPaths.add(route.pattern);
}

for (const post of BLOG_POSTS) {
	exportedPaths.add(`/blog/${post.slug}`);
}

for (const policy of POLICIES) {
	exportedPaths.add(`/policies/${policy.slug}`);
}

const serverModule = await import(pathToFileURL(SERVER_ENTRY_PATH).href);
const renderRoute = serverModule.default as (request: Request) => Promise<Response>;

if (typeof renderRoute !== 'function') {
	throw new Error('vinext build did not produce a callable server handler');
}

for (const routePath of exportedPaths) {
	const requestPath = toRequestPath(routePath);
	const htmlResponse = await renderStaticRoute(renderRoute, requestPath, 'text/html');

	if (!htmlResponse.ok) {
		throw new Error(`Failed to export ${routePath}: ${htmlResponse.status}`);
	}
	const rawHtml = await htmlResponse.text();
	const html = await normalizeExportedHtml(rawHtml, routePath);
	const outputPath = toOutputPath(routePath);
	const fullPath = path.join(STATIC_DIST_DIRECTORY, outputPath);

	await mkdir(path.dirname(fullPath), { recursive: true });
	await writeFile(fullPath, html, 'utf8');
}

await scrubExportedHtmlFiles(STATIC_DIST_DIRECTORY);

function toOutputPath(routePath: string): string {
	if (routePath === '/') {
		return 'index.html';
	}

	const normalizedPath = routePath.replace(/^\/+|\/+$/g, '');
	return path.join(normalizedPath, 'index.html');
}

function toRequestPath(routePath: string): string {
	if (routePath === '/') {
		return routePath;
	}

	return routePath.endsWith('/') ? routePath : `${routePath}/`;
}

async function normalizeExportedHtml(html: string, routePath: string): Promise<string> {
	const htmlDocument = stripTrailingContentAfterHtml(html);
	const htmlWithoutClientBootstrap = shouldStripClientBootstrap(routePath)
		? stripClientBootstrap(htmlDocument)
		: htmlDocument;
	const htmlWithOptimizedStyles = shouldInlineStyles(routePath)
		? await inlineStylesheetLinks(htmlWithoutClientBootstrap)
		: htmlWithoutClientBootstrap;

	return await minifyExportedHtml(htmlWithOptimizedStyles);
}

async function writeSitemapFiles(): Promise<void> {
	const sitemapXml = createSitemapXml();
	const outputPaths = [
		path.join(CLIENT_DIRECTORY, SITEMAP_FILE_NAME),
		path.join(STATIC_DIST_DIRECTORY, SITEMAP_FILE_NAME),
	];

	for (const outputPath of outputPaths) {
		await mkdir(path.dirname(outputPath), { recursive: true });
		await writeFile(outputPath, sitemapXml, 'utf8');
	}
}

async function syncPublicAssetsToClientOutput(): Promise<void> {
	if (!(await directoryExists(PUBLIC_DIRECTORY))) {
		return;
	}

	await cp(PUBLIC_DIRECTORY, CLIENT_DIRECTORY, {
		filter: (sourcePath: string) => !shouldExcludeFromStaticExport(sourcePath),
		force: true,
		recursive: true,
	});
}

async function syncBlogAssetsToClientOutput(): Promise<void> {
	if (!(await directoryExists(BLOG_ASSET_SOURCE_DIRECTORY))) {
		return;
	}

	await copyBlogAssetsToOutput(BLOG_ASSET_SOURCE_DIRECTORY, CLIENT_BLOG_ASSET_DIRECTORY);
}

async function directoryExists(directoryPath: string): Promise<boolean> {
	try {
		const directoryStats = await readdir(directoryPath, { withFileTypes: true });
		return Array.isArray(directoryStats);
	} catch {
		return false;
	}
}

function toSlugSegment(segment: string): string {
	const parsed = path.parse(segment);
	const normalizedBaseName = (parsed.name || parsed.base)
		.normalize('NFKD')
		.replace(UNICODE_DIACRITICS_REGEX, '')
		.toLowerCase()
		.replace(NON_ALPHANUMERIC_REGEX, '-')
		.replace(EDGE_DASHES_REGEX, '');
	const safeBaseName = normalizedBaseName || 'file';
	const normalizedExtension = parsed.ext.toLowerCase();

	return normalizedExtension ? `${safeBaseName}${normalizedExtension}` : safeBaseName;
}

async function copyBlogAssetsToOutput(
	sourceDirectory: string,
	destinationDirectory: string
): Promise<void> {
	await mkdir(destinationDirectory, { recursive: true });
	const directoryEntries = await readdir(sourceDirectory, { withFileTypes: true });

	for (const directoryEntry of directoryEntries) {
		const sourcePath = path.join(sourceDirectory, directoryEntry.name);
		const destinationPath = path.join(destinationDirectory, toSlugSegment(directoryEntry.name));

		if (directoryEntry.isDirectory()) {
			await copyBlogAssetsToOutput(sourcePath, destinationPath);
			continue;
		}

		if (!directoryEntry.isFile()) {
			continue;
		}

		const [sourceStats, destinationStats] = await Promise.all([
			stat(sourcePath),
			stat(destinationPath).catch(() => null),
		]);
		const shouldSkipCopy =
			destinationStats &&
			destinationStats.size === sourceStats.size &&
			destinationStats.mtimeMs >= sourceStats.mtimeMs;

		if (shouldSkipCopy) {
			continue;
		}

		await cp(sourcePath, destinationPath, { force: true });
		await utimes(destinationPath, sourceStats.atime, sourceStats.mtime);
	}
}

function shouldStripClientBootstrap(_routePath: string): boolean {
	return true;
}

function shouldInlineStyles(routePath: string): boolean {
	return routePath === '/';
}

function stripTrailingContentAfterHtml(html: string): string {
	const htmlCloseIndex = html.lastIndexOf(HTML_CLOSE_TAG);
	if (htmlCloseIndex === -1) {
		return html;
	}

	return html.slice(0, htmlCloseIndex + HTML_CLOSE_TAG.length);
}

async function renderStaticRoute(
	renderRoute: (request: Request) => Promise<Response>,
	requestPath: string,
	accept: string
): Promise<Response> {
	let currentUrl = new URL(requestPath, EXPORT_ORIGIN);

	for (let hop = 0; hop < MAX_REDIRECT_HOPS; hop += 1) {
		const response = await renderRoute(
			new Request(currentUrl, {
				headers: { accept },
			})
		);

		if (!REDIRECT_STATUS_CODES.has(response.status)) {
			return response;
		}

		const location = response.headers.get('location');
		if (!location) {
			throw new Error(`Redirect from ${currentUrl.pathname} missing location header`);
		}

		const nextUrl = new URL(location, currentUrl);
		if (nextUrl.origin !== EXPORT_ORIGIN) {
			throw new Error(
				`External redirect while exporting ${currentUrl.pathname}: ${location}`
			);
		}

		currentUrl = nextUrl;
	}

	throw new Error(`Too many redirects while exporting ${requestPath}`);
}

async function minifyExportedHtml(html: string): Promise<string> {
	const htmlWithMinifiedScripts = await minifyInlineBlocks(html, 'script');
	const htmlWithMinifiedStyles = await minifyInlineBlocks(htmlWithMinifiedScripts, 'style');

	return collapseInterTagWhitespaceOutsidePre(htmlWithMinifiedStyles).trim();
}

function collapseInterTagWhitespaceOutsidePre(html: string): string {
	const preservedPreBlocks: string[] = [];
	let protectedHtml = html;

	protectedHtml = protectedHtml.replace(PRE_BLOCK_REGEX, (preBlock: string) => {
		const placeholder = `__HOTAISLE_PRE_BLOCK_${preservedPreBlocks.length}__`;
		preservedPreBlocks.push(preBlock);
		return placeholder;
	});

	let restoredHtml = protectedHtml.replace(/>\s+</g, '><');

	for (const [index, preBlock] of preservedPreBlocks.entries()) {
		const placeholder = `__HOTAISLE_PRE_BLOCK_${index}__`;
		restoredHtml = restoredHtml.replace(placeholder, preBlock);
	}

	return restoredHtml;
}

function stripClientBootstrap(html: string): string {
	return html
		.replace(STYLESHEET_PRELOAD_REGEX, '')
		.replace(
			/<link rel="modulepreload" href="\/assets\/[^"]+\.js"(?: crossorigin="")?\s*\/>/g,
			''
		)
		.replace(/<script>self\.__VINEXT_RSC_PARAMS__=.*?<\/script>/g, '')
		.replace(/<script>self\.__VINEXT_RSC_NAV__=.*?<\/script>/g, '')
		.replace(/<script id="_R_">[\s\S]*?<\/script>/g, '');
}

async function inlineStylesheetLinks(html: string): Promise<string> {
	const stylesheetMatches = [...html.matchAll(STYLESHEET_LINK_REGEX)];

	if (stylesheetMatches.length === 0) {
		return html;
	}

	let transformedHtml = html;

	for (const stylesheetMatch of stylesheetMatches) {
		const [fullMatch, href] = stylesheetMatch;
		const stylesheetPath = toLocalAssetPath(href);

		if (!stylesheetPath) {
			continue;
		}

		const stylesheetContents = await readFile(stylesheetPath, 'utf8');
		const inlineTag = `<style data-inline-stylesheet-href="${href}">${stylesheetContents}</style>`;
		transformedHtml = transformedHtml.replace(fullMatch, inlineTag);
	}

	return transformedHtml;
}

function toLocalAssetPath(href: string): string | null {
	if (!href.startsWith('/assets/')) {
		return null;
	}

	return path.join(STATIC_DIST_DIRECTORY, href.slice(1));
}

async function scrubExportedHtmlFiles(directory: string): Promise<void> {
	const directoryEntries = await readdir(directory, { withFileTypes: true });

	for (const directoryEntry of directoryEntries) {
		const entryPath = path.join(directory, directoryEntry.name);

		if (directoryEntry.isDirectory()) {
			await scrubExportedHtmlFiles(entryPath);
			continue;
		}

		if (!(directoryEntry.isFile() && entryPath.endsWith('.html'))) {
			continue;
		}

		const routePath = toRoutePathFromHtmlFile(entryPath);
		if (!shouldStripClientBootstrap(routePath)) {
			continue;
		}

		const html = await readFile(entryPath, 'utf8');
		const strippedHtml = stripClientBootstrap(html);

		if (strippedHtml !== html) {
			await writeFile(entryPath, strippedHtml, 'utf8');
		}
	}
}

function toRoutePathFromHtmlFile(entryPath: string): string {
	const relativePath = path.relative(STATIC_DIST_DIRECTORY, entryPath);
	if (relativePath === 'index.html') {
		return '/';
	}

	const normalizedPath = relativePath
		.replace(INDEX_HTML_SUFFIX_REGEX, '')
		.replace(WINDOWS_PATH_SEPARATOR_REGEX, '/');
	return `/${normalizedPath}`;
}

async function minifyInlineBlocks(html: string, tagName: 'script' | 'style'): Promise<string> {
	const tagPattern =
		tagName === 'script'
			? /<script([^>]*)>([\s\S]*?)<\/script>/g
			: /<style([^>]*)>([\s\S]*?)<\/style>/g;

	const matches = Array.from(html.matchAll(tagPattern));
	if (matches.length === 0) {
		return html;
	}

	let minifiedHtml = '';
	let lastIndex = 0;

	for (const match of matches) {
		const [fullMatch, attributes, content] = match;
		const matchIndex = match.index ?? 0;

		minifiedHtml += html.slice(lastIndex, matchIndex);

		const nextContent = await minifyInlineBlockContent(tagName, attributes, content);
		minifiedHtml += `<${tagName}${attributes}>${nextContent}</${tagName}>`;

		lastIndex = matchIndex + fullMatch.length;
	}

	minifiedHtml += html.slice(lastIndex);
	return minifiedHtml;
}

async function minifyInlineBlockContent(
	tagName: 'script' | 'style',
	attributes: string,
	content: string
): Promise<string> {
	if (content.trim().length === 0) {
		return '';
	}

	if (tagName === 'script') {
		const normalizedAttributes = attributes.toLowerCase();
		if (
			normalizedAttributes.includes(' src=') ||
			normalizedAttributes.includes('type="application/ld+json"') ||
			normalizedAttributes.includes("type='application/ld+json'")
		) {
			return content.trim();
		}

		return await minifyInlineScript(content);
	}

	return minifyInlineCss(content);
}

async function minifyInlineScript(content: string): Promise<string> {
	const result = await minifyWithRolldown(INLINE_SCRIPT_FILE_NAME, content, {
		module: false,
	});

	if (result.errors.length > 0) {
		const [firstError] = result.errors;
		throw new Error(firstError?.message ?? 'Rolldown failed to minify inline script');
	}

	return result.code.trim();
}

function minifyInlineCss(content: string): string {
	const cssSegments = splitCssSegments(content);
	let minifiedCss = '';

	for (const cssSegment of cssSegments) {
		minifiedCss += cssSegment.isString ? cssSegment.value : minifyCssSegment(cssSegment.value);
	}

	return minifiedCss.trim();
}

function splitCssSegments(content: string): CssSegment[] {
	const segments: CssSegment[] = [];
	let index = 0;
	let segmentStart = 0;

	while (index < content.length) {
		const character = content[index] ?? '';
		const nextCharacter = content[index + 1] ?? '';

		if (isCssCommentStart(character, nextCharacter)) {
			pushCssSegment(segments, false, content.slice(segmentStart, index));
			index = skipCssComment(content, index + 2);
			segmentStart = index;
			continue;
		}

		if (isCssStringDelimiter(character)) {
			pushCssSegment(segments, false, content.slice(segmentStart, index));
			const stringEnd = findCssStringEnd(content, index + 1, character);
			pushCssSegment(segments, true, content.slice(index, stringEnd));
			index = stringEnd;
			segmentStart = index;
			continue;
		}

		index += 1;
	}

	pushCssSegment(segments, false, content.slice(segmentStart));

	return segments;
}

function pushCssSegment(segments: CssSegment[], isString: boolean, value: string): void {
	if (value.length === 0) {
		return;
	}

	segments.push({ isString, value });
}

function isCssCommentStart(character: string, nextCharacter: string): boolean {
	return character === '/' && nextCharacter === '*';
}

function isCssStringDelimiter(character: string): character is '"' | "'" {
	return character === '"' || character === "'";
}

function skipCssComment(content: string, index: number): number {
	let nextIndex = index;

	while (nextIndex < content.length) {
		const character = content[nextIndex] ?? '';
		const nextCharacter = content[nextIndex + 1] ?? '';

		if (character === '*' && nextCharacter === '/') {
			return nextIndex + 2;
		}

		nextIndex += 1;
	}

	return nextIndex;
}

function findCssStringEnd(content: string, index: number, delimiter: '"' | "'"): number {
	let nextIndex = index;

	while (nextIndex < content.length) {
		const character = content[nextIndex] ?? '';
		if (character === '\\') {
			nextIndex += 2;
			continue;
		}

		if (character === delimiter) {
			return nextIndex + 1;
		}

		nextIndex += 1;
	}

	return nextIndex;
}

function minifyCssSegment(segment: string): string {
	return segment
		.replace(/\s+/g, ' ')
		.replace(/\s*([{}:;,>+~()])\s*/g, '$1')
		.replace(/;}/g, '}');
}

function shouldExcludeFromStaticExport(sourcePath: string): boolean {
	const entryName = path.basename(sourcePath);
	return (
		entryName === DS_STORE_FILE_NAME ||
		entryName === VITE_METADATA_DIRECTORY_NAME ||
		entryName === WRANGLER_CONFIG_FILE_NAME
	);
}
