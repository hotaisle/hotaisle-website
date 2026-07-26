import fs from 'node:fs';
import { readdir, stat, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const BLOG_ASSET_SOURCE_DIRECTORY = path.join(PROJECT_ROOT, 'src', 'content', 'blog', 'assets');
const PUBLIC_DIRECTORY = path.join(import.meta.dirname, '..', 'public');
const PUBLIC_BLOG_ASSET_DIRECTORY = path.join(PUBLIC_DIRECTORY, 'assets', 'blog');
const IMAGE_SOURCE_DIRECTORIES = [BLOG_ASSET_SOURCE_DIRECTORY, PUBLIC_DIRECTORY] as const;
const RESPONSIVE_IMAGE_WIDTHS = [480, 672, 800] as const;
const RESPONSIVE_IMAGE_SOURCE_PATHS = new Set([
	'assets/home/automated-inference-platform-dark.png',
	'assets/home/automated-inference-platform.png',
	'assets/mi300x/mi300x-amd-press.jpg',
	'assets/mi300x/mi300x-amd-product.jpg',
	'assets/quickstart/terminal-provisioning-pixel-art-light.png',
	'assets/quickstart/terminal-provisioning-pixel-art.png',
]);
const SOURCE_IMAGE_REGEX = /\.(png|jpe?g)$/i;
const WEBP_EXTENSION_REGEX = /\.(png|jpe?g)$/i;
const AVIF_EXTENSION_REGEX = /\.(png|jpe?g)$/i;
const IMAGE_VARIANT_CONCURRENCY = Math.max(1, availableParallelism() - 1);
const FORCE_IMAGE_VARIANT_GENERATION_VALUE = 'true';
const CI_ENVIRONMENT_VALUE = 'true';

async function collectRasterAssets(directory: string): Promise<string[]> {
	if (directory === PUBLIC_BLOG_ASSET_DIRECTORY) {
		return [];
	}

	const directoryEntries = await readdir(directory, { withFileTypes: true });
	const assetPathGroups = await Promise.all(
		directoryEntries.map(async (directoryEntry): Promise<string[]> => {
			const entryPath = path.join(directory, directoryEntry.name);

			if (directoryEntry.isDirectory()) {
				return await collectRasterAssets(entryPath);
			}

			if (directoryEntry.isFile() && SOURCE_IMAGE_REGEX.test(directoryEntry.name)) {
				return [entryPath];
			}

			return [];
		})
	);

	return assetPathGroups.flat();
}

async function writeVariantIfFresh(
	sourcePath: string,
	outputPath: string,
	bufferFactory: () => Promise<Buffer<ArrayBufferLike>>
): Promise<void> {
	const [sourceStats, outputStats] = await Promise.all([
		stat(sourcePath),
		stat(outputPath).catch(() => null),
	]);

	if (outputStats && outputStats.mtimeMs >= sourceStats.mtimeMs) {
		return;
	}

	const outputBuffer = await bufferFactory();
	await writeFile(outputPath, outputBuffer);
}

async function createWebpBuffer(
	sourcePath: string,
	width?: number
): Promise<Buffer<ArrayBufferLike>> {
	const image = sharp(sourcePath).resize(
		width
			? {
					width,
					withoutEnlargement: true,
				}
			: undefined
	);

	if (sourcePath.toLowerCase().endsWith('.png')) {
		const [losslessBuffer, visuallyLosslessBuffer] = await Promise.all([
			image.clone().webp({ effort: 6, lossless: true }).toBuffer(),
			image.clone().webp({ effort: 6, nearLossless: true, quality: 88 }).toBuffer(),
		]);

		return visuallyLosslessBuffer.byteLength < losslessBuffer.byteLength
			? visuallyLosslessBuffer
			: losslessBuffer;
	}

	return await image.webp({ effort: 6, quality: 82 }).toBuffer();
}

async function createAvifBuffer(
	sourcePath: string,
	width?: number
): Promise<Buffer<ArrayBufferLike>> {
	return await sharp(sourcePath)
		.resize(
			width
				? {
						width,
						withoutEnlargement: true,
					}
				: undefined
		)
		.avif({ effort: 8, quality: 55 })
		.toBuffer();
}

async function collectImageVariantTargets(): Promise<string[]> {
	const rasterAssetGroups = await Promise.all(
		IMAGE_SOURCE_DIRECTORIES.map(async (directory): Promise<string[]> => {
			if (!fs.existsSync(directory)) {
				return [];
			}

			return await collectRasterAssets(directory);
		})
	);

	return rasterAssetGroups.flat();
}

function shouldSkipImageVariantGeneration(): boolean {
	if (process.env.FORCE_IMAGE_VARIANTS === FORCE_IMAGE_VARIANT_GENERATION_VALUE) {
		return false;
	}

	return process.env.CI === CI_ENVIRONMENT_VALUE;
}

async function generateResponsiveVariants(sourcePath: string): Promise<void> {
	const relativeSourcePath = path
		.relative(PUBLIC_DIRECTORY, sourcePath)
		.split(path.sep)
		.join('/');
	if (!RESPONSIVE_IMAGE_SOURCE_PATHS.has(relativeSourcePath)) {
		return;
	}

	await Promise.all(
		RESPONSIVE_IMAGE_WIDTHS.map(async (width) => {
			const webpPath = sourcePath.replace(WEBP_EXTENSION_REGEX, `-${width}w.webp`);
			const avifPath = sourcePath.replace(AVIF_EXTENSION_REGEX, `-${width}w.avif`);

			await Promise.all([
				writeVariantIfFresh(
					sourcePath,
					webpPath,
					async () => await createWebpBuffer(sourcePath, width)
				),
				writeVariantIfFresh(
					sourcePath,
					avifPath,
					async () => await createAvifBuffer(sourcePath, width)
				),
			]);
		})
	);
}

async function generateImageVariants(): Promise<void> {
	if (shouldSkipImageVariantGeneration()) {
		console.log('Skipping image variant generation in CI.');
		return;
	}

	const rasterAssets = await collectImageVariantTargets();
	let nextAssetIndex = 0;

	async function processNextAsset(): Promise<void> {
		const sourcePath = rasterAssets[nextAssetIndex];
		nextAssetIndex += 1;

		if (!sourcePath) {
			return;
		}

		const webpPath = sourcePath.replace(WEBP_EXTENSION_REGEX, '.webp');
		await writeVariantIfFresh(
			sourcePath,
			webpPath,
			async () => await createWebpBuffer(sourcePath)
		);

		if (AVIF_EXTENSION_REGEX.test(sourcePath)) {
			const avifPath = sourcePath.replace(AVIF_EXTENSION_REGEX, '.avif');
			await writeVariantIfFresh(
				sourcePath,
				avifPath,
				async () => await createAvifBuffer(sourcePath)
			);
		}

		await generateResponsiveVariants(sourcePath);
		await processNextAsset();
	}

	await Promise.all(
		Array.from(
			{ length: Math.min(IMAGE_VARIANT_CONCURRENCY, rasterAssets.length) },
			async () => await processNextAsset()
		)
	);
}

await generateImageVariants();
