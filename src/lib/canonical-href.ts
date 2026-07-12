const CANONICAL_HREF_BASE_URL = 'https://hotaisle.local';
const INTERNAL_ROOT_RELATIVE_HREF_PREFIX = '/';
const PROTOCOL_RELATIVE_HREF_PREFIX = '//';
const LAST_PATH_SEGMENT_EXTENSION_REGEX = /\/[^/]*\.[^/]*$/;

export function toCanonicalDocumentHref(href: string): string {
	if (
		!href.startsWith(INTERNAL_ROOT_RELATIVE_HREF_PREFIX) ||
		href.startsWith(PROTOCOL_RELATIVE_HREF_PREFIX)
	) {
		return href;
	}

	try {
		const hrefUrl = new URL(href, CANONICAL_HREF_BASE_URL);
		const { hash, pathname, search } = hrefUrl;
		if (
			pathname === INTERNAL_ROOT_RELATIVE_HREF_PREFIX ||
			LAST_PATH_SEGMENT_EXTENSION_REGEX.test(pathname)
		) {
			return `${pathname}${search}${hash}`;
		}

		const canonicalPathname = pathname.endsWith(INTERNAL_ROOT_RELATIVE_HREF_PREFIX)
			? pathname.slice(0, -1)
			: pathname;

		return `${canonicalPathname}${search}${hash}`;
	} catch {
		return href;
	}
}
