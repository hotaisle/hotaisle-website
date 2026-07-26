export function initializeMobileNavScript(): void {
	const MOBILE_NAV_TOGGLE_SELECTOR = '[data-mobile-nav-toggle]';
	const MOBILE_NAV_CLOSE_SELECTOR = '[data-mobile-nav-close]';
	const MOBILE_BREAKPOINT_QUERY = '(min-width: 1024px)';

	const setExpandedState = (
		button: HTMLButtonElement,
		panel: HTMLElement,
		isExpanded: boolean
	) => {
		button.setAttribute('aria-expanded', String(isExpanded));
		panel.hidden = !isExpanded;
	};

	const closeAllMobileNavPanels = () => {
		for (const button of document.querySelectorAll(MOBILE_NAV_TOGGLE_SELECTOR)) {
			if (!(button instanceof HTMLButtonElement)) {
				continue;
			}

			const panelId = button.getAttribute('aria-controls');
			if (!panelId) {
				continue;
			}

			const panel = document.getElementById(panelId);
			if (!(panel instanceof HTMLElement)) {
				continue;
			}

			setExpandedState(button, panel, false);
		}
	};

	const initialize = () => {
		document.addEventListener('click', ({ target }) => {
			if (!(target instanceof Element)) {
				return;
			}

			const toggleButton = target.closest(MOBILE_NAV_TOGGLE_SELECTOR);
			if (toggleButton instanceof HTMLButtonElement) {
				const panelId = toggleButton.getAttribute('aria-controls');
				if (!panelId) {
					return;
				}

				const panel = document.getElementById(panelId);
				if (!(panel instanceof HTMLElement)) {
					return;
				}

				const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
				setExpandedState(toggleButton, panel, !isExpanded);
				return;
			}

			if (target.closest(MOBILE_NAV_CLOSE_SELECTOR)) {
				closeAllMobileNavPanels();
			}
		});

		const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
		const syncWithViewport = () => {
			closeAllMobileNavPanels();
		};

		mediaQuery.addEventListener('change', syncWithViewport);
		syncWithViewport();
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize, { once: true });
		return;
	}

	initialize();
}
