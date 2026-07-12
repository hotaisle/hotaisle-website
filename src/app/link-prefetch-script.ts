export function initializeLinkPrefetchScript(): void {
	const PREFETCHABLE_LINK_SELECTOR = 'a[data-prefetch-link="true"]';
	const ROOT_PATH = '/';
	const prefetchedHrefs = new Set<string>();

	const isPrefetchableInternalHref = (href: string): boolean =>
		href.startsWith('/') && !href.startsWith('//');

	const hasLastPathSegmentExtension = (pathname: string): boolean => {
		const lastSlashIndex = pathname.lastIndexOf(ROOT_PATH);
		const lastPathSegment = pathname.slice(lastSlashIndex + 1);
		return lastPathSegment.includes('.') && !lastPathSegment.startsWith('.');
	};

	const toCanonicalPrefetchHref = (href: string): string | null => {
		try {
			const hrefUrl = new URL(href, window.location.origin);
			if (hrefUrl.origin !== window.location.origin) {
				return null;
			}

			const { hash, pathname, search } = hrefUrl;
			if (pathname === ROOT_PATH || hasLastPathSegmentExtension(pathname)) {
				return `${pathname}${search}${hash}`;
			}

			const canonicalPathname = pathname.endsWith(ROOT_PATH)
				? pathname.slice(0, -1)
				: pathname;

			return `${canonicalPathname}${search}${hash}`;
		} catch {
			return null;
		}
	};

	const prefetchHref = (href: string): void => {
		if (!isPrefetchableInternalHref(href)) {
			return;
		}

		if (prefetchedHrefs.has(href)) {
			return;
		}

		const existingPrefetch = document.head.querySelector<HTMLLinkElement>(
			`link[rel="prefetch"][href="${href}"]`
		);
		if (existingPrefetch) {
			prefetchedHrefs.add(href);
			return;
		}

		const prefetchLink = document.createElement('link');
		prefetchLink.rel = 'prefetch';
		prefetchLink.href = href;
		prefetchLink.as = 'document';
		document.head.append(prefetchLink);
		prefetchedHrefs.add(href);
	};

	const maybePrefetchLink = (target: EventTarget | null): void => {
		if (!(target instanceof Element)) {
			return;
		}

		const link = target.closest(PREFETCHABLE_LINK_SELECTOR);
		if (!(link instanceof HTMLAnchorElement)) {
			return;
		}

		const canonicalHref = toCanonicalPrefetchHref(link.href);
		if (!canonicalHref) {
			return;
		}

		prefetchHref(canonicalHref);
	};

	document.addEventListener('focusin', (event) => {
		maybePrefetchLink(event.target);
	});
	document.addEventListener('mouseover', (event) => {
		maybePrefetchLink(event.target);
	});
	document.addEventListener(
		'touchstart',
		(event) => {
			maybePrefetchLink(event.target);
		},
		{ passive: true }
	);
}
