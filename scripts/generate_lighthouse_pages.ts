import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
	FOOTER_COLUMNS,
	FOOTER_META_LINKS,
	getFooterCopyright,
	resolveFooterHref,
} from '@/lib/footer.ts';
import { minifyInlineScript } from '@/lib/minify-inline-script.ts';
import { HEADER_CONTACT_LINK, HEADER_CTA_LINK, PRIMARY_NAV_LINKS } from '@/lib/navigation.ts';
import { initializeThemeScript } from '@/scripts/theme.ts';

const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const DEFAULT_REPORT_DIRECTORY = path.join(PROJECT_ROOT, 'dist-static', 'lighthouse');
const LIGHTHOUSE_BASE_PATH = '/lighthouse';
const MANIFEST_FILE_NAME = 'manifest.json';
const INDEX_FILE_NAME = 'index.html';
const LOGO_FILE_PATH = path.join(PROJECT_ROOT, 'public', 'hotaisle-logo.svg');
const STYLES_FILE_PATH = path.join(PROJECT_ROOT, 'scripts', 'lighthouse-report.css');
const PATH_SEPARATOR_REGEX = /\\/g;
const CATEGORY_IDS = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
const GENERATED_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'short',
	timeZone: 'UTC',
	year: 'numeric',
});
const CATEGORY_LABELS = {
	accessibility: 'Accessibility',
	'best-practices': 'Best Practices',
	performance: 'Performance',
	seo: 'SEO',
} as const;
type CategoryId = (typeof CATEGORY_IDS)[number];

interface LighthouseSummary {
	accessibility?: number;
	'best-practices'?: number;
	performance?: number;
	seo?: number;
}

interface LighthouseManifestEntry {
	htmlPath: string;
	isRepresentativeRun: boolean;
	jsonPath: string;
	summary: LighthouseSummary;
	url: string;
}

interface LighthousePageReport {
	entries: LighthouseManifestEntry[];
	representativeEntry: LighthouseManifestEntry;
}

function normalizePath(filePath: string): string {
	return filePath.replace(PATH_SEPARATOR_REGEX, '/');
}

function resolveReportDirectory(): string {
	const reportDirectory = process.env.LIGHTHOUSE_REPORT_DIR;

	if (!reportDirectory) {
		return DEFAULT_REPORT_DIRECTORY;
	}

	return path.isAbsolute(reportDirectory)
		? reportDirectory
		: path.join(PROJECT_ROOT, reportDirectory);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object';
}

function isLighthouseSummary(value: unknown): value is LighthouseSummary {
	if (!isRecord(value)) {
		return false;
	}

	for (const categoryId of CATEGORY_IDS) {
		const categoryValue = value[categoryId];

		if (categoryValue !== undefined && typeof categoryValue !== 'number') {
			return false;
		}
	}

	return true;
}

function isManifestEntry(value: unknown): value is LighthouseManifestEntry {
	if (!isRecord(value)) {
		return false;
	}

	return (
		typeof value.url === 'string' &&
		typeof value.isRepresentativeRun === 'boolean' &&
		typeof value.htmlPath === 'string' &&
		typeof value.jsonPath === 'string' &&
		isLighthouseSummary(value.summary)
	);
}

async function loadManifest(reportDirectory: string): Promise<LighthouseManifestEntry[]> {
	const manifestPath = path.join(reportDirectory, MANIFEST_FILE_NAME);
	const manifestContents = await readFile(manifestPath, 'utf8');
	const parsedManifest = JSON.parse(manifestContents) as unknown;

	if (!Array.isArray(parsedManifest)) {
		throw new Error(`Unexpected Lighthouse manifest format in ${manifestPath}`);
	}

	if (!parsedManifest.every(isManifestEntry)) {
		throw new Error(`Unexpected Lighthouse manifest format in ${manifestPath}`);
	}

	return parsedManifest;
}

async function loadFooterLogoSvg(): Promise<string> {
	return await readFile(LOGO_FILE_PATH, 'utf8');
}

async function loadStyles(): Promise<string> {
	return await readFile(STYLES_FILE_PATH, 'utf8');
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function getPathLabel(urlString: string): string {
	const { pathname } = new URL(urlString);
	return pathname || '/';
}

function getSiteHref(urlString: string): string {
	const { hash, pathname, search } = new URL(urlString);
	return resolveFooterHref(`${pathname}${search}${hash}`);
}

function toReportHref(reportDirectory: string, filePath: string): string {
	const relativePath = normalizePath(path.relative(reportDirectory, filePath));
	return `${LIGHTHOUSE_BASE_PATH}/${relativePath}`;
}

function getScoreValue(summary: LighthouseSummary, categoryId: CategoryId): number | null {
	const score = summary[categoryId];
	return typeof score === 'number' ? score : null;
}

function getScoreDisplay(score: number | null): string {
	if (score === null) {
		return 'n/a';
	}

	return String(Math.round(score * 100));
}

function getScoreClass(score: number | null): string {
	if (score === null) {
		return 'score-muted';
	}

	const normalizedScore = Math.round(score * 100);

	if (normalizedScore >= 90) {
		return 'score-good';
	}

	if (normalizedScore >= 50) {
		return 'score-ok';
	}

	return 'score-poor';
}

function sortManifestEntries(entries: LighthouseManifestEntry[]): LighthouseManifestEntry[] {
	return [...entries].sort((left, right) => {
		const pathComparison = getPathLabel(left.url).localeCompare(getPathLabel(right.url));

		if (pathComparison !== 0) {
			return pathComparison;
		}

		if (left.isRepresentativeRun !== right.isRepresentativeRun) {
			return left.isRepresentativeRun ? -1 : 1;
		}

		return left.htmlPath.localeCompare(right.htmlPath);
	});
}

function getRepresentativeEntries(entries: LighthouseManifestEntry[]): LighthouseManifestEntry[] {
	const representativeEntries = new Map<string, LighthouseManifestEntry>();

	for (const entry of sortManifestEntries(entries)) {
		const existingEntry = representativeEntries.get(entry.url);

		if (!existingEntry || entry.isRepresentativeRun) {
			representativeEntries.set(entry.url, entry);
		}
	}

	return sortManifestEntries([...representativeEntries.values()]);
}

function getPageReports(entries: LighthouseManifestEntry[]): LighthousePageReport[] {
	const entriesByUrl = new Map<string, LighthouseManifestEntry[]>();

	for (const entry of sortManifestEntries(entries)) {
		const pageEntries = entriesByUrl.get(entry.url) ?? [];
		pageEntries.push(entry);
		entriesByUrl.set(entry.url, pageEntries);
	}

	const pageReports: LighthousePageReport[] = [];

	for (const pageEntries of entriesByUrl.values()) {
		const representativeEntry =
			pageEntries.find((entry) => entry.isRepresentativeRun) ?? pageEntries[0];

		if (!representativeEntry) {
			continue;
		}

		pageReports.push({ entries: pageEntries, representativeEntry });
	}

	return pageReports;
}

function getAverageSummary(entries: LighthouseManifestEntry[]): LighthouseSummary {
	const averageSummary: LighthouseSummary = {};

	for (const categoryId of CATEGORY_IDS) {
		let total = 0;
		let count = 0;

		for (const entry of entries) {
			const score = getScoreValue(entry.summary, categoryId);

			if (score === null) {
				continue;
			}

			total += score;
			count += 1;
		}

		if (count > 0) {
			averageSummary[categoryId] = total / count;
		}
	}

	return averageSummary;
}

function renderScoreCard(
	categoryId: CategoryId,
	label: string,
	score: number | null,
	reportHref: string,
	className: string
): string {
	const scoreDisplay = getScoreDisplay(score);
	const scoreClass = getScoreClass(score);
	const categoryHref = reportHref === '#' ? reportHref : `${reportHref}#${categoryId}`;

	return `
		<a class="score-card ${className} ${scoreClass}" href="${escapeHtml(categoryHref)}">
			<span class="score-label">${escapeHtml(label)}</span>
			<span class="score-value">${escapeHtml(scoreDisplay)}</span>
			<span class="score-caption">Lighthouse score</span>
		</a>
	`;
}

function renderOverviewCards(summary: LighthouseSummary, reportHref: string): string {
	return CATEGORY_IDS.map((categoryId) =>
		renderScoreCard(
			categoryId,
			CATEGORY_LABELS[categoryId],
			getScoreValue(summary, categoryId),
			reportHref,
			'score-card-overview'
		)
	).join('');
}

function renderReportSections(
	reportDirectory: string,
	pageReports: LighthousePageReport[]
): string {
	return pageReports
		.map(({ entries, representativeEntry }) => {
			const entry = representativeEntry;
			const htmlHref = toReportHref(reportDirectory, entry.htmlPath);
			const jsonHref = toReportHref(reportDirectory, entry.jsonPath);
			const pathLabel = getPathLabel(entry.url);
			const runLabel =
				entries.length === 1 ? '1 run measured' : `${entries.length} runs averaged`;
			const averageSummary = getAverageSummary(entries);
			const siteHref = getSiteHref(entry.url);
			const scoreCards = CATEGORY_IDS.map((categoryId) =>
				renderScoreCard(
					categoryId,
					CATEGORY_LABELS[categoryId],
					getScoreValue(averageSummary, categoryId),
					htmlHref,
					'score-card-page'
				)
			).join('');

			return `
				<article class="page-card">
					<header class="page-card-header">
						<div class="page-summary">
							<p class="page-eyebrow">${runLabel}</p>
							<h2>${escapeHtml(pathLabel)}</h2>
							<p class="page-url">${escapeHtml(siteHref)}</p>
						</div>
						<nav class="page-links" aria-label="Report links for ${escapeHtml(pathLabel)}">
							<a href="${escapeHtml(htmlHref)}">HTML report</a>
							<a href="${escapeHtml(jsonHref)}">JSON</a>
						</nav>
					</header>
					<div class="score-grid">${scoreCards}</div>
				</article>
			`;
		})
		.join('');
}

function renderFooter(logoSvg: string): string {
	const footerCopyright = getFooterCopyright();
	const footerColumns = FOOTER_COLUMNS.map((column) => {
		const links = column.links
			.map((link) => {
				const externalAttributes = link.href.startsWith('http')
					? ' rel="noopener" target="_blank"'
					: '';

				return `
					<li>
						<a href="${escapeHtml(link.href)}"${externalAttributes}>${escapeHtml(link.label)}</a>
					</li>
				`;
			})
			.join('');

		return `
			<div class="footer-column">
				<h3>${escapeHtml(column.heading)}</h3>
				<ul>${links}</ul>
			</div>
		`;
	}).join('');

	return `
		<footer class="site-footer">
			<div class="footer-inner">
				<div class="footer-grid">${footerColumns}</div>
				<div class="footer-divider"></div>
				<div class="footer-bottom">
					<a aria-label="Hot Aisle home" class="footer-logo" href="/">
						<span aria-hidden="true" class="footer-logo-mark">${logoSvg}</span>
					</a>
					<p>${escapeHtml(footerCopyright)}</p>
					<nav aria-label="Footer links" class="footer-meta-links">
						${FOOTER_META_LINKS.map((link) => {
							const externalAttributes = link.href.startsWith('http')
								? ' rel="noopener" target="_blank"'
								: '';
							return `<a href="${escapeHtml(link.href)}"${externalAttributes}>${escapeHtml(link.label)}</a>`;
						}).join('')}
					</nav>
				</div>
			</div>
		</footer>
	`;
}

function renderHero(
	representativeEntryCount: number,
	reportCount: number,
	generatedAt: string
): string {
	return `
		<section class="hero">
			<div class="hero-copy">
				<p class="briefing-label">Performance reports</p>
				<h1>Lighthouse reports.</h1>
				<p>Performance matters in every part of our business. We work to make this site fast, accessible, and reliable with the same care we bring to running GPU compute efficiently.</p>
			</div>
			<div class="hero-status">
				<p class="briefing-label">Latest CI run</p>
				<dl>
					<div>
						<dt>Pages measured</dt>
						<dd>${representativeEntryCount}</dd>
					</div>
					<div>
						<dt>Total reports</dt>
						<dd>${reportCount}</dd>
					</div>
					<div>
						<dt>Generated</dt>
						<dd>${escapeHtml(generatedAt)}</dd>
					</div>
				</dl>
			</div>
		</section>
	`;
}

function renderHeader(logoSvg: string): string {
	const primaryNav = PRIMARY_NAV_LINKS.map(
		(link) => `
			<a class="site-header-nav-link" href="${escapeHtml(link.href)}">
				${escapeHtml(link.label)}
			</a>
		`
	).join('');

	return `
		<header class="site-header">
			<div class="site-header-inner">
				<div class="site-header-left">
					<a aria-label="Hot Aisle home" class="site-header-logo" href="/">
						<span aria-hidden="true" class="site-header-logo-mark">${logoSvg}</span>
					</a>
					<nav aria-label="Primary" class="site-header-nav">
						${primaryNav}
					</nav>
				</div>
				<div class="site-header-actions">
					<a class="site-header-contact" href="${escapeHtml(HEADER_CONTACT_LINK.href)}">
						${escapeHtml(HEADER_CONTACT_LINK.label)}
					</a>
					<button aria-label="Toggle color theme" class="ha-theme-toggle" data-theme-toggle title="Toggle color theme" type="button">
						<svg aria-hidden="true" class="ha-theme-toggle__icon" data-theme-icon="dark" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
						</svg>
						<svg aria-hidden="true" class="ha-theme-toggle__icon" data-theme-icon="light" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<circle cx="12" cy="12" r="4"></circle>
							<path d="M12 2v2"></path>
							<path d="M12 20v2"></path>
							<path d="m4.93 4.93 1.41 1.41"></path>
							<path d="m17.66 17.66 1.41 1.41"></path>
							<path d="M2 12h2"></path>
							<path d="M20 12h2"></path>
							<path d="m6.34 17.66-1.41 1.41"></path>
							<path d="m19.07 4.93-1.41 1.41"></path>
						</svg>
					</button>
					<a class="site-header-cta" href="${escapeHtml(HEADER_CTA_LINK.href)}">
						${escapeHtml(HEADER_CTA_LINK.label)}
					</a>
				</div>
			</div>
		</header>
	`;
}

function renderPage(
	reportDirectory: string,
	manifestEntries: LighthouseManifestEntry[],
	logoSvg: string,
	styles: string,
	themeScript: string
): string {
	const pageReports = getPageReports(manifestEntries);
	const representativeEntries = getRepresentativeEntries(manifestEntries);
	const averageSummary = getAverageSummary(manifestEntries);
	const overviewReportHref = representativeEntries[0]
		? toReportHref(reportDirectory, representativeEntries[0].htmlPath)
		: '#';
	const generatedAt = GENERATED_DATE_FORMATTER.format(new Date());

	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Hot Aisle | Lighthouse Reports</title>
		<meta name="description" content="Latest Hot Aisle Lighthouse performance, accessibility, best-practices, and SEO reports.">
		<link rel="canonical" href="https://hotaisle.xyz/lighthouse">
		<link rel="icon" href="/assets/branding/hotaisle-favicon.svg">
		<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
		<style>${styles}</style>
		<script>${themeScript}</script>
	</head>
	<body>
		${renderHeader(logoSvg)}
		<main>
			${renderHero(pageReports.length, manifestEntries.length, generatedAt)}

			<section class="panel">
				<div class="section-header">
					<h2>Top Scores</h2>
					<p>These are the average category scores across all runs included in this build.</p>
				</div>
				<div class="score-grid">${renderOverviewCards(averageSummary, overviewReportHref)}</div>
			</section>

			<section>
				<div class="section-header">
					<h2>Page Reports</h2>
					<p>Each row combines repeated measurements for one page. Open the HTML report for the full results or download the JSON data.</p>
				</div>
				<div class="page-list">${renderReportSections(reportDirectory, pageReports)}</div>
			</section>
		</main>
		${renderFooter(logoSvg)}
	</body>
</html>
`;
}

async function main(): Promise<void> {
	const reportDirectory = resolveReportDirectory();
	const manifestEntries = await loadManifest(reportDirectory);
	const [logoSvg, styles, themeScript] = await Promise.all([
		loadFooterLogoSvg(),
		loadStyles(),
		minifyInlineScript(`(${initializeThemeScript.toString()})();`),
	]);
	const indexPath = path.join(reportDirectory, INDEX_FILE_NAME);

	await writeFile(
		indexPath,
		renderPage(reportDirectory, manifestEntries, logoSvg, styles, themeScript),
		'utf8'
	);

	console.log(
		`Wrote Lighthouse report index to ${normalizePath(path.relative(PROJECT_ROOT, indexPath))}`
	);
}

await main();
