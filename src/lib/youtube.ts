const HTML_AMPERSAND_REGEX = /&amp;/g;
const STANDALONE_LINK_PARAGRAPH_REGEX = /<p>\s*<a\s+href="([^"]+)"[^>]*>[\s\S]*?<\/a>\s*<\/p>/g;
const VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
	'm.youtube.com',
	'music.youtube.com',
	'www.youtube.com',
	'youtube.com',
]);
const YOUTUBE_PATH_TYPES = new Set(['embed', 'live', 'shorts']);

function getYouTubeVideoId(url: URL): string | null {
	const host = url.hostname.toLowerCase();
	if (host === 'youtu.be' || host === 'www.youtu.be') {
		return url.pathname.split('/').find(Boolean) ?? null;
	}

	if (!YOUTUBE_HOSTS.has(host)) {
		return null;
	}

	if (url.pathname === '/watch') {
		return url.searchParams.get('v');
	}

	const [pathType, videoId] = url.pathname.split('/').filter(Boolean);
	return pathType && YOUTUBE_PATH_TYPES.has(pathType) ? (videoId ?? null) : null;
}

export function toYouTubeEmbedUrl(rawUrl: string): string | null {
	let url: URL;

	try {
		url = new URL(rawUrl.replace(HTML_AMPERSAND_REGEX, '&'));
	} catch {
		return null;
	}

	const videoId = getYouTubeVideoId(url);
	if (!(videoId && VIDEO_ID_REGEX.test(videoId))) {
		return null;
	}

	return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function embedStandaloneYouTubeLinks(html: string): string {
	return html.replace(STANDALONE_LINK_PARAGRAPH_REGEX, (fullMatch, href: string) => {
		const embedUrl = toYouTubeEmbedUrl(href);
		if (!embedUrl) {
			return fullMatch;
		}

		return `<figure class="blog-video"><div class="blog-video__frame"><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin" src="${embedUrl}" title="YouTube video player"></iframe></div><figcaption><a href="${href}" rel="noopener noreferrer" target="_blank">Watch on YouTube</a></figcaption></figure>`;
	});
}
