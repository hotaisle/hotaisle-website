const LOCAL_RASTER_IMAGE_REGEX = /^(\/[^?#]+\.(png|jpe?g))(?:[?#].*)?$/i;
const URL_SUFFIX_REGEX = /([?#].*)$/;
const AVIF_SOURCE_EXTENSION_REGEX = /\.(png|jpe?g)$/i;
const WEBP_SOURCE_EXTENSION_REGEX = /\.(png|jpe?g)$/i;

interface ModernImageVariant {
	src: string;
	srcSet?: string;
	type: 'image/avif' | 'image/webp';
}

function splitImageUrl(imageUrl: string): { pathname: string; suffix: string } {
	const pathname = imageUrl.replace(URL_SUFFIX_REGEX, '');
	const suffix = imageUrl.slice(pathname.length);

	return { pathname, suffix };
}

function toWidthVariantPath(pathname: string, extension: string, width: number): string {
	return pathname.replace(WEBP_SOURCE_EXTENSION_REGEX, `-${width}w.${extension}`);
}

export function getModernImageVariants(
	imageUrl: string,
	intrinsicWidth?: number,
	responsiveWidths: readonly number[] = []
): ModernImageVariant[] {
	const match = imageUrl.match(LOCAL_RASTER_IMAGE_REGEX);
	if (!match) {
		return [];
	}

	const extension = match[2]?.toLowerCase() ?? '';
	const { pathname, suffix } = splitImageUrl(imageUrl);
	const variants: ModernImageVariant[] = [];

	if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
		const src = `${pathname.replace(AVIF_SOURCE_EXTENSION_REGEX, '.avif')}${suffix}`;
		variants.push({
			src,
			srcSet: toResponsiveSrcSet(
				pathname,
				suffix,
				'avif',
				src,
				intrinsicWidth,
				responsiveWidths
			),
			type: 'image/avif',
		});
	}

	const src = `${pathname.replace(WEBP_SOURCE_EXTENSION_REGEX, '.webp')}${suffix}`;
	variants.push({
		src,
		srcSet: toResponsiveSrcSet(pathname, suffix, 'webp', src, intrinsicWidth, responsiveWidths),
		type: 'image/webp',
	});

	return variants;
}

function toResponsiveSrcSet(
	pathname: string,
	suffix: string,
	extension: 'avif' | 'webp',
	originalSrc: string,
	intrinsicWidth: number | undefined,
	responsiveWidths: readonly number[]
): string | undefined {
	if (!intrinsicWidth || responsiveWidths.length === 0) {
		return;
	}

	const candidates = responsiveWidths
		.filter((width) => width > 0 && width < intrinsicWidth)
		.map((width) => `${toWidthVariantPath(pathname, extension, width)}${suffix} ${width}w`);
	candidates.push(`${originalSrc} ${intrinsicWidth}w`);

	return candidates.join(', ');
}
