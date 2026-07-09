import { cp, mkdir, readdir, rm, stat, utimes } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const BLOG_ASSET_SOURCE_DIRECTORY = path.join(PROJECT_ROOT, 'content', 'blog', 'assets');
const PUBLIC_BLOG_ASSET_DIRECTORY = path.join(PROJECT_ROOT, 'public', 'assets', 'blog');
const DS_STORE_FILE_NAME = '.DS_Store';
const UNICODE_DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASHES_REGEX = /^-+|-+$/g;

const toSlugSegment = (segment: string): string => {
	const parsed = path.parse(segment);
	const normalizedBaseName = (parsed.name || parsed.base)
		.normalize('NFKD')
		.replace(UNICODE_DIACRITICS_REGEX, '')
		.toLowerCase()
		.replace(NON_ALPHANUMERIC_REGEX, '-')
		.replace(EDGE_DASHES_REGEX, '');
	const safeBaseName = normalizedBaseName || 'file';
	const normalizedExtension = parsed.ext.toLowerCase();

	return normalizedExtension ? `${safeBaseName}${normalizedExtension}` : safeBaseName;
};

const syncDirectory = async (
	sourceDirectory: string,
	destinationDirectory: string
): Promise<void> => {
	await mkdir(destinationDirectory, { recursive: true });
	const directoryEntries = await readdir(sourceDirectory, { withFileTypes: true });

	await Promise.all(
		directoryEntries.map(async (directoryEntry): Promise<void> => {
			if (directoryEntry.name === DS_STORE_FILE_NAME) {
				return;
			}

			const sourcePath = path.join(sourceDirectory, directoryEntry.name);
			const destinationPath = path.join(
				destinationDirectory,
				toSlugSegment(directoryEntry.name)
			);

			if (directoryEntry.isDirectory()) {
				await syncDirectory(sourcePath, destinationPath);
				return;
			}

			if (!directoryEntry.isFile()) {
				return;
			}

			const sourceStats = await stat(sourcePath);
			await cp(sourcePath, destinationPath, { force: true });
			await utimes(destinationPath, sourceStats.atime, sourceStats.mtime);
		})
	);
};

const syncBlogAssets = async (): Promise<void> => {
	await rm(PUBLIC_BLOG_ASSET_DIRECTORY, { force: true, recursive: true });
	await syncDirectory(BLOG_ASSET_SOURCE_DIRECTORY, PUBLIC_BLOG_ASSET_DIRECTORY);
};

await syncBlogAssets();
