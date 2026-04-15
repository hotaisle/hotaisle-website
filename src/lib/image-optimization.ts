const LOCAL_RASTER_IMAGE_REGEX = /^(\/[^?#]+\.(png|jpe?g))(?:[?#].*)?$/i;
const URL_SUFFIX_REGEX = /([?#].*)$/;
const AVIF_SOURCE_EXTENSION_REGEX = /\.(png|jpe?g)$/i;
const WEBP_SOURCE_EXTENSION_REGEX = /\.(png|jpe?g)$/i;

interface ModernImageVariant {
	src: string;
	type: 'image/avif' | 'image/webp';
}

function splitImageUrl(imageUrl: string): { pathname: string; suffix: string } {
	const pathname = imageUrl.replace(URL_SUFFIX_REGEX, '');
	const suffix = imageUrl.slice(pathname.length);

	return { pathname, suffix };
}

export function getModernImageVariants(imageUrl: string): ModernImageVariant[] {
	const match = imageUrl.match(LOCAL_RASTER_IMAGE_REGEX);
	if (!match) {
		return [];
	}

	const extension = match[2]?.toLowerCase() ?? '';
	const { pathname, suffix } = splitImageUrl(imageUrl);
	const variants: ModernImageVariant[] = [];

	if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
		variants.push({
			src: `${pathname.replace(AVIF_SOURCE_EXTENSION_REGEX, '.avif')}${suffix}`,
			type: 'image/avif',
		});
	}

	variants.push({
		src: `${pathname.replace(WEBP_SOURCE_EXTENSION_REGEX, '.webp')}${suffix}`,
		type: 'image/webp',
	});

	return variants;
}
