export function initializeActiveNavScript(): void {
	const initialize = () => {
		const ACTIVE_NAV_LINK_SELECTOR = '[data-nav-link]';
		const ARIA_CURRENT_PAGE = 'page';
		const EXACT_MATCH_MODE = 'exact';
		const SECTION_MATCH_MODE = 'section';
		const INDEX_FILE_SUFFIX = '/index.html';
		const doc = document;
		const normalizePathname = (pathname: string): string => {
			if (pathname === '/') {
				return pathname;
			}

			if (pathname.endsWith(INDEX_FILE_SUFFIX)) {
				return pathname.slice(0, -INDEX_FILE_SUFFIX.length) || '/';
			}

			return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
		};
		const isActivePath = (currentPath: string, targetPath: string, matchMode: string): boolean => {
			if (matchMode === EXACT_MATCH_MODE) {
				return currentPath === targetPath;
			}

			return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
		};
		const currentPath = normalizePathname(window.location.pathname);

		for (const navLink of doc.querySelectorAll(ACTIVE_NAV_LINK_SELECTOR)) {
			if (!(navLink instanceof HTMLAnchorElement)) {
				continue;
			}

			const targetPath = normalizePathname(navLink.getAttribute('href') ?? '');
			if (!targetPath.startsWith('/')) {
				continue;
			}

			const matchMode = navLink.dataset.navMatch ?? SECTION_MATCH_MODE;
			const isActive = isActivePath(currentPath, targetPath, matchMode);

			if (isActive) {
				navLink.dataset.active = 'true';
				navLink.setAttribute('aria-current', ARIA_CURRENT_PAGE);
				continue;
			}

			delete navLink.dataset.active;
			navLink.removeAttribute('aria-current');
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize, { once: true });
		return;
	}

	initialize();
}
