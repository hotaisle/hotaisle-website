import fs from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import sharp from 'sharp';
import { getModernImageVariants } from '@/lib/image-optimization.ts';
import {
	isGeneratedMermaidDiagramFile,
	renderMermaidMarkdownToImageMarkdown,
	shouldSkipMermaidDiagramGeneration,
} from './render_mermaid_diagrams.ts';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_CONTENT_DIR = path.join(CONTENT_DIR, 'blog');
const BLOG_ASSET_SOURCE_DIR = path.join(BLOG_CONTENT_DIR, 'assets');
const BLOG_AUTHORS_PATH = path.join(BLOG_CONTENT_DIR, '0-authors.json');
const GENERATED_OUTPUT_PATH = path.join(process.cwd(), 'src', 'generated', 'blog-data.ts');
const BLOG_ASSET_PREFIX = '/assets/blog/';
const FILE_SUFFIX_REGEX = /\s[0-9a-f]{32}$/i;
const MD_EXTENSION_REGEX = /\.md$/i;
const DATE_REGEX = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
const FIRST_MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/;
const MARKDOWN_LINK_REGEX = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
const EXTERNAL_OR_SPECIAL_LINK_REGEX = /^(?:https?:|mailto:|tel:|#|\/)/i;
const LEADING_H1_REGEX = /^\s*#\s+(.+)\n+/;
const LEGACY_METADATA_LINE_REGEX = /^([A-Za-z][A-Za-z0-9 '&()._/+-]*):\s*(.*)$/;
const MARKDOWN_PARAGRAPH_SPLIT_REGEX = /\n\s*\n/;
const MARKDOWN_INLINE_LINK_REGEX = /\[(.*?)\]\((.*?)\)/g;
const RELATIVE_PATH_PREFIX_REGEX = /^\.\//;
const WINDOWS_PATH_SEPARATOR_REGEX = /\\/g;
const NEW_LINE_SPLIT_REGEX = /\r?\n/;
const IMAGE_EXTENSION_REGEX = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;
const BLOG_HEADER_FILE_NAMES = ['header.jpg', 'header.png'] as const;
const BLOG_IMAGE_TAG_REGEX = /<img\b([^>]*?)src="([^"]+)"([^>]*)>/g;
const CLASS_ATTRIBUTE_REGEX = /\sclass="([^"]*)"/;
const TITLE_ATTRIBUTE_REGEX = /\stitle="([^"]*)"/;
const LEGACY_MULTILINE_METADATA_KEYS = new Set(['description']);
const UNICODE_DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASHES_REGEX = /^-+|-+$/g;
const WHITESPACE_REGEX = /\s+/g;
const INLINE_IMAGE_CLASS = 'blog-inline-image';
const PORTRAIT_IMAGE_CLASS = 'blog-inline-image--portrait';
const SMALL_IMAGE_CLASS = 'blog-inline-image--small';
const SMALL_IMAGE_TITLE = 'small';
const PORTRAIT_IMAGE_RATIO_THRESHOLD = 1;
const AUTHOR_SECTION_REGEX = /\n---\s*\n## About the Author[\s\S]*$/i;
const MERMAID_DIAGRAM_TITLE = 'mermaid-diagram';
const MERMAID_PARAGRAPH_WRAPPER_REGEX = /<p>(<div class="mermaid-diagram">[\s\S]*?<\/div>)<\/p>/g;
const MERMAID_LIGHT_SVG_SUFFIX_REGEX = /-light\.svg$/;
const SVG_VIEWBOX_REGEX = /\bviewBox="[^"]*?\s([\d.]+)\s([\d.]+)"/i;
const SVG_MAX_WIDTH_STYLE_REGEX = /\bmax-width:\s*([\d.]+)px/i;

interface BlogAuthorLink {
	label: string;
	url: string;
	value: string;
}

interface BlogAuthorProfile {
	bio: string;
	links: BlogAuthorLink[];
	name: string;
	note?: string;
}

interface RawBlogPost {
	author?: string;
	authorProfile?: BlogAuthorProfile;
	contentMarkdown: string;
	coverImage?: string;
	date: string;
	description: string;
	haFooter: boolean;
	metaDescription?: string;
	metaKeywords?: string;
	metaTitle?: string;
	slug: string;
	sourceFileName: string;
	sourceModifiedAtMs: number;
	tags: string[];
	title: string;
}

interface ParsedBlogPost {
	author?: string;
	authorProfile?: BlogAuthorProfile;
	contentMarkdown: string;
	coverImage?: string;
	date: string;
	description: string;
	haFooter: boolean;
	metaDescription?: string;
	metaKeywords?: string;
	metaTitle?: string;
	published: boolean;
	slug: string;
	sourceFileName: string;
	tags: string[];
	title: string;
}

interface ParsedLegacyMarkdown {
	contentMarkdown: string;
	metadata: Record<string, string>;
	title: string;
}

interface GeneratedBlogPost {
	author?: string;
	authorProfile?: BlogAuthorProfile;
	contentHtml: string;
	coverImage?: string;
	date: string;
	description: string;
	haFooter: boolean;
	metaDescription?: string;
	metaKeywords?: string;
	metaTitle?: string;
	slug: string;
	tags: string[];
	title: string;
}

interface BlogImageMetadata {
	height: number;
	isPortrait: boolean;
	width: number;
}

interface MermaidDiagramMetadata {
	height: number;
	width: number;
}

const blogImageMetadataByUrl = new Map<string, BlogImageMetadata | null>();
const mermaidDiagramMetadataByUrl = new Map<string, MermaidDiagramMetadata | null>();

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function parseAuthorLink(value: unknown, authorName: string, linkIndex: number): BlogAuthorLink {
	if (!isRecord(value)) {
		throw new Error(`Author "${authorName}" link ${linkIndex} must be an object.`);
	}

	const { label, url } = value;
	const linkValue = value.value;
	if (typeof label !== 'string' || typeof url !== 'string' || typeof linkValue !== 'string') {
		throw new Error(
			`Author "${authorName}" link ${linkIndex} must include string label, url, and value fields.`
		);
	}

	return {
		label,
		url,
		value: linkValue,
	};
}

function parseAuthorProfile(authorName: string, value: unknown): BlogAuthorProfile {
	if (!isRecord(value)) {
		throw new Error(`Author "${authorName}" must be an object.`);
	}

	const { bio, name, note } = value;
	const links = value.links;
	if (typeof name !== 'string' || typeof bio !== 'string') {
		throw new Error(`Author "${authorName}" must include string name and bio fields.`);
	}
	if (!Array.isArray(links)) {
		throw new Error(`Author "${authorName}" must include a links array.`);
	}
	if (note !== undefined && typeof note !== 'string') {
		throw new Error(`Author "${authorName}" note must be a string when provided.`);
	}

	return {
		name,
		bio,
		note,
		links: links.map((link, index) => parseAuthorLink(link, authorName, index)),
	};
}

function loadBlogAuthorProfiles(): Record<string, BlogAuthorProfile> {
	if (!fs.existsSync(BLOG_AUTHORS_PATH)) {
		return {};
	}

	const fileContents = fs.readFileSync(BLOG_AUTHORS_PATH, 'utf8');
	const parsed = JSON.parse(fileContents) as unknown;
	if (!isRecord(parsed)) {
		throw new Error('content/blog/0-authors.json must contain a top-level object.');
	}

	const authorProfiles: Record<string, BlogAuthorProfile> = {};
	for (const [authorName, authorValue] of Object.entries(parsed)) {
		authorProfiles[authorName] = parseAuthorProfile(authorName, authorValue);
	}

	return authorProfiles;
}

function normalizeMetadataKey(key: string): string {
	return key.trim().toLowerCase();
}

function normalizeFileStem(fileName: string): string {
	const withoutExtension = fileName.replace(MD_EXTENSION_REGEX, '');
	return withoutExtension.replace(FILE_SUFFIX_REGEX, '').trim();
}

function slugify(input: string): string {
	const cleaned = input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');

	return cleaned || 'untitled';
}

function parseBooleanFlag(value: string | undefined, fallback: boolean): boolean {
	if (!value) {
		return fallback;
	}

	const normalized = value.trim().toLowerCase();
	if (normalized === 'yes' || normalized === 'true') {
		return true;
	}
	if (normalized === 'no' || normalized === 'false') {
		return false;
	}
	return fallback;
}

function parseDateToIso(value: string | undefined): string {
	if (!value) {
		return new Date(0).toISOString();
	}

	const match = value.trim().match(DATE_REGEX);
	if (!match) {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) {
			return parsed.toISOString();
		}
		return new Date(0).toISOString();
	}

	const [, monthRaw, dayRaw, yearRaw] = match;
	const month = Number.parseInt(monthRaw, 10);
	const day = Number.parseInt(dayRaw, 10);
	const year = Number.parseInt(yearRaw, 10);
	const parsed = new Date(Date.UTC(year, month - 1, day));
	if (Number.isNaN(parsed.getTime())) {
		return new Date(0).toISOString();
	}
	return parsed.toISOString();
}

function parseTags(value: string | undefined): string[] {
	if (!value) {
		return [];
	}

	return value
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean);
}

function extractDescription(contentMarkdown: string): string {
	const noHeadings = contentMarkdown.replace(/^#+\s+/gm, '').trim();
	const firstParagraph = noHeadings.split(MARKDOWN_PARAGRAPH_SPLIT_REGEX)[0] ?? '';
	const plain = firstParagraph.replace(MARKDOWN_INLINE_LINK_REGEX, '$1').trim();
	if (plain.length <= 220) {
		return plain;
	}
	return `${plain.slice(0, 217).trimEnd()}...`;
}

function stripLeadingMatchingHeading(contentMarkdown: string, title: string): string {
	const match = contentMarkdown.match(LEADING_H1_REGEX);
	if (!match) {
		return contentMarkdown;
	}

	const headingText = match[1].replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
	const normalizedTitle = title.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

	if (headingText !== normalizedTitle) {
		return contentMarkdown;
	}

	return contentMarkdown.replace(LEADING_H1_REGEX, '');
}

function stripAuthorSection(contentMarkdown: string): string {
	return contentMarkdown.replace(AUTHOR_SECTION_REGEX, '').trimEnd();
}

function decodeMarkdownPath(rawPath: string): string {
	const trimmed = rawPath.trim().replace(/^<|>$/g, '');
	try {
		return decodeURIComponent(trimmed);
	} catch {
		return trimmed;
	}
}

function toSlugSegment(segment: string): string {
	const parsed = path.parse(segment);
	const baseName = parsed.name || parsed.base;
	const normalizedBaseName = baseName
		.normalize('NFKD')
		.replace(UNICODE_DIACRITICS_REGEX, '')
		.toLowerCase()
		.replace(NON_ALPHANUMERIC_REGEX, '-')
		.replace(EDGE_DASHES_REGEX, '');

	const normalizedExtension = parsed.ext.toLowerCase();
	const safeBaseName = normalizedBaseName || 'file';

	if (!normalizedExtension) {
		return safeBaseName;
	}

	return `${safeBaseName}${normalizedExtension}`;
}

function isLikelyImageReference(source: string): boolean {
	const decoded = decodeMarkdownPath(source);
	if (!EXTERNAL_OR_SPECIAL_LINK_REGEX.test(decoded)) {
		return true;
	}
	return IMAGE_EXTENSION_REGEX.test(decoded);
}

function toAssetUrl(assetPath: string): string {
	const normalized = assetPath
		.replace(RELATIVE_PATH_PREFIX_REGEX, '')
		.replace(WINDOWS_PATH_SEPARATOR_REGEX, '/');
	const encoded = normalized
		.split('/')
		.filter(Boolean)
		.map((segment) => toSlugSegment(segment))
		.join('/');
	return `${BLOG_ASSET_PREFIX}${encoded}`;
}

function resolveBlogHeaderImage(slug: string): string | undefined {
	const headerDirectory = path.join(BLOG_ASSET_SOURCE_DIR, slug);

	if (!fs.existsSync(headerDirectory)) {
		return undefined;
	}

	for (const fileName of BLOG_HEADER_FILE_NAMES) {
		const headerPath = path.join(headerDirectory, fileName);
		if (fs.existsSync(headerPath)) {
			return `${BLOG_ASSET_PREFIX}${slug}/${fileName}`;
		}
	}

	return undefined;
}

function parseLegacyMetadataLine(line: string): { key: string; value: string } | null {
	const metadataLineMatch = line.match(LEGACY_METADATA_LINE_REGEX);
	if (!metadataLineMatch) {
		return null;
	}

	return {
		key: normalizeMetadataKey(metadataLineMatch[1]),
		value: metadataLineMatch[2]?.trim() ?? '',
	};
}

function appendMultilineMetadataValue(
	metadata: Record<string, string>,
	key: string,
	line: string
): void {
	const previousValue = metadata[key] ?? '';
	metadata[key] = previousValue ? `${previousValue}\n${line}` : line;
}

function canContinueMultilineMetadata(key: string | null, trimmedLine: string): boolean {
	if (!key) {
		return false;
	}
	if (!LEGACY_MULTILINE_METADATA_KEYS.has(key)) {
		return false;
	}
	return !trimmedLine.startsWith('#');
}

// Many existing blog posts still use this pre-frontmatter metadata header format.
function parseLegacyMarkdown(fileContents: string): ParsedLegacyMarkdown {
	const lines = fileContents.split(NEW_LINE_SPLIT_REGEX);
	let lineIndex = 0;
	let title = '';

	if (lines[0]?.startsWith('# ')) {
		title = lines[0].slice(2).trim();
		lineIndex = 1;
	}

	while (lineIndex < lines.length && lines[lineIndex]?.trim() === '') {
		lineIndex += 1;
	}

	const metadata: Record<string, string> = {};
	let currentMetadataKey: string | null = null;
	while (lineIndex < lines.length) {
		const line = lines[lineIndex] ?? '';
		const trimmedLine = line.trim();
		const parsedMetadataLine = parseLegacyMetadataLine(line);
		if (parsedMetadataLine) {
			metadata[parsedMetadataLine.key] = parsedMetadataLine.value;
			currentMetadataKey = parsedMetadataLine.key;
			lineIndex += 1;
			continue;
		}

		if (!currentMetadataKey) {
			if (trimmedLine === '') {
				lineIndex += 1;
				continue;
			}
			break;
		}

		if (canContinueMultilineMetadata(currentMetadataKey, trimmedLine)) {
			appendMultilineMetadataValue(metadata, currentMetadataKey, line);
			lineIndex += 1;
			continue;
		}

		if (trimmedLine === '') {
			lineIndex += 1;
			continue;
		}

		lineIndex += 1;
		break;
	}

	const contentMarkdown = lines.slice(lineIndex).join('\n').trim();

	return {
		title,
		metadata,
		contentMarkdown,
	};
}

function parseBlogFile(
	authorProfiles: Record<string, BlogAuthorProfile>,
	fileName: string,
	fileContents: string
): ParsedBlogPost {
	const parsedMatter = matter(fileContents);
	const frontmatter = parsedMatter.data as Record<string, unknown>;
	const hasFrontmatter = Object.keys(frontmatter).length > 0;
	const parsed = hasFrontmatter
		? {
				title: String(frontmatter.title ?? ''),
				metadata: Object.fromEntries(
					Object.entries(frontmatter).map(([key, value]) => [
						normalizeMetadataKey(key),
						String(value ?? ''),
					])
				),
				contentMarkdown: parsedMatter.content.trim(),
			}
		: parseLegacyMarkdown(fileContents);

	const sourceStem = normalizeFileStem(fileName);
	const metadataSlug = parsed.metadata.slug?.trim();
	const slug = slugify(metadataSlug || sourceStem);
	const title = parsed.title || parsed.metadata.title || sourceStem;
	const published = parseBooleanFlag(parsed.metadata.publish, true);
	const haFooter = parseBooleanFlag(parsed.metadata['ha footer'], false);
	const description =
		parsed.metadata.description?.trim() || extractDescription(parsed.contentMarkdown);
	const tags = parseTags(parsed.metadata.tags);
	const author = parsed.metadata.author?.trim() || undefined;
	const date = parseDateToIso(parsed.metadata.date);
	const withoutDuplicateHeading = stripLeadingMatchingHeading(
		parsed.contentMarkdown,
		title
	).trim();
	const authorProfile = author ? authorProfiles[author] : undefined;
	const normalizedContent = authorProfile
		? stripAuthorSection(withoutDuplicateHeading || parsed.contentMarkdown)
		: withoutDuplicateHeading || parsed.contentMarkdown;

	const imageMatches = normalizedContent.matchAll(MARKDOWN_IMAGE_REGEX);
	let coverImagePath: string | undefined;
	for (const imageMatch of imageMatches) {
		const source = imageMatch[2];
		if (!(source && isLikelyImageReference(source))) {
			continue;
		}
		coverImagePath = decodeMarkdownPath(source);
		break;
	}
	if (!coverImagePath) {
		const coverMatch = normalizedContent.match(FIRST_MARKDOWN_IMAGE_REGEX);
		coverImagePath = coverMatch?.[2] ? decodeMarkdownPath(coverMatch[2]) : undefined;
	}
	const coverImage =
		coverImagePath && !EXTERNAL_OR_SPECIAL_LINK_REGEX.test(coverImagePath)
			? toAssetUrl(coverImagePath)
			: coverImagePath;
	const headerImage = resolveBlogHeaderImage(slug);

	return {
		slug,
		title,
		description,
		haFooter,
		author,
		authorProfile,
		date,
		tags,
		published,
		metaTitle: parsed.metadata['meta title'],
		metaDescription: parsed.metadata['meta description'],
		metaKeywords: parsed.metadata['meta keywords'],
		contentMarkdown: normalizedContent,
		coverImage: headerImage ?? coverImage,
		sourceFileName: fileName,
	};
}

function resolveInternalMarkdownLink(rawPath: string, fileStemToSlug: Map<string, string>): string {
	const decoded = decodeMarkdownPath(rawPath);
	if (EXTERNAL_OR_SPECIAL_LINK_REGEX.test(decoded)) {
		return rawPath;
	}

	if (decoded.toLowerCase().endsWith('.md')) {
		const fileName = path.basename(decoded);
		const stem = normalizeFileStem(fileName).toLowerCase();
		const slug = fileStemToSlug.get(stem);
		if (slug) {
			return `/blog/${slug}`;
		}

		return `/blog/${slugify(stem)}`;
	}

	return toAssetUrl(decoded);
}

function rewriteMarkdownLinks(markdown: string, fileStemToSlug: Map<string, string>): string {
	const withImages = markdown.replaceAll(MARKDOWN_IMAGE_REGEX, (_match, alt, rawPath, title) => {
		const resolvedPath = resolveInternalMarkdownLink(rawPath, fileStemToSlug);
		const titleSuffix = title ? ` "${title}"` : '';
		return `![${alt}](${resolvedPath}${titleSuffix})`;
	});

	return withImages.replaceAll(MARKDOWN_LINK_REGEX, (_match, label, rawPath) => {
		const decoded = decodeMarkdownPath(rawPath);
		if (EXTERNAL_OR_SPECIAL_LINK_REGEX.test(decoded)) {
			return `[${label}](${rawPath})`;
		}

		const resolvedPath = resolveInternalMarkdownLink(rawPath, fileStemToSlug);
		return `[${label}](${resolvedPath})`;
	});
}

async function renderMarkdown(markdown: string): Promise<string> {
	const processedContent = await remark()
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, {
			behavior: 'wrap',
			properties: {
				className: ['heading-link'],
			},
		})
		.use(rehypeHighlight)
		.use(rehypeStringify)
		.process(markdown);
	return processedContent.toString();
}

function toBlogAssetPath(assetUrl: string): string | undefined {
	if (!assetUrl.startsWith(BLOG_ASSET_PREFIX)) {
		return undefined;
	}

	const relativeAssetPath = assetUrl.slice(BLOG_ASSET_PREFIX.length);
	const directPath = path.join(BLOG_ASSET_SOURCE_DIR, relativeAssetPath);
	if (fs.existsSync(directPath)) {
		return directPath;
	}

	return resolveSluggedAssetPath(relativeAssetPath);
}

function resolveSluggedAssetPath(relativeAssetPath: string): string | undefined {
	const pathSegments = relativeAssetPath
		.split('/')
		.map((segment) => segment.trim())
		.filter(Boolean);
	let currentDirectory = BLOG_ASSET_SOURCE_DIR;

	for (const pathSegment of pathSegments) {
		const candidatePath = path.join(currentDirectory, pathSegment);
		if (fs.existsSync(candidatePath)) {
			currentDirectory = candidatePath;
			continue;
		}

		const directoryEntries = fs.readdirSync(currentDirectory, { withFileTypes: true });
		const matchingEntry = directoryEntries.find(
			(directoryEntry) => toSlugSegment(directoryEntry.name) === pathSegment
		);
		if (!matchingEntry) {
			return undefined;
		}

		currentDirectory = path.join(currentDirectory, matchingEntry.name);
	}

	return currentDirectory;
}

async function getBlogImageMetadata(assetUrl: string): Promise<BlogImageMetadata | null> {
	const cachedMetadata = blogImageMetadataByUrl.get(assetUrl);
	if (cachedMetadata !== undefined) {
		return cachedMetadata;
	}

	const blogAssetPath = toBlogAssetPath(assetUrl);
	if (!(blogAssetPath && fs.existsSync(blogAssetPath))) {
		blogImageMetadataByUrl.set(assetUrl, null);
		return null;
	}

	const metadata = await sharp(blogAssetPath).metadata();
	const { width, height } = metadata;
	if (!(width && height)) {
		blogImageMetadataByUrl.set(assetUrl, null);
		return null;
	}

	const imageMetadata = {
		width,
		height,
		isPortrait: height / width > PORTRAIT_IMAGE_RATIO_THRESHOLD,
	};
	blogImageMetadataByUrl.set(assetUrl, imageMetadata);
	return imageMetadata;
}

function parseMermaidDiagramMetadata(svgContent: string): MermaidDiagramMetadata | null {
	const viewBoxMatch = svgContent.match(SVG_VIEWBOX_REGEX);
	const viewBoxWidth = Number.parseFloat(viewBoxMatch?.[1] ?? '');
	const viewBoxHeight = Number.parseFloat(viewBoxMatch?.[2] ?? '');

	if (!(viewBoxWidth > 0 && viewBoxHeight > 0)) {
		return null;
	}

	const maxWidthMatch = svgContent.match(SVG_MAX_WIDTH_STYLE_REGEX);
	const maxWidth = Number.parseFloat(maxWidthMatch?.[1] ?? '');

	return {
		width: maxWidth > 0 ? maxWidth : viewBoxWidth,
		height: viewBoxHeight,
	};
}

function getMermaidDiagramMetadata(assetUrl: string): MermaidDiagramMetadata | null {
	const cachedMetadata = mermaidDiagramMetadataByUrl.get(assetUrl);
	if (cachedMetadata !== undefined) {
		return cachedMetadata;
	}

	const blogAssetPath = toBlogAssetPath(assetUrl);
	if (!(blogAssetPath && fs.existsSync(blogAssetPath))) {
		mermaidDiagramMetadataByUrl.set(assetUrl, null);
		return null;
	}

	const svgContent = fs.readFileSync(blogAssetPath, 'utf8');
	const metadata = parseMermaidDiagramMetadata(svgContent);
	mermaidDiagramMetadataByUrl.set(assetUrl, metadata);
	return metadata;
}

function appendClassAttribute(attributes: string, nextClassName: string): string {
	const classMatch = attributes.match(CLASS_ATTRIBUTE_REGEX);
	if (!classMatch) {
		return `${attributes} class="${nextClassName}"`;
	}

	const existingClasses = classMatch[1]?.trim();
	const mergedClasses = existingClasses ? `${existingClasses} ${nextClassName}` : nextClassName;

	return attributes.replace(CLASS_ATTRIBUTE_REGEX, ` class="${mergedClasses}"`);
}

function extractImageHints(attributes: string): {
	cleanedAttributes: string;
	hints: string[];
} {
	const titleMatch = attributes.match(TITLE_ATTRIBUTE_REGEX);
	if (!titleMatch) {
		return { cleanedAttributes: attributes, hints: [] };
	}

	const title = titleMatch[1]?.trim().toLowerCase() ?? '';
	const cleanedAttributes = attributes.replace(TITLE_ATTRIBUTE_REGEX, '');
	return {
		cleanedAttributes,
		hints: title.split(WHITESPACE_REGEX).filter(Boolean),
	};
}

function toDarkMermaidDiagramSource(sourcePath: string): string {
	if (!MERMAID_LIGHT_SVG_SUFFIX_REGEX.test(sourcePath)) {
		return sourcePath;
	}

	return sourcePath.replace(MERMAID_LIGHT_SVG_SUFFIX_REGEX, '-dark.svg');
}

async function enhanceRenderedHtml(html: string): Promise<string> {
	const matches = Array.from(html.matchAll(BLOG_IMAGE_TAG_REGEX));
	if (matches.length === 0) {
		return html;
	}

	let enhancedHtml = html;
	for (const match of matches) {
		const fullTag = match[0];
		const beforeSrcAttributes = match[1] ?? '';
		const src = match[2];
		const afterSrcAttributes = match[3] ?? '';
		const imageAttributes = `${beforeSrcAttributes}${afterSrcAttributes}`;
		const isMermaidDiagram =
			imageAttributes.includes(`title="${MERMAID_DIAGRAM_TITLE}"`) ||
			imageAttributes.includes(`title='${MERMAID_DIAGRAM_TITLE}'`);

		if (isMermaidDiagram) {
			const cleanedAttributes = imageAttributes.replace(TITLE_ATTRIBUTE_REGEX, '');
			const darkSource = toDarkMermaidDiagramSource(src);
			const diagramMetadata = getMermaidDiagramMetadata(src);
			const sizeAttributes = diagramMetadata
				? ` width="${diagramMetadata.width}" height="${diagramMetadata.height}" style="width: ${diagramMetadata.width}px; max-width: 100%; height: auto;"`
				: '';
			const imageTag = `<picture><source srcset="${darkSource}" media="(prefers-color-scheme: dark)"><img${appendClassAttribute(cleanedAttributes, 'mermaid-diagram__image')} src="${src}"${sizeAttributes}></picture>`;
			enhancedHtml = enhancedHtml.replace(
				fullTag,
				`<div class="mermaid-diagram">${imageTag}</div>`
			);
			continue;
		}

		const imageMetadata = await getBlogImageMetadata(src);
		if (!imageMetadata) {
			continue;
		}

		const { cleanedAttributes, hints } = extractImageHints(imageAttributes);
		const classNames = [INLINE_IMAGE_CLASS];
		if (imageMetadata.isPortrait) {
			classNames.push(PORTRAIT_IMAGE_CLASS);
		}
		if (hints.includes(SMALL_IMAGE_TITLE)) {
			classNames.push(SMALL_IMAGE_CLASS);
		}
		let mergedAttributes = appendClassAttribute(cleanedAttributes, classNames.join(' '));
		mergedAttributes = `${mergedAttributes} role="button" tabindex="0" aria-haspopup="dialog"`;
		const imgTag = `<img${mergedAttributes} src="${src}" width="${imageMetadata.width}" height="${imageMetadata.height}">`;
		const modernVariants = getModernImageVariants(src);
		const replacementTag =
			modernVariants.length === 0
				? imgTag
				: `<picture>${modernVariants.map((variant) => `<source srcset="${variant.src}" type="${variant.type}">`).join('')}${imgTag}</picture>`;
		enhancedHtml = enhancedHtml.replace(fullTag, replacementTag);
	}

	return enhancedHtml.replace(MERMAID_PARAGRAPH_WRAPPER_REGEX, '$1');
}

async function syncGeneratedMermaidAssets(slug: string, generatedFiles: string[]): Promise<void> {
	const assetDirectory = path.join(BLOG_ASSET_SOURCE_DIR, slug);
	await fs.promises.mkdir(assetDirectory, { recursive: true });

	const expectedFileNames = new Set(generatedFiles);

	const existingFiles = await readdir(assetDirectory, { withFileTypes: true });
	for (const existingFile of existingFiles) {
		if (!(existingFile.isFile() && isGeneratedMermaidDiagramFile(existingFile.name))) {
			continue;
		}

		if (expectedFileNames.has(existingFile.name)) {
			continue;
		}

		await rm(path.join(assetDirectory, existingFile.name), { force: true });
	}
}

async function generateBlogData(): Promise<void> {
	const posts: RawBlogPost[] = [];
	const fileStemToSlug = new Map<string, string>();
	const authorProfiles = loadBlogAuthorProfiles();

	if (fs.existsSync(BLOG_CONTENT_DIR)) {
		const files = fs
			.readdirSync(BLOG_CONTENT_DIR)
			.filter((fileName) => fileName.endsWith('.md'));
		for (const fileName of files) {
			const fullPath = path.join(BLOG_CONTENT_DIR, fileName);
			const fileContents = fs.readFileSync(fullPath, 'utf8');
			const parsed = parseBlogFile(authorProfiles, fileName, fileContents);
			if (!parsed.published) {
				continue;
			}
			const sourceModifiedAtMs = fs.statSync(fullPath).mtimeMs;
			posts.push({
				...parsed,
				sourceModifiedAtMs,
			});
			fileStemToSlug.set(normalizeFileStem(fileName).toLowerCase(), parsed.slug);
		}
	}

	const renderedPosts: GeneratedBlogPost[] = [];
	const shouldGenerateMermaidDiagrams = !shouldSkipMermaidDiagramGeneration();
	for (const post of posts) {
		const rewrittenMarkdown = rewriteMarkdownLinks(post.contentMarkdown, fileStemToSlug);
		const blogAssetDirectory = path.join(BLOG_ASSET_SOURCE_DIR, post.slug);
		const { markdown: markdownWithRenderedMermaid, generatedFiles: mermaidFiles } =
			await renderMermaidMarkdownToImageMarkdown(
				rewrittenMarkdown,
				post.slug,
				blogAssetDirectory,
				post.sourceModifiedAtMs
			);
		if (shouldGenerateMermaidDiagrams) {
			await syncGeneratedMermaidAssets(post.slug, mermaidFiles);
		}
		const renderedMarkdown = await renderMarkdown(markdownWithRenderedMermaid);
		const contentHtml = await enhanceRenderedHtml(renderedMarkdown);
		renderedPosts.push({
			slug: post.slug,
			title: post.title,
			description: post.description,
			haFooter: post.haFooter,
			contentHtml,
			date: post.date,
			tags: post.tags,
			author: post.author,
			authorProfile: post.authorProfile,
			coverImage: post.coverImage,
			metaTitle: post.metaTitle,
			metaDescription: post.metaDescription,
			metaKeywords: post.metaKeywords,
		});
	}

	renderedPosts.sort(
		(left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
	);

	const fileContents = `/* eslint-disable */
// This file is auto-generated by scripts/generate_blog_data.ts.
// Do not edit by hand.

export interface GeneratedBlogPost {
	author?: string;
	authorProfile?: BlogAuthorProfile;
	contentHtml: string;
	coverImage?: string;
	date: string;
	description: string;
	haFooter: boolean;
	metaDescription?: string;
	metaKeywords?: string;
	metaTitle?: string;
	slug: string;
	tags: string[];
	title: string;
}

export interface BlogAuthorLink {
	label: string;
	url: string;
	value: string;
}

export interface BlogAuthorProfile {
	bio: string;
	links: BlogAuthorLink[];
	name: string;
	note?: string;
}

export const BLOG_POSTS: GeneratedBlogPost[] = ${JSON.stringify(renderedPosts, null, 2)};
`;

	await fs.promises.mkdir(path.dirname(GENERATED_OUTPUT_PATH), { recursive: true });
	await fs.promises.writeFile(GENERATED_OUTPUT_PATH, fileContents, 'utf8');
}

try {
	await generateBlogData();
	console.log('Generated blog data.');
} catch (error) {
	console.error('Failed to generate blog data.');
	throw error;
}
