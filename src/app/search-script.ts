import type { SearchResult } from '@/lib/search.ts';

interface SearchScriptConfig {
	searchData: SearchResult[];
}

interface ScoredSearchResult {
	result: SearchResult;
	score: number;
}

export function initializeSearchScript({ searchData }: SearchScriptConfig): void {
	const TOGGLE_SELECTOR = '[data-site-search-toggle]';
	const DIALOG_SELECTOR = '[data-site-search-dialog]';
	const CLOSE_SELECTOR = '[data-site-search-close]';
	const FORM_SELECTOR = '[data-site-search-form]';
	const INPUT_SELECTOR = '[data-site-search-input]';
	const RESULTS_SELECTOR = '[data-site-search-results]';
	const EMPTY_SELECTOR = '[data-site-search-empty]';
	const DEFAULT_RESULT_LIMIT = 8;
	const FEATURED_RESULT_LIMIT = 6;
	const MIN_QUERY_LENGTH = 2;
	const TITLE_EXACT_SCORE = 80;
	const TITLE_TERM_SCORE = 20;
	const DESCRIPTION_EXACT_SCORE = 30;
	const DESCRIPTION_TERM_SCORE = 8;
	const SEARCH_TEXT_EXACT_SCORE = 18;
	const SEARCH_TEXT_TERM_SCORE = 4;
	const TYPE_TERM_SCORE = 6;
	const INDEX_FILE_SUFFIX = '/index.html';

	const normalizeSearchText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

	const toCanonicalDocumentHref = (href: string) => {
		if (
			href.startsWith('#') ||
			href.startsWith('mailto:') ||
			href.startsWith('tel:') ||
			href.startsWith('//')
		) {
			return href;
		}

		const url = new URL(href, window.location.origin);
		if (url.origin !== window.location.origin) {
			return href;
		}

		const { hash, pathname, search } = url;
		if (pathname === '/' || pathname.includes('.')) {
			return `${pathname}${search}${hash}`;
		}

		const canonicalPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

		return `${canonicalPathname}${search}${hash}`;
	};

	const scoreSearchResult = (
		result: SearchResult,
		normalizedQuery: string,
		queryTerms: string[]
	) => {
		const weightedFields = [
			{
				exactScore: TITLE_EXACT_SCORE,
				termScore: TITLE_TERM_SCORE,
				value: normalizeSearchText(result.title),
			},
			{
				exactScore: DESCRIPTION_EXACT_SCORE,
				termScore: DESCRIPTION_TERM_SCORE,
				value: normalizeSearchText(result.description),
			},
			{
				exactScore: SEARCH_TEXT_EXACT_SCORE,
				termScore: SEARCH_TEXT_TERM_SCORE,
				value: normalizeSearchText(result.searchText ?? ''),
			},
			{
				exactScore: 0,
				termScore: TYPE_TERM_SCORE,
				value: normalizeSearchText(`${result.type} ${result.category}`),
			},
		] as const;
		let score = 0;

		for (const { exactScore, termScore, value } of weightedFields) {
			score += value.includes(normalizedQuery) ? exactScore : 0;
			for (const term of queryTerms) {
				score += value.includes(term) ? termScore : 0;
			}
		}

		return score;
	};

	const findSearchResults = (query: string, limit = DEFAULT_RESULT_LIMIT) => {
		const normalizedQuery = normalizeSearchText(query);
		if (normalizedQuery.length < MIN_QUERY_LENGTH) {
			return [];
		}

		const queryTerms = normalizedQuery.split(' ').filter(Boolean);
		const scoredResults: ScoredSearchResult[] = [];

		for (const result of searchData) {
			const score = scoreSearchResult(result, normalizedQuery, queryTerms);
			if (score <= 0) {
				continue;
			}

			scoredResults.push({ result, score });
		}

		return scoredResults
			.sort(
				(left, right) =>
					right.score - left.score || left.result.title.localeCompare(right.result.title)
			)
			.slice(0, limit)
			.map(({ result }) => result);
	};

	const renderResults = (
		resultsContainer: HTMLElement,
		emptyState: HTMLElement,
		results: SearchResult[]
	) => {
		resultsContainer.replaceChildren();
		emptyState.hidden = results.length > 0;

		for (const result of results) {
			const node = document.createElement('a');
			const category = document.createElement('div');
			const content = document.createElement('div');
			const titleRow = document.createElement('div');
			const title = document.createElement('span');
			const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const arrowLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const description = document.createElement('p');

			node.className =
				'group grid gap-3 border-border border-b px-5 py-5 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none sm:grid-cols-[9rem_minmax(0,1fr)] sm:px-6';
			node.dataset.prefetchLink = 'true';
			node.href = toCanonicalDocumentHref(result.url);
			category.className =
				'font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.12em]';
			category.textContent = result.category;
			content.className = 'min-w-0 flex-1';
			titleRow.className = 'flex items-center gap-2';
			title.className = 'truncate font-medium text-foreground text-lg';
			title.textContent = result.title;
			arrow.setAttribute('aria-hidden', 'true');
			arrow.setAttribute(
				'class',
				'h-4 w-4 shrink-0 text-hot-orange-contrast opacity-0 transition-opacity group-hover:opacity-100'
			);
			arrow.setAttribute('viewBox', '0 0 24 24');
			arrow.setAttribute('fill', 'none');
			arrow.setAttribute('stroke', 'currentColor');
			arrow.setAttribute('stroke-linecap', 'round');
			arrow.setAttribute('stroke-linejoin', 'round');
			arrow.setAttribute('stroke-width', '2');
			arrowLine.setAttribute('d', 'M5 12h14');
			arrowHead.setAttribute('d', 'm12 5 7 7-7 7');
			description.className = 'mt-2 line-clamp-2 text-muted-foreground text-sm leading-snug';
			description.textContent = result.description;

			arrow.append(arrowLine, arrowHead);
			titleRow.append(title, arrow);
			content.append(titleRow, description);
			node.append(category, content);

			resultsContainer.append(node);
		}
	};

	const initialize = () => {
		const dialog = document.querySelector(DIALOG_SELECTOR);
		const input = document.querySelector(INPUT_SELECTOR);
		const form = document.querySelector(FORM_SELECTOR);
		const resultsContainer = document.querySelector(RESULTS_SELECTOR);
		const emptyState = document.querySelector(EMPTY_SELECTOR);

		if (
			!(
				dialog instanceof HTMLElement &&
				input instanceof HTMLInputElement &&
				form instanceof HTMLFormElement &&
				resultsContainer instanceof HTMLElement &&
				emptyState instanceof HTMLElement
			)
		) {
			return;
		}

		const toggleButtons = Array.from(document.querySelectorAll(TOGGLE_SELECTOR)).filter(
			(element): element is HTMLButtonElement => element instanceof HTMLButtonElement
		);

		const getVisibleResults = () => {
			const query = input.value.trim();
			return query ? findSearchResults(query) : searchData.slice(0, FEATURED_RESULT_LIMIT);
		};

		const syncResults = () => {
			renderResults(resultsContainer, emptyState, getVisibleResults());
		};

		const setOpen = (isOpen: boolean) => {
			dialog.hidden = !isOpen;
			for (const toggleButton of toggleButtons) {
				toggleButton.setAttribute('aria-expanded', String(isOpen));
			}

			if (isOpen) {
				syncResults();
				input.focus();
			}
		};

		document.addEventListener('click', ({ target }) => {
			if (!(target instanceof Element)) {
				return;
			}

			if (target.closest(TOGGLE_SELECTOR)) {
				setOpen(true);
				return;
			}

			if (target.closest(CLOSE_SELECTOR)) {
				setOpen(false);
			}
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !dialog.hidden) {
				setOpen(false);
			}
		});

		input.addEventListener('input', syncResults);
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const [firstResult] = getVisibleResults();
			if (!firstResult) {
				return;
			}

			window.location.href = toCanonicalDocumentHref(firstResult.url).replace(
				INDEX_FILE_SUFFIX,
				'/'
			);
		});

		resultsContainer.addEventListener('click', ({ target }) => {
			if (target instanceof Element && target.closest('a')) {
				setOpen(false);
			}
		});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initialize, { once: true });
		return;
	}

	initialize();
}
