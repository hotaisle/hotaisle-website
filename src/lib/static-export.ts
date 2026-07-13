const ATTRIBUTE_VALUE_REGEX = /([^\s=]+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
const EXTERNAL_SCRIPT_REGEX = /<script\b([^>]*)>\s*<\/script>/g;
const LINK_TAG_REGEX = /<link\b[^>]*>/g;
const STATIC_EXPORT_ORIGIN = 'https://static.hotaisle.local';
const VINEXT_CLIENT_CHUNK_PATH_PREFIX = '/_next/static/chunks/';

export function getTagAttributes(tag: string): Record<string, string | undefined> {
	const attributes: Record<string, string | undefined> = {};

	for (const match of tag.matchAll(ATTRIBUTE_VALUE_REGEX)) {
		const [, rawName, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
		const normalizedName = rawName.toLowerCase();
		const value = doubleQuotedValue ?? singleQuotedValue ?? unquotedValue ?? '';
		attributes[normalizedName] = value;
	}

	return attributes;
}

function isVinextClientChunkAsset(assetPath: string | undefined): boolean {
	if (!assetPath) {
		return false;
	}

	try {
		return new URL(assetPath, STATIC_EXPORT_ORIGIN).pathname.startsWith(
			VINEXT_CLIENT_CHUNK_PATH_PREFIX
		);
	} catch {
		return false;
	}
}

function isVinextClientChunkModulePreload(tag: string): boolean {
	const { href, rel } = getTagAttributes(tag);
	return rel?.toLowerCase() === 'modulepreload' && isVinextClientChunkAsset(href);
}

export function hasVinextClientChunkReference(html: string): boolean {
	const hasChunkScript = [...html.matchAll(EXTERNAL_SCRIPT_REGEX)].some(([, attributes]) =>
		isVinextClientChunkAsset(getTagAttributes(`<script${attributes}>`).src)
	);
	return (
		hasChunkScript ||
		[...html.matchAll(LINK_TAG_REGEX)].some(([tag]) => isVinextClientChunkModulePreload(tag))
	);
}

export function stripVinextClientChunkReferences(html: string): string {
	const withoutChunkScripts = html.replace(EXTERNAL_SCRIPT_REGEX, (fullMatch, attributes) =>
		isVinextClientChunkAsset(getTagAttributes(`<script${attributes}>`).src) ? '' : fullMatch
	);

	return withoutChunkScripts.replace(LINK_TAG_REGEX, (fullMatch) =>
		isVinextClientChunkModulePreload(fullMatch) ? '' : fullMatch
	);
}
