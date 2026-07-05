import { spawn } from 'node:child_process';
import {
	cp,
	mkdir,
	readdir,
	readFile,
	rename,
	rm,
	stat,
	utimes,
	writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { minify as minifyHtml } from '@minify-html/node';
import { transform as transformCss } from 'lightningcss';
import { minifySync } from 'oxc-minify';
import { createSitemapXml } from './generate_sitemap.ts';

const EXPORT_ORIGIN = 'https://static.hotaisle.local';
const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const BLOG_ASSET_SOURCE_DIRECTORY = path.join(PROJECT_ROOT, 'content', 'blog', 'assets');
const PUBLIC_DIRECTORY = path.join(PROJECT_ROOT, 'public');
const DIST_DIRECTORY = path.join(PROJECT_ROOT, 'dist');
const STATIC_DIST_DIRECTORY = path.join(PROJECT_ROOT, 'dist-static');
const CLIENT_DIRECTORY = path.join(DIST_DIRECTORY, 'client');
const CLIENT_BLOG_ASSET_DIRECTORY = path.join(CLIENT_DIRECTORY, 'assets', 'blog');
const SITEMAP_FILE_NAME = 'sitemap.xml';
const VINEXT_PACKAGE_DIRECTORY = path.join(PROJECT_ROOT, 'node_modules', 'vinext');
const VINEXT_NAVIGATION_RUNTIME_SOURCE_PATH = path.join(
	VINEXT_PACKAGE_DIRECTORY,
	'dist',
	'client',
	'navigation-runtime.js'
);
const VINEXT_APP_SSR_ENTRY_SOURCE_PATH = path.join(
	VINEXT_PACKAGE_DIRECTORY,
	'dist',
	'server',
	'app-ssr-entry.js'
);
const VINEXT_APP_SSR_STREAM_SOURCE_PATH = path.join(
	VINEXT_PACKAGE_DIRECTORY,
	'dist',
	'server',
	'app-ssr-stream.js'
);
const GENERATED_DEPLOY_WRANGLER_CONFIG_PATH = path.join(DIST_DIRECTORY, 'server', 'wrangler.json');
const STATIC_DEPLOY_WRANGLER_CONFIG_PATH = path.join(
	DIST_DIRECTORY,
	'server',
	'wrangler.static.json'
);
const VITE_METADATA_DIRECTORY_NAME = '.vite';
const WRANGLER_CONFIG_FILE_NAME = 'wrangler.json';
const DEV_FILE_PREFIX = '.dev';
const HTML_EXTENSION = '.html';
const ROOT_HTML_FILE_NAMES = new Set(['404.html', 'index.html']);
const INLINE_SCRIPT_REGEX = /<script([^>]*)>([\s\S]*?)<\/script>/g;
const INLINE_STYLE_REGEX = /<style([^>]*)>([\s\S]*?)<\/style>/g;
const LINK_TAG_REGEX = /<link\b[^>]*>/g;
const META_TAG_REGEX = /<meta\b[^>]*>/g;
const STYLESHEET_PRELOAD_REGEX =
	/<link\b[^>]*\brel=(?:"preload"|'preload'|preload)\b[^>]*\bas=(?:"style"|'style'|style)\b[^>]*\/?>/g;
const MODULE_PRELOAD_REGEX =
	/<link\b[^>]*\brel=(?:"modulepreload"|'modulepreload'|modulepreload)\b[^>]*\/?>/g;
const TRAILING_RSC_SCRIPTS_REGEX =
	/(<\/html>)(?:<script\b[^>]*>self\.__VINEXT_RSC_[\s\S]*?<\/script>)+\s*$/g;
const ATTRIBUTE_VALUE_REGEX = /([^\s=]+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
const CSS_COMMENT_REGEX = /\/\*[\s\S]*?\*\//g;
const UNICODE_DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASHES_REGEX = /^-+|-+$/g;
const VINEXT_BOOTSTRAP_SCRIPT_ID = '_R_';
const VINEXT_NAVIGATION_RUNTIME_MARKER = 'vinext.navigationRuntime';
const VINEXT_RSC_BOOTSTRAP_MARKER = 'bootstrap.rsc';
const VINEXT_ROUTE_MANIFEST_MARKER = 'routeManifest';
const VINEXT_BOOTSTRAP_SCRIPT_MARKERS = [
	'__VINEXT_',
	'Symbol.for(`vinext',
	'Symbol.for("vinext',
	"Symbol.for('vinext",
	'vinext.',
	'vinext:',
	'vinext/',
	VINEXT_RSC_BOOTSTRAP_MARKER,
	VINEXT_ROUTE_MANIFEST_MARKER,
	'navigationRuntime',
] as const;
const FORBIDDEN_EXPORTED_HTML_MARKERS = [
	'__VINEXT_',
	'Symbol.for(`vinext',
	'Symbol.for("vinext',
	"Symbol.for('vinext",
	VINEXT_NAVIGATION_RUNTIME_MARKER,
	VINEXT_RSC_BOOTSTRAP_MARKER,
] as const;
const IMAGE_MIME_TYPES_BY_EXTENSION = {
	'.avif': 'image/avif',
	'.gif': 'image/gif',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
} as const;

process.env.NODE_ENV = 'production';

await assertVinextBootstrapContracts();

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

await writeStaticDeployWranglerConfig();
await writeSitemapFiles();

await nestExportedHtmlFiles(STATIC_DIST_DIRECTORY);
const normalizedHtmlFileCount = await normalizeExportedHtmlFiles(STATIC_DIST_DIRECTORY);
if (normalizedHtmlFileCount === 0) {
	throw new Error('vinext static export did not produce any HTML files');
}
await assertNoClientBootstrapMarkers(STATIC_DIST_DIRECTORY);

async function normalizeExportedHtml(html: string): Promise<string> {
	const stripped = stripClientBootstrap(html);
	const withOpenGraphImageType = insertOpenGraphImageTypeMeta(stripped);
	const withStyles = await inlineStylesheetLinks(withOpenGraphImageType);
	const withMinifiedJs = minifyInlineScripts(withStyles);
	const withMinifiedCss = minifyInlineStyles(withMinifiedJs);
	return minifyHtml(Buffer.from(withMinifiedCss), {
		minify_js: false,
		minify_css: false,
	}).toString('utf8');
}

async function normalizeExportedHtmlFiles(directory: string): Promise<number> {
	const allEntries = await readdir(directory, { recursive: true });
	let normalizedCount = 0;

	for (const relativePath of allEntries) {
		if (!relativePath.endsWith('.html')) {
			continue;
		}

		const fullPath = path.join(directory, relativePath);
		const html = await readFile(fullPath, 'utf8');
		const normalizedHtml = await normalizeExportedHtml(html);

		await writeFile(fullPath, normalizedHtml, 'utf8');
		normalizedCount += 1;
	}

	return normalizedCount;
}

async function nestExportedHtmlFiles(directory: string): Promise<void> {
	const allEntries = await readdir(directory, { recursive: true });

	for (const relativePath of allEntries) {
		if (
			!relativePath.endsWith(HTML_EXTENSION) ||
			ROOT_HTML_FILE_NAMES.has(path.basename(relativePath))
		) {
			continue;
		}

		const sourcePath = path.join(directory, relativePath);
		const nestedRelativePath = path.join(
			relativePath.slice(0, -HTML_EXTENSION.length),
			'index.html'
		);
		const nestedPath = path.join(directory, nestedRelativePath);

		await mkdir(path.dirname(nestedPath), { recursive: true });
		await rename(sourcePath, nestedPath);
	}
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

async function writeStaticDeployWranglerConfig(): Promise<void> {
	const generatedWranglerConfig = JSON.parse(
		await readFile(GENERATED_DEPLOY_WRANGLER_CONFIG_PATH, 'utf8')
	) as {
		assets?: { directory?: string };
	};

	generatedWranglerConfig.assets = {
		...generatedWranglerConfig.assets,
		directory: '../../dist-static',
	};

	await writeFile(
		STATIC_DEPLOY_WRANGLER_CONFIG_PATH,
		`${JSON.stringify(generatedWranglerConfig, null, 2)}\n`,
		'utf8'
	);
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
	const allEntries = await readdir(sourceDirectory, { recursive: true });

	await Promise.all(
		allEntries.map(async (relativePath) => {
			const sourcePath = path.join(sourceDirectory, relativePath);
			const sourceStats = await stat(sourcePath).catch(() => null);
			if (!sourceStats?.isFile()) {
				return;
			}

			const sluggedRelativePath = relativePath
				.split(path.sep)
				.map(toSlugSegment)
				.join(path.sep);
			const destPath = path.join(destinationDirectory, sluggedRelativePath);

			const destStats = await stat(destPath).catch(() => null);
			if (
				destStats &&
				destStats.size === sourceStats.size &&
				destStats.mtimeMs >= sourceStats.mtimeMs
			) {
				return;
			}

			await mkdir(path.dirname(destPath), { recursive: true });
			await cp(sourcePath, destPath, { force: true });
			await utimes(destPath, sourceStats.atime, sourceStats.mtime);
		})
	);
}

function minifyInlineScripts(html: string): string {
	const matches = [...html.matchAll(INLINE_SCRIPT_REGEX)];
	if (matches.length === 0) {
		return html;
	}

	let result = '';
	let lastIndex = 0;

	for (const match of matches) {
		const [fullMatch, attributes, content] = match;
		const matchIndex = match.index ?? 0;
		result += html.slice(lastIndex, matchIndex);

		const normalizedAttributes = attributes.toLowerCase();
		const shouldMinify =
			content.trim().length > 0 &&
			!normalizedAttributes.includes(' src=') &&
			!normalizedAttributes.includes('application/ld+json');

		if (shouldMinify) {
			const { code, errors } = minifySync('script.js', content, { module: false });
			if (errors.length > 0) {
				throw new Error(errors[0]?.message ?? 'oxc-minify failed on inline script');
			}
			result += `<script${attributes}>${code.trim()}</script>`;
		} else {
			result += fullMatch;
		}

		lastIndex = matchIndex + fullMatch.length;
	}

	return result + html.slice(lastIndex);
}

function minifyInlineStyles(html: string): string {
	const matches = [...html.matchAll(INLINE_STYLE_REGEX)];
	if (matches.length === 0) {
		return html;
	}

	let result = '';
	let lastIndex = 0;

	for (const match of matches) {
		const [fullMatch, attributes, content] = match;
		const matchIndex = match.index ?? 0;
		result += html.slice(lastIndex, matchIndex);

		if (content.trim().length > 0) {
			const { code } = transformCss({
				code: Buffer.from(content),
				filename: 'style.css',
				minify: true,
			});
			const minifiedCss = Buffer.from(code).toString('utf8').replace(CSS_COMMENT_REGEX, '');
			result += `<style${attributes}>${minifiedCss}</style>`;
		} else {
			result += fullMatch;
		}

		lastIndex = matchIndex + fullMatch.length;
	}

	return result + html.slice(lastIndex);
}

function stripClientBootstrap(html: string): string {
	const withoutPreloads = html
		.replace(STYLESHEET_PRELOAD_REGEX, '')
		.replace(MODULE_PRELOAD_REGEX, '')
		.replace(TRAILING_RSC_SCRIPTS_REGEX, '$1');

	return withoutPreloads.replace(INLINE_SCRIPT_REGEX, (fullMatch, attributes, content) =>
		isVinextBootstrapScript(attributes, content) ? '' : fullMatch
	);
}

function isVinextBootstrapScript(attributes: string, content: string): boolean {
	const scriptAttributes = getTagAttributes(`<script${attributes}>`);

	if (scriptAttributes.id === VINEXT_BOOTSTRAP_SCRIPT_ID) {
		return true;
	}

	const normalizedContent = content.trim();
	if (normalizedContent.length === 0) {
		return false;
	}

	return VINEXT_BOOTSTRAP_SCRIPT_MARKERS.some((marker) => normalizedContent.includes(marker));
}

function insertOpenGraphImageTypeMeta(html: string): string {
	if (html.includes('property="og:image:type"')) {
		return html;
	}

	const metaTags = [...html.matchAll(META_TAG_REGEX)];
	const imageMetaTag = metaTags.find((match) => {
		const [tag] = match;
		const attributes = getTagAttributes(tag);
		return attributes.property === 'og:image' && Boolean(attributes.content);
	});

	if (!imageMetaTag) {
		return html;
	}

	const [fullMatch] = imageMetaTag;
	const imageUrl = getTagAttributes(fullMatch).content;
	const mimeType = getImageMimeType(imageUrl);

	if (!mimeType) {
		return html;
	}

	return html.replace(
		fullMatch,
		`${fullMatch}<meta property="og:image:type" content="${mimeType}">`
	);
}

function getImageMimeType(imageUrl: string): string | null {
	const pathname = new URL(imageUrl, EXPORT_ORIGIN).pathname;
	const extension = path.extname(pathname).toLowerCase();

	return (
		IMAGE_MIME_TYPES_BY_EXTENSION[extension as keyof typeof IMAGE_MIME_TYPES_BY_EXTENSION] ??
		null
	);
}

async function inlineStylesheetLinks(html: string): Promise<string> {
	const linkMatches = [...html.matchAll(LINK_TAG_REGEX)];

	if (linkMatches.length === 0) {
		return html;
	}

	let transformedHtml = html;

	for (const linkMatch of linkMatches) {
		const [fullMatch] = linkMatch;
		const attributes = getTagAttributes(fullMatch);
		const href = attributes.href;
		const rel = attributes.rel?.toLowerCase();

		if (rel !== 'stylesheet' || !href) {
			continue;
		}

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

function getTagAttributes(tag: string): Record<string, string> {
	const attributes: Record<string, string> = {};

	for (const match of tag.matchAll(ATTRIBUTE_VALUE_REGEX)) {
		const [, rawName, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
		const normalizedName = rawName.toLowerCase();
		const value = doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? '';
		attributes[normalizedName] = value;
	}

	return attributes;
}

function toLocalAssetPath(href: string): string | null {
	const { pathname } = new URL(href, EXPORT_ORIGIN);

	if (!(pathname.startsWith('/assets/') || pathname.startsWith('/_next/static/'))) {
		return null;
	}

	return path.join(STATIC_DIST_DIRECTORY, pathname.slice(1));
}

async function assertVinextBootstrapContracts(): Promise<void> {
	const [navigationRuntimeSource, appSsrEntrySource, appSsrStreamSource] = await Promise.all([
		readFile(VINEXT_NAVIGATION_RUNTIME_SOURCE_PATH, 'utf8'),
		readFile(VINEXT_APP_SSR_ENTRY_SOURCE_PATH, 'utf8'),
		readFile(VINEXT_APP_SSR_STREAM_SOURCE_PATH, 'utf8'),
	]);

	const missingContracts = [
		{
			found: navigationRuntimeSource.includes(
				`NAVIGATION_RUNTIME_SYMBOL_DESCRIPTION = "${VINEXT_NAVIGATION_RUNTIME_MARKER}"`
			),
			name: `${path.relative(PROJECT_ROOT, VINEXT_NAVIGATION_RUNTIME_SOURCE_PATH)} exports ${VINEXT_NAVIGATION_RUNTIME_MARKER}`,
		},
		{
			found: appSsrEntrySource.includes(`id=\\"${VINEXT_BOOTSTRAP_SCRIPT_ID}\\"`),
			name: `${path.relative(PROJECT_ROOT, VINEXT_APP_SSR_ENTRY_SOURCE_PATH)} emits script id ${VINEXT_BOOTSTRAP_SCRIPT_ID}`,
		},
		{
			found:
				appSsrStreamSource.includes('NAVIGATION_RUNTIME_SYMBOL_DESCRIPTION') &&
				appSsrStreamSource.includes('Symbol.for') &&
				appSsrStreamSource.includes(VINEXT_RSC_BOOTSTRAP_MARKER),
			name: `${path.relative(PROJECT_ROOT, VINEXT_APP_SSR_STREAM_SOURCE_PATH)} emits ${VINEXT_RSC_BOOTSTRAP_MARKER} from NAVIGATION_RUNTIME_SYMBOL_DESCRIPTION`,
		},
	].filter(({ found }) => !found);

	if (missingContracts.length === 0) {
		return;
	}

	throw new Error(
		`vinext static-export bootstrap assumptions changed after upgrade:\n${missingContracts
			.map(({ name }) => `- Missing: ${name}`)
			.join('\n')}`
	);
}

async function assertNoClientBootstrapMarkers(directory: string): Promise<void> {
	const allEntries = await readdir(directory, { recursive: true });

	for (const relativePath of allEntries) {
		if (!relativePath.endsWith('.html')) {
			continue;
		}

		const fullPath = path.join(directory, relativePath);
		const html = await readFile(fullPath, 'utf8');
		const leakedMarker = FORBIDDEN_EXPORTED_HTML_MARKERS.find((marker) =>
			html.includes(marker)
		);
		if (!leakedMarker) {
			continue;
		}

		throw new Error(
			`Static export still contains client bootstrap marker ${JSON.stringify(
				leakedMarker
			)} in ${path.relative(PROJECT_ROOT, fullPath)}`
		);
	}
}

function shouldExcludeFromStaticExport(sourcePath: string): boolean {
	const entryName = path.basename(sourcePath);
	return (
		entryName.startsWith(DEV_FILE_PREFIX) ||
		entryName === '.DS_Store' ||
		entryName === VITE_METADATA_DIRECTORY_NAME ||
		entryName === WRANGLER_CONFIG_FILE_NAME
	);
}
