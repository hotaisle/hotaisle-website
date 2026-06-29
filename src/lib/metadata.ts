import { toCanonicalDocumentHref } from '@/lib/canonical-href.ts';

const SITE_NAME = 'Hot Aisle';
const SITE_URL = 'https://hotaisle.xyz';
const SITE_LOCALE = 'en_US';
const SITE_TWITTER_HANDLE = '@HotAisle';
const DEFAULT_IMAGE = '/assets/og/hot-aisle-share.png';
const DEFAULT_IMAGE_ALT = 'Hot Aisle branded share image';
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;
const DEFAULT_IMAGE_TYPE = 'image/png';
const SITE_METADATA_BASE = new URL(SITE_URL);

interface PageMetadataOptions {
	description: string;
	image?: string;
	imageAlt?: string;
	path: string;
	title: string;
	type?: 'article' | 'website';
}

export function createPageMetadata({
	description,
	image = DEFAULT_IMAGE,
	imageAlt = DEFAULT_IMAGE_ALT,
	path,
	title,
	type = 'website',
}: PageMetadataOptions) {
	const url = new URL(toCanonicalDocumentHref(path), SITE_URL).toString();
	const imageUrl = new URL(image, SITE_URL).toString();
	const imageMetadata = {
		alt: imageAlt,
		height: DEFAULT_IMAGE_HEIGHT,
		type: DEFAULT_IMAGE_TYPE,
		url: imageUrl,
		width: DEFAULT_IMAGE_WIDTH,
	};

	return {
		metadataBase: SITE_METADATA_BASE,
		title,
		description,
		alternates: {
			canonical: url,
		},
		robots: {
			follow: true,
			index: true,
		},
		openGraph: {
			title,
			description,
			locale: SITE_LOCALE,
			type,
			url,
			siteName: SITE_NAME,
			images: [imageMetadata],
		},
		twitter: {
			card: 'summary_large_image',
			site: SITE_TWITTER_HANDLE,
			title,
			description,
			images: [imageMetadata],
		},
	};
}
