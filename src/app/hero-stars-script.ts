export function initializeHeroStarsScript(): void {
	const STAR_FIELD_SELECTOR = '[data-hero-star-field]';
	const STAR_SELECTOR = '[data-hero-star]';

	const randomPercent = (): string => `${Math.round(Math.random() * 100)}%`;

	const positionStarField = (starField: Element): void => {
		for (const star of starField.querySelectorAll(STAR_SELECTOR)) {
			if (!(star instanceof HTMLElement)) {
				continue;
			}

			star.style.left = randomPercent();
			star.style.top = randomPercent();
		}
	};

	const positionAllStarFields = (): void => {
		const rootDocument = document;

		for (const starField of rootDocument.querySelectorAll(STAR_FIELD_SELECTOR)) {
			positionStarField(starField);
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', positionAllStarFields, { once: true });
		return;
	}

	positionAllStarFields();
}
