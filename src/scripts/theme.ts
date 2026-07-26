export function initializeThemeScript(): void {
	const STORAGE_KEY = 'theme';
	const DARK_CLASS = 'dark';
	const LIGHT_CLASS = 'light';
	const THEME_TOGGLE_SELECTOR = '[data-theme-toggle]';

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
	};

	const toggleTheme = () => {
		const nextTheme = document.documentElement.classList.contains(DARK_CLASS)
			? LIGHT_CLASS
			: DARK_CLASS;
		persistTheme(nextTheme);
		applyTheme(nextTheme);
	};

	document.addEventListener('click', ({ target }) => {
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
