import { toCanonicalDocumentHref } from '@/lib/canonical-href.ts';
import { getSocialImage } from '@/lib/social-images.ts';

const SITE_NAME = 'Hot Aisle';
const SITE_URL = 'https://hotaisle.xyz';
const SITE_LOCALE = 'en_US';
const SITE_TWITTER_HANDLE = '@HotAisle';
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

export interface PageMetadataOptions {
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
	image,
	imageAlt,
	keywords,
	path,
	title,
	type = 'website',
}: PageMetadataOptions) {
	const url = new URL(toCanonicalDocumentHref(path), SITE_URL).toString();
	const socialImage = getSocialImage(new URL(url).pathname);
	const imageUrl = new URL(image ?? socialImage.url, SITE_URL).toString();
	const imageType = image ? getImageType(image) : socialImage.type;
	const imageDimensions: { height?: number; type?: string; width?: number } = {};

	if (!image) {
		imageDimensions.height = socialImage.height;
		imageDimensions.type = socialImage.type;
		imageDimensions.width = socialImage.width;
	} else if (imageType) {
		imageDimensions.type = imageType;
	}
	const imageMetadata = {
		alt: imageAlt ?? (image ? title : socialImage.alt),
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

export type PageMetadata = ReturnType<typeof createPageMetadata>;
