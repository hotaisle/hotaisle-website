export function initializeThemeScript(): void {
	const STORAGE_KEY = 'theme';
	const DARK_CLASS = 'dark';
	const LIGHT_CLASS = 'light';
	const THEME_TOGGLE_SELECTOR = '[data-theme-toggle]';
	const THEME_ICON_SELECTOR = '[data-theme-icon]';

	const getStoredTheme = () => {
		try {
			return window.localStorage.getItem(STORAGE_KEY);
		} catch {
			return null;
		}
	};

	const persistTheme = (theme: string) => {
		try {
			window.localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Ignore storage write failures in restricted browser contexts.
		}
	};

	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme();
		if (storedTheme === DARK_CLASS || storedTheme === LIGHT_CLASS) {
			return storedTheme;
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_CLASS : LIGHT_CLASS;
	};

	const applyTheme = (theme: string) => {
		const root = document.documentElement;
		root.classList.remove(LIGHT_CLASS, DARK_CLASS);
		root.classList.add(theme);
		root.dataset.theme = theme;

		const nextTheme = theme === DARK_CLASS ? LIGHT_CLASS : DARK_CLASS;
		for (const button of document.querySelectorAll<HTMLElement>(THEME_TOGGLE_SELECTOR)) {
			button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
			button.setAttribute('title', `Switch to ${nextTheme} mode`);
			button.setAttribute('data-theme-current', theme);
			const label = button.querySelector('[data-theme-label]');
			if (label) {
				label.textContent = theme === DARK_CLASS ? 'Dark' : 'Light';
			}

			for (const icon of button.querySelectorAll<HTMLElement>(THEME_ICON_SELECTOR)) {
				const iconTheme = icon.getAttribute('data-theme-icon');
				const shouldShowIcon = iconTheme === nextTheme;
				icon.toggleAttribute('hidden', !shouldShowIcon);
			}
		}
	};

	const toggleTheme = () => {
		const nextTheme = document.documentElement.classList.contains(DARK_CLASS)
			? LIGHT_CLASS
			: DARK_CLASS;
		persistTheme(nextTheme);
		applyTheme(nextTheme);
	};

	document.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		const button = target.closest(THEME_TOGGLE_SELECTOR);
		if (!(button instanceof HTMLButtonElement)) {
			return;
		}

		toggleTheme();
	});

	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const syncPreferredTheme = () => {
		if (getStoredTheme() === null) {
			applyTheme(getPreferredTheme());
		}
	};
	mediaQuery.addEventListener('change', syncPreferredTheme);

	applyTheme(getPreferredTheme());
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => applyTheme(getPreferredTheme()), {
			once: true,
		});
	}
}
