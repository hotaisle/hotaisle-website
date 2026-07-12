import { toCanonicalDocumentHref } from '@/lib/canonical-href.ts';

const SITE_NAME = 'Hot Aisle';
const SITE_URL = 'https://hotaisle.xyz';
const SITE_LOCALE = 'en_US';
const SITE_TWITTER_HANDLE = '@HotAisle';
const DEFAULT_IMAGE = '/assets/og/hot-aisle-inference-cloud.png';
const DEFAULT_IMAGE_ALT =
	'Hot Aisle automated inference cloud with pixel-art AMD GPU infrastructure';
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;
const DEFAULT_IMAGE_TYPE = 'image/png';
const SITE_METADATA_BASE = new URL(SITE_URL);
const DEFAULT_KEYWORDS = [
	'AMD GPU cloud',
	'AMD inference',
	'developer-first cloud',
	'GPU compute',
	'isolated GPU virtual machines',
	'sovereign inference',
] as const;
const IMAGE_TYPE_BY_EXTENSION = {
	avif: 'image/avif',
	gif: 'image/gif',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
} as const;

interface PageMetadataOptions {
	description: string;
	image?: string;
	imageAlt?: string;
	keywords?: readonly string[];
	path: string;
	title: string;
	type?: 'article' | 'website';
}

function getImageType(image: string): string | undefined {
	const fileName = image.split('?')[0] ?? '';
	const extension = fileName.split('.').pop()?.toLowerCase();

	if (!extension) {
		return;
	}

	return IMAGE_TYPE_BY_EXTENSION[extension as keyof typeof IMAGE_TYPE_BY_EXTENSION];
}

function getKeywords(title: string, keywords: readonly string[] | undefined): string[] {
	const uniqueKeywords = new Map<string, string>();

	for (const keyword of [...DEFAULT_KEYWORDS, title, ...(keywords ?? [])]) {
		const trimmedKeyword = keyword.trim();
		if (!trimmedKeyword) {
			continue;
		}

		uniqueKeywords.set(trimmedKeyword.toLowerCase(), trimmedKeyword);
	}

	return [...uniqueKeywords.values()];
}

export function createPageMetadata({
	description,
	image = DEFAULT_IMAGE,
	imageAlt = DEFAULT_IMAGE_ALT,
	keywords,
	path,
	title,
	type = 'website',
}: PageMetadataOptions) {
	const url = new URL(toCanonicalDocumentHref(path), SITE_URL).toString();
	const imageUrl = new URL(image, SITE_URL).toString();
	const imageType = getImageType(image);
	const imageDimensions: { height?: number; type?: string; width?: number } = {};

	if (image === DEFAULT_IMAGE) {
		imageDimensions.height = DEFAULT_IMAGE_HEIGHT;
		imageDimensions.type = DEFAULT_IMAGE_TYPE;
		imageDimensions.width = DEFAULT_IMAGE_WIDTH;
	} else if (imageType) {
		imageDimensions.type = imageType;
	}
	const imageMetadata = {
		alt: imageAlt,
		url: imageUrl,
		...imageDimensions,
	};

	return {
		alternates: {
			canonical: url,
		},
		applicationName: SITE_NAME,
		description,
		keywords: getKeywords(title, keywords),
		metadataBase: SITE_METADATA_BASE,
		openGraph: {
			description,
			images: [imageMetadata],
			locale: SITE_LOCALE,
			siteName: SITE_NAME,
			title,
			type,
			url,
		},
		robots: {
			follow: true,
			index: true,
		},
		title,
		twitter: {
			card: 'summary_large_image',
			creator: SITE_TWITTER_HANDLE,
			description,
			images: [imageMetadata],
			site: SITE_TWITTER_HANDLE,
			title,
		},
	};
}
