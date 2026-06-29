import { spawn } from 'node:child_process';
import { mkdir, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const GENERATED_DIAGRAM_FILE_PREFIX = 'mermaid-diagram-';
const GENERATED_DIAGRAM_FILE_EXTENSION = '.svg';
const CI_ENVIRONMENT_VALUE = 'true';
const FORCE_MERMAID_DIAGRAM_GENERATION_VALUE = 'true';
const BLOG_ASSET_PREFIX = '/assets/blog/';
const CLI_BUNX_HOME_DIRECTORY = path.join(os.tmpdir(), 'hotaisle-bunx-home');
const PUPPETEER_EXECUTABLE_PATH_ENV = 'PUPPETEER_EXECUTABLE_PATH';
const LOCAL_CHROME_EXECUTABLE_CANDIDATES = [
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/Applications/Chromium.app/Contents/MacOS/Chromium',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
] as const;
const MERMAID_THEMES = [
	{ appearance: 'light', cliTheme: 'default' },
	{ appearance: 'dark', cliTheme: 'dark' },
] as const;

type MermaidDiagramAppearance = (typeof MERMAID_THEMES)[number]['appearance'];

interface CliCommandResult {
	exitCode: number;
	stderr: string;
	stdout: string;
}

const PUPPETEER_CACHE_MISS_SNIPPETS = [
	'could not find chrome',
	'failed to set up chrome',
	'browser folder',
	'the executable',
	'is missing',
] as const;

function toDiagramBaseName(index: number): string {
	return `${GENERATED_DIAGRAM_FILE_PREFIX}${index}`;
}

function toDiagramFileName(index: number, appearance: MermaidDiagramAppearance): string {
	return `${toDiagramBaseName(index)}-${appearance}${GENERATED_DIAGRAM_FILE_EXTENSION}`;
}

export function isGeneratedMermaidDiagramFile(fileName: string): boolean {
	return (
		fileName.startsWith(GENERATED_DIAGRAM_FILE_PREFIX) &&
		fileName.endsWith(GENERATED_DIAGRAM_FILE_EXTENSION)
	);
}

export function shouldSkipMermaidDiagramGeneration(): boolean {
	if (process.env.FORCE_MERMAID_DIAGRAM_GENERATION === FORCE_MERMAID_DIAGRAM_GENERATION_VALUE) {
		return false;
	}

	return process.env.CI === CI_ENVIRONMENT_VALUE;
}

async function runMermaidCliToFile(
	diagramDefinition: string,
	outputPath: string,
	theme: string
): Promise<CliCommandResult> {
	const bunInstallDirectory = path.join(CLI_BUNX_HOME_DIRECTORY, 'bun-install');
	const bunCacheDirectory = path.join(CLI_BUNX_HOME_DIRECTORY, '.cache');
	const puppeteerExecutablePath = await resolvePuppeteerExecutablePath();
	await mkdir(bunInstallDirectory, { recursive: true });
	await mkdir(bunCacheDirectory, { recursive: true });

	return await new Promise((resolve, reject) => {
		const commandEnv: Record<string, string | undefined> = {
			...process.env,
			BUN_INSTALL: bunInstallDirectory,
			HOME: CLI_BUNX_HOME_DIRECTORY,
			TMPDIR: os.tmpdir(),
			XDG_CACHE_HOME: bunCacheDirectory,
		};
		if (puppeteerExecutablePath) {
			commandEnv[PUPPETEER_EXECUTABLE_PATH_ENV] = puppeteerExecutablePath;
		}

		const command = spawn(
			'bunx',
			[
				'@mermaid-js/mermaid-cli',
				'--input',
				'-',
				'--output',
				outputPath,
				'--theme',
				theme,
				'--backgroundColor',
				'transparent',
				'--quiet',
				'--outputFormat',
				'svg',
			],
			{
				env: commandEnv,
				stdio: ['pipe', 'pipe', 'pipe'],
			}
		);

		let stdout = '';
		let stderr = '';

		command.stdout.on('data', (chunk: Buffer | string) => {
			stdout += chunk.toString();
		});
		command.stderr.on('data', (chunk: Buffer | string) => {
			stderr += chunk.toString();
		});
		command.on('error', reject);
		command.stdin.end(diagramDefinition);
		command.on('close', (exitCode) => {
			resolve({
				exitCode: exitCode ?? 1,
				stderr,
				stdout,
			});
		});
	});
}

async function resolvePuppeteerExecutablePath(): Promise<string | undefined> {
	const configuredExecutablePath = process.env[PUPPETEER_EXECUTABLE_PATH_ENV];
	if (configuredExecutablePath) {
		return configuredExecutablePath;
	}

	for (const executablePath of LOCAL_CHROME_EXECUTABLE_CANDIDATES) {
		try {
			const executableStats = await stat(executablePath);
			if (executableStats.isFile()) {
				return executablePath;
			}
		} catch {
			continue;
		}
	}

	return undefined;
}

function shouldResetMermaidCliCache(cliResult: CliCommandResult): boolean {
	const commandOutput = `${cliResult.stdout}\n${cliResult.stderr}`.toLowerCase();

	return PUPPETEER_CACHE_MISS_SNIPPETS.every((snippet) => commandOutput.includes(snippet));
}

async function runMermaidCliToFileWithRecovery(
	diagramDefinition: string,
	outputPath: string,
	theme: string
): Promise<CliCommandResult> {
	const initialResult = await runMermaidCliToFile(diagramDefinition, outputPath, theme);
	if (!(initialResult.exitCode !== 0 && shouldResetMermaidCliCache(initialResult))) {
		return initialResult;
	}

	await rm(CLI_BUNX_HOME_DIRECTORY, { force: true, recursive: true });

	return await runMermaidCliToFile(diagramDefinition, outputPath, theme);
}

async function renderMermaidDiagramFiles(
	diagramDefinition: string,
	assetDirectory: string,
	diagramIndex: number,
	sourceModifiedAtMs: number
): Promise<string[]> {
	const generatedFileNames = MERMAID_THEMES.map(({ appearance }) =>
		toDiagramFileName(diagramIndex, appearance)
	);

	if (shouldSkipMermaidDiagramGeneration()) {
		return generatedFileNames;
	}

	await mkdir(assetDirectory, { recursive: true });

	const outputPaths = generatedFileNames.map((fileName) => path.join(assetDirectory, fileName));
	const outputStats = await Promise.all(
		outputPaths.map(async (outputPath) => await stat(outputPath).catch(() => null))
	);
	const areGeneratedFilesFresh = outputStats.every(
		(outputStat) => outputStat && outputStat.mtimeMs >= sourceModifiedAtMs
	);

	if (areGeneratedFilesFresh) {
		return generatedFileNames;
	}

	for (const { appearance, cliTheme } of MERMAID_THEMES) {
		const fileName = toDiagramFileName(diagramIndex, appearance);
		const outputPath = path.join(assetDirectory, fileName);
		const cliResult = await runMermaidCliToFileWithRecovery(
			diagramDefinition,
			outputPath,
			cliTheme
		);

		if (cliResult.exitCode === 0) {
			continue;
		}

		const commandOutput = [cliResult.stdout.trim(), cliResult.stderr.trim()]
			.filter(Boolean)
			.join('\n');
		throw new Error(
			`Mermaid CLI failed for ${outputPath}.${commandOutput ? `\n${commandOutput}` : ''}`
		);
	}

	return generatedFileNames;
}

export async function renderMermaidMarkdownToImageMarkdown(
	markdown: string,
	slug: string,
	assetDirectory: string,
	sourceModifiedAtMs: number
): Promise<{
	generatedFiles: string[];
	markdown: string;
}> {
	const mermaidFenceRegex = /```mermaid[^\n]*\n([\s\S]*?)```/g;
	const generatedFiles: string[] = [];
	let diagramIndex = 0;
	let rewrittenMarkdown = '';
	let lastMatchIndex = 0;

	for (const match of markdown.matchAll(mermaidFenceRegex)) {
		const fullMatch = match[0];
		const diagramBody = match[1] ?? '';
		const matchIndex = match.index ?? 0;

		rewrittenMarkdown += markdown.slice(lastMatchIndex, matchIndex);
		diagramIndex += 1;

		const diagramFileNames = await renderMermaidDiagramFiles(
			diagramBody.trim(),
			assetDirectory,
			diagramIndex,
			sourceModifiedAtMs
		);
		const lightFileName =
			diagramFileNames.find((fileName) => fileName.endsWith('-light.svg')) ??
			toDiagramFileName(diagramIndex, 'light');

		generatedFiles.push(...diagramFileNames);
		rewrittenMarkdown += `![Mermaid diagram](${BLOG_ASSET_PREFIX}${slug}/${lightFileName} "mermaid-diagram")`;
		lastMatchIndex = matchIndex + fullMatch.length;
	}

	rewrittenMarkdown += markdown.slice(lastMatchIndex);

	return {
		markdown: rewrittenMarkdown,
		generatedFiles,
	};
}
