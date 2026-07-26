import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import {
	copyFile,
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	rename,
	rm,
	stat,
	writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
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
const DEFAULT_OUTPUT_DIRECTORY = './dist-static/lighthouse';
const DEFAULT_PUBLIC_BASE_URL = 'https://hotaisle.xyz/';
const DEFAULT_STATIC_DIRECTORY = './dist-static';
const LIGHTHOUSE_REPORT_INDEX_PATH = '/lighthouse';
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
const PREVIEW_CACHE_DIRECTORY = path.join(PROJECT_ROOT, '.lighthouseci', 'preview-cache');
const PREVIEW_CACHE_REPORT_DIRECTORY = path.join(PREVIEW_CACHE_DIRECTORY, 'reports');
const PREVIEW_CACHE_FINGERPRINT_PATH = path.join(PREVIEW_CACHE_DIRECTORY, 'fingerprint');
const PREVIEW_CACHE_REQUIRED_FILES = ['index.html', MANIFEST_FILE_NAME] as const;
const FINGERPRINT_DIRECTORIES = ['public', 'scripts', 'src'] as const;
const FINGERPRINT_FILES = [
	'.lighthouserc.cjs',
	'astro.config.ts',
	'biome.jsonc',
	'bun.lock',
	'package.json',
	'tsconfig.json',
	'tsconfig.node.json',
	'wrangler.jsonc',
] as const;
const FINGERPRINT_EXCLUDED_PATH_PREFIXES = ['public/assets/blog/'] as const;
const REUSE_LIGHTHOUSE_ENVIRONMENT_VALUE = 'true';

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

function isFingerprintPathExcluded(relativePath: string): boolean {
	const normalizedPath = relativePath.endsWith('/') ? relativePath : `${relativePath}/`;
	return FINGERPRINT_EXCLUDED_PATH_PREFIXES.some((excludedPath) =>
		normalizedPath.startsWith(excludedPath)
	);
}

async function collectDirectoryFiles(directory: string): Promise<string[]> {
	const directoryEntries = await readdir(directory, { withFileTypes: true });
	const fileGroups = await Promise.all(
		directoryEntries.map(async (directoryEntry): Promise<string[]> => {
			const entryPath = path.join(directory, directoryEntry.name);
			const relativePath = normalizePath(path.relative(PROJECT_ROOT, entryPath));
			if (isFingerprintPathExcluded(relativePath)) {
				return [];
			}

			if (directoryEntry.isDirectory()) {
				return await collectDirectoryFiles(entryPath);
			}

			return directoryEntry.isFile() ? [entryPath] : [];
		})
	);

	return fileGroups.flat();
}

async function createLighthouseInputFingerprint(): Promise<string> {
	const directoryFileGroups = await Promise.all(
		FINGERPRINT_DIRECTORIES.map(
			async (directory) => await collectDirectoryFiles(path.join(PROJECT_ROOT, directory))
		)
	);
	const configuredFiles = FINGERPRINT_FILES.map((filePath) => path.join(PROJECT_ROOT, filePath));
	const inputFiles = [...configuredFiles, ...directoryFileGroups.flat()].sort();
	const fileStats = await Promise.all(inputFiles.map(async (filePath) => await stat(filePath)));
	const hash = createHash('sha256');

	for (const [fileIndex, filePath] of inputFiles.entries()) {
		const fileStat = fileStats[fileIndex];
		if (!fileStat) {
			throw new Error(`Missing file metadata for ${filePath}`);
		}

		hash.update(normalizePath(path.relative(PROJECT_ROOT, filePath)));
		hash.update(`:${fileStat.size}:${fileStat.mtimeMs}:${fileStat.ctimeMs}\n`);
	}

	return hash.digest('hex');
}

async function copyDirectory(sourceDirectory: string, destinationDirectory: string): Promise<void> {
	await mkdir(destinationDirectory, { recursive: true });
	const directoryEntries = await readdir(sourceDirectory, { withFileTypes: true });

	await Promise.all(
		directoryEntries.map(async (directoryEntry): Promise<void> => {
			const sourcePath = path.join(sourceDirectory, directoryEntry.name);
			const destinationPath = path.join(destinationDirectory, directoryEntry.name);

			if (directoryEntry.isDirectory()) {
				await copyDirectory(sourcePath, destinationPath);
				return;
			}

			if (directoryEntry.isFile()) {
				await copyFile(sourcePath, destinationPath);
			}
		})
	);
}

async function hasReusablePreviewReports(fingerprint: string): Promise<boolean> {
	const cachedFingerprint = await readFile(PREVIEW_CACHE_FINGERPRINT_PATH, 'utf8').catch(
		() => null
	);
	if (cachedFingerprint?.trim() !== fingerprint) {
		return false;
	}

	return PREVIEW_CACHE_REQUIRED_FILES.every((fileName) =>
		fs.existsSync(path.join(PREVIEW_CACHE_REPORT_DIRECTORY, fileName))
	);
}

async function restoreCachedPreviewReports(reportDirectory: string): Promise<void> {
	await rm(reportDirectory, { force: true, recursive: true });
	await copyDirectory(PREVIEW_CACHE_REPORT_DIRECTORY, reportDirectory);
}

async function cachePreviewReports(reportDirectory: string, fingerprint: string): Promise<void> {
	await rm(PREVIEW_CACHE_DIRECTORY, { force: true, recursive: true });
	await copyDirectory(reportDirectory, PREVIEW_CACHE_REPORT_DIRECTORY);
	await writeFile(PREVIEW_CACHE_FINGERPRINT_PATH, `${fingerprint}\n`, 'utf8');
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
	} catch (error) {
		throw new Error(`Invalid LIGHTHOUSE_PUBLIC_BASE_URL: ${publicBaseUrl}`, {
			cause: error,
		});
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
		const [requiredFlagName] = requiredFlag.split('=');
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

async function runBuild(enableProductionIntegrations: boolean): Promise<void> {
	const buildProcess = spawn('bun', ['run', 'build'], {
		cwd: PROJECT_ROOT,
		env: {
			...process.env,
			PUBLIC_ENABLE_GTM: String(enableProductionIntegrations),
			PUBLIC_ENABLE_WEBSOCKET: String(enableProductionIntegrations),
		},
		stdio: 'inherit',
	});

	await new Promise<void>((resolve, reject) => {
		buildProcess.once('error', reject);
		buildProcess.once('exit', (exitCode, signal) => {
			if (signal) {
				reject(new Error(`bun run build exited from signal ${signal}`));
				return;
			}

			if (exitCode !== 0) {
				reject(new Error(`bun run build exited with code ${exitCode ?? 'unknown'}`));
				return;
			}

			resolve();
		});
	});
}

function isNestedDirectory(directory: string, parentDirectory: string): boolean {
	const relativePath = path.relative(parentDirectory, directory);
	return (
		relativePath.length > 0 && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
	);
}

async function preparePublishableStaticSite(
	reportDirectory: string,
	staticDirectory: string
): Promise<void> {
	if (!isNestedDirectory(reportDirectory, staticDirectory)) {
		return;
	}

	const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'hotaisle-lighthouse-'));
	const savedReportDirectory = path.join(temporaryDirectory, 'lighthouse');
	let reportsAreStoredTemporarily = false;

	const restoreReports = async (): Promise<void> => {
		await rm(reportDirectory, { force: true, recursive: true });
		await mkdir(path.dirname(reportDirectory), { recursive: true });
		await rename(savedReportDirectory, reportDirectory);
		reportsAreStoredTemporarily = false;
	};

	try {
		await rename(reportDirectory, savedReportDirectory);
		reportsAreStoredTemporarily = true;
		console.log('Rebuilding the publishable static site with production integrations...');
		await runBuild(true);
		await restoreReports();
	} finally {
		if (reportsAreStoredTemporarily && fs.existsSync(savedReportDirectory)) {
			await restoreReports();
		}

		await rm(temporaryDirectory, { force: true, recursive: true });
	}
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
	const reportIndexUrl = new URL(LIGHTHOUSE_REPORT_INDEX_PATH, publicBaseUrl).toString();
	const serializedReportIndexUrl = JSON.stringify(reportIndexUrl);
	const replacementCode = `n.textContent=${serializedReportIndexUrl},n.title=${serializedReportIndexUrl},this._dom.safelySetHref(n,${serializedReportIndexUrl}),n.setAttribute("target","_self"),n.removeAttribute("rel"),t}`;

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
	const { settings } = collectConfig;
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
	const shouldReuseUnchangedReports =
		process.env.LIGHTHOUSE_IF_CHANGED === REUSE_LIGHTHOUSE_ENVIRONMENT_VALUE;

	if (shouldReuseUnchangedReports) {
		const inputFingerprint = await createLighthouseInputFingerprint();
		if (await hasReusablePreviewReports(inputFingerprint)) {
			console.log('Lighthouse inputs are unchanged; reusing the cached reports.');
			await runBuild(true);
			await restoreCachedPreviewReports(reportDirectory);
			return;
		}
	}

	console.log('Building static site for Lighthouse...');
	await runBuild(false);

	await rm(reportDirectory, { force: true, recursive: true });
	await mkdir(reportDirectory, { recursive: true });

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

		const runQueue = urls.flatMap((url) =>
			Array.from({ length: numberOfRuns }, (_, runAttemptIndex) => ({
				runAttemptIndex,
				url,
			}))
		);
		const runResults = await runLighthouseQueue({
			chromePort: chrome.port,
			collectConfig,
			publicBaseUrl,
			queue: runQueue,
			reportDirectory,
		});

		await writeManifest(reportDirectory, runResults);
		await writeReportIndex(reportDirectory);

		console.log(
			`Lighthouse reports written to ${normalizePath(path.relative(PROJECT_ROOT, reportDirectory))}`
		);
	} finally {
		chrome?.kill();
		await server.stop(true);
	}

	await preparePublishableStaticSite(reportDirectory, staticDirectory);

	if (shouldReuseUnchangedReports) {
		const inputFingerprint = await createLighthouseInputFingerprint();
		await cachePreviewReports(reportDirectory, inputFingerprint);
	}
}

async function runLighthouseQueue({
	chromePort,
	collectConfig,
	publicBaseUrl,
	queue,
	reportDirectory,
	runIndex = 0,
	runResults = [],
}: {
	chromePort: number;
	collectConfig: LighthouseCollectConfig;
	publicBaseUrl: string;
	queue: Array<{ runAttemptIndex: number; url: string }>;
	reportDirectory: string;
	runIndex?: number;
	runResults?: LighthouseRunResult[];
}): Promise<LighthouseRunResult[]> {
	const [nextRun, ...remainingQueue] = queue;
	if (!nextRun) {
		return runResults;
	}

	const numberOfRunsForUrl =
		queue.filter(({ url }) => url === nextRun.url).length +
		runResults.filter(({ url }) => url === nextRun.url).length;
	console.log(
		`Running Lighthouse for ${nextRun.url} (${nextRun.runAttemptIndex + 1}/${numberOfRunsForUrl})`
	);

	const runResult = await runLighthouseAudit(
		nextRun.url,
		runIndex,
		reportDirectory,
		chromePort,
		collectConfig,
		publicBaseUrl
	);

	return await runLighthouseQueue({
		chromePort,
		collectConfig,
		publicBaseUrl,
		queue: remainingQueue,
		reportDirectory,
		runIndex: runIndex + 1,
		runResults: [...runResults, runResult],
	});
}

await main();
