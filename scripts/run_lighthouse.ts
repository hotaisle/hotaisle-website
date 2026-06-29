import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { LaunchedChrome } from 'chrome-launcher';
import { launch } from 'chrome-launcher';
import type { Result as LighthouseResult } from 'lighthouse';
import lighthouse, { desktopConfig, generateReport } from 'lighthouse';
import { startStaticServer } from './static_server.ts';

const CONFIG_FILE_NAME = '.lighthouserc.cjs';
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 4174;
const DEFAULT_NUMBER_OF_RUNS = 1;
const DEFAULT_OUTPUT_DIRECTORY = '.lighthouseci/reports';
const DEFAULT_PUBLIC_BASE_URL = 'https://hotaisle.github.io/hotaisle-website/';
const DEFAULT_STATIC_DIRECTORY = './dist-static';
const MANIFEST_FILE_NAME = 'manifest.json';
const PATH_SEPARATOR_REGEX = /\\/g;
const LEADING_SLASHES_REGEX = /^\/+/;
const SCORE_CATEGORY_IDS = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
const CHROME_FLAG_TOKEN_REGEX = /"[^"]*"|'[^']*'|[^\s]+/g;
const HEADLESS_CHROME_FLAGS = [
	'--headless=new',
	'--no-first-run',
	'--allow-insecure-localhost',
] as const;
const DUPLICATE_SLASHES_REGEX = /\/{2,}/g;
const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const LOCAL_TLS_CERT_PATH = path.join(PROJECT_ROOT, '.dev-localhost-cert.pem');
const LOCAL_TLS_KEY_PATH = path.join(PROJECT_ROOT, '.dev-localhost-key.pem');

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

interface LighthouseRunResult {
	htmlPath: string;
	jsonPath: string;
	lhr: LighthouseResult;
	runIndex: number;
	url: string;
}

interface LighthouseCollectSettings {
	chromeFlags?: string;
	preset?: string;
	[key: string]: unknown;
}

interface LighthouseCollectConfig {
	numberOfRuns?: number;
	settings?: LighthouseCollectSettings;
	staticDistDir?: string;
	url?: string[];
}

interface LighthouseUploadConfig {
	outputDir?: string;
	target?: string;
}

interface LighthouseRcConfig {
	ci?: {
		collect?: LighthouseCollectConfig;
		upload?: LighthouseUploadConfig;
	};
}

function normalizePath(filePath: string): string {
	return filePath.replace(PATH_SEPARATOR_REGEX, '/');
}

function resolveConfig(): LighthouseRcConfig {
	const configPath = path.join(PROJECT_ROOT, CONFIG_FILE_NAME);
	const require = createRequire(import.meta.url);
	const loadedConfig = require(configPath) as LighthouseRcConfig;

	if (!loadedConfig.ci?.collect) {
		throw new Error(`Missing ci.collect in ${CONFIG_FILE_NAME}`);
	}

	return loadedConfig;
}

function resolveOutputDirectory(config: LighthouseRcConfig): string {
	const outputDirectory = config.ci?.upload?.outputDir ?? DEFAULT_OUTPUT_DIRECTORY;

	return path.isAbsolute(outputDirectory)
		? outputDirectory
		: path.join(PROJECT_ROOT, outputDirectory);
}

function resolveStaticDirectory(config: LighthouseRcConfig): string {
	const staticDirectory = config.ci?.collect?.staticDistDir ?? DEFAULT_STATIC_DIRECTORY;

	return path.isAbsolute(staticDirectory)
		? staticDirectory
		: path.join(PROJECT_ROOT, staticDirectory);
}

function resolvePublicBaseUrl(): string {
	const publicBaseUrl = process.env.LIGHTHOUSE_PUBLIC_BASE_URL ?? DEFAULT_PUBLIC_BASE_URL;

	try {
		return new URL(publicBaseUrl).toString();
	} catch {
		throw new Error(`Invalid LIGHTHOUSE_PUBLIC_BASE_URL: ${publicBaseUrl}`);
	}
}

function resolveRequestedUrls(config: LighthouseRcConfig, baseUrl: string): string[] {
	const configuredUrls = config.ci?.collect?.url ?? [];

	if (configuredUrls.length === 0) {
		throw new Error(`No ci.collect.url entries found in ${CONFIG_FILE_NAME}`);
	}

	return configuredUrls.map((configuredUrl) => {
		try {
			const parsedUrl = new URL(configuredUrl);
			return new URL(
				`${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
				baseUrl
			).toString();
		} catch {
			return new URL(configuredUrl, baseUrl).toString();
		}
	});
}

function parseChromeFlags(chromeFlags: string | undefined): string[] {
	if (!chromeFlags) {
		return [...HEADLESS_CHROME_FLAGS];
	}

	const tokens = chromeFlags.match(CHROME_FLAG_TOKEN_REGEX) ?? [];
	const normalizedFlags = tokens.map((token) => token.replace(/^['"]|['"]$/g, ''));

	for (const requiredFlag of HEADLESS_CHROME_FLAGS) {
		const requiredFlagName = requiredFlag.split('=')[0];
		const hasRequiredFlag = normalizedFlags.some(
			(flag) => flag.split('=')[0] === requiredFlagName
		);

		if (!hasRequiredFlag) {
			normalizedFlags.push(requiredFlag);
		}
	}

	return normalizedFlags;
}

function getLighthouseConfig(settings: LighthouseCollectSettings | undefined): object | undefined {
	if (!settings?.preset) {
		return;
	}

	if (settings.preset === 'desktop') {
		return desktopConfig;
	}

	throw new Error(`Unsupported Lighthouse preset in ${CONFIG_FILE_NAME}: ${settings.preset}`);
}

function getLighthouseFlags(
	settings: LighthouseCollectSettings | undefined,
	port: number
): Record<string, unknown> {
	if (!settings) {
		return { port };
	}

	const { chromeFlags: _chromeFlags, preset: _preset, ...otherSettings } = settings;
	return {
		...otherSettings,
		port,
	};
}

function getSummary(lhr: LighthouseRunResult['lhr']): LighthouseSummary {
	const summary: LighthouseSummary = {};

	for (const categoryId of SCORE_CATEGORY_IDS) {
		const score = lhr.categories?.[categoryId]?.score;
		if (typeof score === 'number') {
			summary[categoryId] = score;
		}
	}

	return summary;
}

function getRelativeReportStem(url: string, runIndex: number): string {
	const { pathname } = new URL(url);
	const normalizedPathname = pathname === '/' ? 'home' : pathname.replace(/^\/+|\/+$/g, '');
	const fileSafePathname = normalizedPathname
		.replaceAll('/', '--')
		.replace(/[^a-zA-Z0-9-_]/g, '-');

	return `${fileSafePathname}-run-${runIndex + 1}`;
}

function rewriteDisplayUrl(url: string, publicBaseUrl: string): string {
	const auditedUrl = new URL(url);
	const publicUrl = new URL(publicBaseUrl);
	const normalizedBasePath = publicUrl.pathname.endsWith('/')
		? publicUrl.pathname
		: `${publicUrl.pathname}/`;
	const normalizedAuditedPath = auditedUrl.pathname.replace(LEADING_SLASHES_REGEX, '');

	publicUrl.pathname = `${normalizedBasePath}${normalizedAuditedPath}`.replace(
		DUPLICATE_SLASHES_REGEX,
		'/'
	);
	publicUrl.search = auditedUrl.search;
	publicUrl.hash = auditedUrl.hash;

	return publicUrl.toString();
}

function rewriteReportUrls(
	lhr: LighthouseResult,
	auditedUrl: string,
	publicBaseUrl: string
): LighthouseResult {
	const displayUrl = rewriteDisplayUrl(auditedUrl, publicBaseUrl);

	return {
		...lhr,
		finalDisplayedUrl: displayUrl,
		finalUrl: displayUrl,
		mainDocumentUrl: displayUrl,
		requestedUrl: displayUrl,
	};
}

async function runBuild(): Promise<void> {
	const buildProcess = spawn('bun', ['run', 'build:internal'], {
		cwd: PROJECT_ROOT,
		stdio: 'inherit',
	});

	await new Promise<void>((resolve, reject) => {
		buildProcess.once('error', reject);
		buildProcess.once('exit', (exitCode, signal) => {
			if (signal) {
				reject(new Error(`bun run build:internal exited from signal ${signal}`));
				return;
			}

			if (exitCode !== 0) {
				reject(
					new Error(`bun run build:internal exited with code ${exitCode ?? 'unknown'}`)
				);
				return;
			}

			resolve();
		});
	});
}

async function writeReports(
	reportDirectory: string,
	runResult: LighthouseRunResult,
	publicBaseUrl: string
): Promise<void> {
	const { htmlPath, jsonPath, lhr } = runResult;
	await writeFile(jsonPath, `${JSON.stringify(lhr, null, 2)}\n`, 'utf8');

	const htmlReport = rewriteReportTopbarLink(generateReport(lhr, 'html'), publicBaseUrl);
	await writeFile(htmlPath, htmlReport, 'utf8');
	console.log(
		`Saved Lighthouse reports to ${normalizePath(path.relative(PROJECT_ROOT, reportDirectory))}`
	);
}

function rewriteReportTopbarLink(reportHtml: string, publicBaseUrl: string): string {
	const targetCode = 'this._dom.safelySetHref(n,e.finalDisplayedUrl),t}';
	const replacementCode = `this._dom.safelySetHref(n,${JSON.stringify(publicBaseUrl)}),n.setAttribute("target","_self"),n.removeAttribute("rel"),t}`;

	if (!reportHtml.includes(targetCode)) {
		throw new Error('Could not find Lighthouse topbar link code to rewrite');
	}

	return reportHtml.replace(targetCode, replacementCode);
}

function selectRepresentativeRunIndices(runResults: LighthouseRunResult[]): Set<number> {
	const groupedRunResults = new Map<string, LighthouseRunResult[]>();

	for (const runResult of runResults) {
		const group = groupedRunResults.get(runResult.url) ?? [];
		group.push(runResult);
		groupedRunResults.set(runResult.url, group);
	}

	const representativeRunIndices = new Set<number>();

	for (const [, urlRunResults] of groupedRunResults) {
		const sortedRunResults = [...urlRunResults].sort((left, right) => {
			const leftScore = left.lhr.categories?.performance?.score ?? Number.NEGATIVE_INFINITY;
			const rightScore = right.lhr.categories?.performance?.score ?? Number.NEGATIVE_INFINITY;

			if (leftScore !== rightScore) {
				return leftScore - rightScore;
			}

			return left.runIndex - right.runIndex;
		});

		const medianIndex = Math.floor((sortedRunResults.length - 1) / 2);
		const representativeRun = sortedRunResults[medianIndex] ?? urlRunResults[0];
		representativeRunIndices.add(representativeRun.runIndex);
	}

	return representativeRunIndices;
}

async function writeManifest(
	reportDirectory: string,
	runResults: LighthouseRunResult[]
): Promise<void> {
	const representativeRunIndices = selectRepresentativeRunIndices(runResults);
	const manifestEntries: LighthouseManifestEntry[] = runResults.map((runResult) => ({
		htmlPath: runResult.htmlPath,
		isRepresentativeRun: representativeRunIndices.has(runResult.runIndex),
		jsonPath: runResult.jsonPath,
		summary: getSummary(runResult.lhr),
		url: runResult.url,
	}));

	const manifestPath = path.join(reportDirectory, MANIFEST_FILE_NAME);
	await writeFile(manifestPath, `${JSON.stringify(manifestEntries, null, 2)}\n`, 'utf8');
}

async function writeReportIndex(reportDirectory: string): Promise<void> {
	const indexProcess = spawn('bun', ['run', 'scripts/generate_lighthouse_pages.ts'], {
		cwd: PROJECT_ROOT,
		env: {
			...process.env,
			LIGHTHOUSE_REPORT_DIR: reportDirectory,
		},
		stdio: 'inherit',
	});

	await new Promise<void>((resolve, reject) => {
		indexProcess.once('error', reject);
		indexProcess.once('exit', (exitCode, signal) => {
			if (signal) {
				reject(
					new Error(
						`bun run scripts/generate_lighthouse_pages.ts exited from signal ${signal}`
					)
				);
				return;
			}

			if (exitCode !== 0) {
				reject(
					new Error(
						`bun run scripts/generate_lighthouse_pages.ts exited with code ${exitCode ?? 'unknown'}`
					)
				);
				return;
			}

			resolve();
		});
	});
}

async function runLighthouseAudit(
	url: string,
	runIndex: number,
	reportDirectory: string,
	port: number,
	collectConfig: LighthouseCollectConfig,
	publicBaseUrl: string
): Promise<LighthouseRunResult> {
	const reportStem = getRelativeReportStem(url, runIndex);
	const jsonPath = path.join(reportDirectory, `${reportStem}.report.json`);
	const htmlPath = path.join(reportDirectory, `${reportStem}.report.html`);
	const settings = collectConfig.settings;
	const flags = getLighthouseFlags(settings, port);
	const config = getLighthouseConfig(settings);
	const runnerResult = await lighthouse(url, flags, config);

	if (!runnerResult) {
		throw new Error(`Lighthouse did not return a result for ${url}`);
	}

	const runResult: LighthouseRunResult = {
		htmlPath,
		jsonPath,
		lhr: rewriteReportUrls(runnerResult.lhr, url, publicBaseUrl),
		runIndex,
		url: rewriteDisplayUrl(url, publicBaseUrl),
	};

	await writeReports(reportDirectory, runResult, publicBaseUrl);
	return runResult;
}

async function main(): Promise<void> {
	const lighthouseConfig = resolveConfig();
	const collectConfig = lighthouseConfig.ci?.collect;

	if (!collectConfig) {
		throw new Error(`Missing ci.collect in ${CONFIG_FILE_NAME}`);
	}

	const host = process.env.LIGHTHOUSE_HOST ?? process.env.HOST ?? DEFAULT_HOST;
	const port = Number.parseInt(
		process.env.LIGHTHOUSE_PORT ?? process.env.PORT ?? `${DEFAULT_PORT}`,
		10
	);

	if (Number.isNaN(port)) {
		throw new Error(
			`Invalid Lighthouse port: ${process.env.LIGHTHOUSE_PORT ?? process.env.PORT}`
		);
	}

	const reportDirectory = resolveOutputDirectory(lighthouseConfig);
	const publicBaseUrl = resolvePublicBaseUrl();
	const staticDirectory = resolveStaticDirectory(lighthouseConfig);
	const chromeFlags = parseChromeFlags(collectConfig.settings?.chromeFlags);
	const numberOfRuns = collectConfig.numberOfRuns ?? DEFAULT_NUMBER_OF_RUNS;

	await rm(reportDirectory, { force: true, recursive: true });
	await mkdir(reportDirectory, { recursive: true });

	console.log('Building static site for Lighthouse...');
	await runBuild();

	const server = await startStaticServer({
		development: false,
		directory: staticDirectory,
		hostname: host,
		port,
		tls: {
			cert: fs.readFileSync(LOCAL_TLS_CERT_PATH),
			key: fs.readFileSync(LOCAL_TLS_KEY_PATH),
		},
	});

	const baseUrl = `https://${host}:${server.port}`;
	const urls = resolveRequestedUrls(lighthouseConfig, baseUrl);

	console.log(`Serving Lighthouse target at ${baseUrl}`);

	let chrome: LaunchedChrome | null = null;

	try {
		chrome = await launch({
			chromeFlags,
			logLevel: 'info',
			port: 0,
		});

		const runResults: LighthouseRunResult[] = [];
		let runCounter = 0;

		for (const url of urls) {
			for (let runAttemptIndex = 0; runAttemptIndex < numberOfRuns; runAttemptIndex += 1) {
				console.log(
					`Running Lighthouse for ${url} (${runAttemptIndex + 1}/${numberOfRuns})`
				);

				const runResult = await runLighthouseAudit(
					url,
					runCounter,
					reportDirectory,
					chrome.port,
					collectConfig,
					publicBaseUrl
				);

				runResults.push(runResult);
				runCounter += 1;
			}
		}

		await writeManifest(reportDirectory, runResults);
		await writeReportIndex(reportDirectory);

		console.log(
			`Lighthouse reports written to ${normalizePath(path.relative(PROJECT_ROOT, reportDirectory))}`
		);
	} finally {
		chrome?.kill();
		await server.stop(true);
	}
}

await main();
