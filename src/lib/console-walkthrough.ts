import { fingerprintPublicAsset } from '@/lib/versioned-public-asset.ts';

export const CONSOLE_WALKTHROUGH = {
	captions: '/assets/quickstart/hotaisle-console-walkthrough.en.vtt',
	poster: '/assets/quickstart/hotaisle-console-walkthrough-poster.webp',
	src: '/assets/quickstart/hotaisle-console-walkthrough.mp4',
	title: 'Hot Aisle Console walkthrough',
	transcript: '/assets/quickstart/hotaisle-console-walkthrough-transcript.txt',
} as const;

// These components render to static HTML; hash files once during the site build.
const WALKTHROUGH_MEDIA_KEYS = ['captions', 'poster', 'src', 'transcript'] as const;
const WALKTHROUGH_VERSIONS = new Map<string, string>(
	WALKTHROUGH_MEDIA_KEYS.map((key) => {
		const path = CONSOLE_WALKTHROUGH[key];
		return [path, fingerprintPublicAsset(path)] as const;
	})
);

export function walkthroughAssetURL(source: string | undefined) {
	return source === undefined ? undefined : (WALKTHROUGH_VERSIONS.get(source) ?? source);
}
