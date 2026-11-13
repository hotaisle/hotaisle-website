import '@/styles/video-modal.css';
import { Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { walkthroughAssetURL } from '@/lib/console-walkthrough.ts';

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
				data-video-captions={walkthroughAssetURL(captions)}
				data-video-modal={walkthroughAssetURL(src)}
				data-video-poster={walkthroughAssetURL(poster)}
				data-video-title={title}
				data-video-transcript={walkthroughAssetURL(transcript)}
				type="button"
			>
				{children}
				<span aria-hidden="true" className="ha-video-preview__play">
					<Play aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
				</span>
			</button>
			<noscript>
				<a href={walkthroughAssetURL(src)}>Watch {title}</a>
			</noscript>
		</>
	);
}
