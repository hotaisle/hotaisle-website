import type { ComponentPropsWithoutRef } from 'react';
import { getModernImageVariants } from '@/lib/image-optimization.ts';

interface OptimizedImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'height' | 'width'> {
	disableAvif?: boolean;
	height: number;
	pictureClassName?: string;
	width: number;
}

export function OptimizedImage({
	disableAvif = false,
	pictureClassName,
	src,
	alt,
	height,
	width,
	...imgProps
}: OptimizedImageProps) {
	if (typeof src !== 'string') {
		return <img alt={alt} height={height} src={src} width={width} {...imgProps} />;
	}

	const variants = getModernImageVariants(src).filter((variant) => {
		return !(disableAvif && variant.type === 'image/avif');
	});
	if (variants.length === 0) {
		return <img alt={alt} height={height} src={src} width={width} {...imgProps} />;
	}

	return (
		<picture className={pictureClassName}>
			{variants.map((variant) => (
				<source key={variant.src} srcSet={variant.src} type={variant.type} />
			))}
			<img alt={alt} height={height} src={src} width={width} {...imgProps} />
		</picture>
	);
}
