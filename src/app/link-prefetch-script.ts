export function initializeLinkPrefetchScript(): void {
	const PREFETCHABLE_LINK_SELECTOR = 'a[data-prefetch-link="true"]';
	const prefetchedHrefs = new Set<string>();

	const isPrefetchableInternalHref = (href: string): boolean =>
		href.startsWith('/') && !href.startsWith('//');

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

		prefetchHref(link.href.replace(window.location.origin, ''));
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
