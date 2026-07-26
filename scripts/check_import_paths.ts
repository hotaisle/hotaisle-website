import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const SOURCE_ROOT = path.join(PROJECT_ROOT, 'src');
const IMPORT_PATTERNS = [
	/\b(?:import|export)\b[\s\S]*?\bfrom\s*['"]([^'"]+)['"]/g,
	/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
] as const;
const PATH_SEPARATOR_REGEX = /\\/g;

interface ImportIssue {
	filePath: string;
	lineNumber: number;
	specifier: string;
	suggestedSpecifier: string;
}

function normalizePath(filePath: string): string {
	return filePath.replace(PATH_SEPARATOR_REGEX, '/');
}

function resolveAliasSpecifier(filePath: string, specifier: string): string | null {
	if (!specifier.startsWith('.')) {
		return null;
	}

	const resolvedPath = path.resolve(path.dirname(filePath), specifier);
	const relativeToSource = path.relative(SOURCE_ROOT, resolvedPath);

	if (
		relativeToSource.startsWith('..') ||
		path.isAbsolute(relativeToSource) ||
		relativeToSource === ''
	) {
		return null;
	}

	return `@/${normalizePath(relativeToSource)}`;
}

function getLineNumber(fileContents: string, matchIndex: number): number {
	return fileContents.slice(0, matchIndex).split('\n').length;
}

function collectImportIssues(filePath: string, fileContents: string): ImportIssue[] {
	const issues: ImportIssue[] = [];

	for (const importPattern of IMPORT_PATTERNS) {
		for (const match of fileContents.matchAll(importPattern)) {
			const [, specifier] = match;
			const matchIndex = match.index ?? 0;
			const suggestedSpecifier = resolveAliasSpecifier(filePath, specifier);

			if (!suggestedSpecifier) {
				continue;
			}

			issues.push({
				filePath,
				lineNumber: getLineNumber(fileContents, matchIndex),
				specifier,
				suggestedSpecifier,
			});
		}
	}

	return issues;
}

function shouldIncludeFile(filePath: string): boolean {
	const normalizedPath = normalizePath(path.relative(PROJECT_ROOT, filePath));

	if (normalizedPath === 'astro.config.ts') {
		return true;
	}
	if (normalizedPath.startsWith('scripts/') && normalizedPath.endsWith('.ts')) {
		return true;
	}
	if (normalizedPath.startsWith('src/')) {
		return (
			normalizedPath.endsWith('.astro') ||
			normalizedPath.endsWith('.ts') ||
			normalizedPath.endsWith('.tsx')
		);
	}

	return false;
}

async function walkDirectory(directoryPath: string): Promise<string[]> {
	const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
	const nestedFilePathGroups = await Promise.all(
		directoryEntries.map(async (directoryEntry): Promise<string[]> => {
			const entryPath = path.join(directoryPath, directoryEntry.name);

			if (directoryEntry.isDirectory()) {
				return await walkDirectory(entryPath);
			}

			if (directoryEntry.isFile() && shouldIncludeFile(entryPath)) {
				return [entryPath];
			}

			return [];
		})
	);

	return nestedFilePathGroups.flat();
}

async function getCandidateFiles(): Promise<string[]> {
	const [sourceFiles, scriptFiles] = await Promise.all([
		walkDirectory(path.join(PROJECT_ROOT, 'src')),
		walkDirectory(path.join(PROJECT_ROOT, 'scripts')),
	]);
	const filePaths = new Set([
		...sourceFiles,
		...scriptFiles,
		path.join(PROJECT_ROOT, 'astro.config.ts'),
	]);

	return [...filePaths].sort();
}

async function main(): Promise<void> {
	const filePaths = await getCandidateFiles();
	const issueGroups = await Promise.all(
		filePaths.map(async (filePath): Promise<ImportIssue[]> => {
			const fileContents = await readFile(filePath, 'utf8');
			return collectImportIssues(filePath, fileContents);
		})
	);
	const issues = issueGroups.flat();

	if (issues.length === 0) {
		console.log('Checked import paths. No alias-shortenable imports found.');
		return;
	}

	console.error('Found imports that should use the @/ alias:');
	for (const issue of issues) {
		const normalizedFilePath = normalizePath(path.relative(PROJECT_ROOT, issue.filePath));
		console.error(
			`  ${normalizedFilePath}:${issue.lineNumber} "${issue.specifier}" -> "${issue.suggestedSpecifier}"`
		);
	}

	process.exitCode = 1;
}

await main();
