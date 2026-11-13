import '@/styles/video-modal.css';
import { Play } from 'lucide-react';
import type { ReactNode } from 'react';

interface VideoPreviewProps {
	captions?: string;
	children: ReactNode;
	className?: string;
	poster?: string;
	src: string;
	title: string;
	transcript?: string;
}

export function VideoPreview({
	captions,
	children,
	className = '',
	poster,
	src,
	title,
	transcript,
}: VideoPreviewProps) {
	return (
		<>
			<button
				aria-haspopup="dialog"
				aria-label={`Play ${title}`}
				className={`ha-video-preview ${className}`}
				data-video-captions={captions}
				data-video-modal={src}
				data-video-poster={poster}
				data-video-title={title}
				data-video-transcript={transcript}
				type="button"
			>
				{children}
				<span aria-hidden="true" className="ha-video-preview__play">
					<Play aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
				</span>
			</button>
			<noscript>
				<a href={src}>Watch {title}</a>
			</noscript>
		</>
	);
}
