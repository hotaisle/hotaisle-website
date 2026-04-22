import { OptimizedImage } from '@/components/OptimizedImage.tsx';

interface ImageData {
	alt: string;
	height: number;
	src: string;
	width: number;
}

export function ClickableImage({
	src,
	alt,
	width,
	height,
	className = '',
	imgClassName = '',
}: ImageData & {
	className?: string;
	imgClassName?: string;
}) {
	return (
		<OptimizedImage
			aria-haspopup="dialog"
			alt={alt}
			className={
				className.length > 0
					? `${className} ${imgClassName} cursor-zoom-in`
					: `${imgClassName} cursor-zoom-in`
			}
			data-image-modal="true"
			height={height}
			role="button"
			src={src}
			tabIndex={0}
			width={width}
		/>
	);
}

export type { ImageData };
