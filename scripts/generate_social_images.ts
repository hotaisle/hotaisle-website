import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { launch } from 'chrome-launcher';
import { connect } from 'puppeteer-core';
import sharp from 'sharp';
import {
	getSocialImage,
	SOCIAL_CARDS,
	SOCIAL_IMAGE_HEIGHT,
	SOCIAL_IMAGE_WIDTH,
} from '@/lib/social-images.ts';

const PROJECT_ROOT = path.join(import.meta.dirname, '..');
const PUBLIC_DIRECTORY = path.join(PROJECT_ROOT, 'public');
const OUTPUT_DIRECTORY = path.join(PUBLIC_DIRECTORY, 'assets', 'og');
const ROOT_TOKENS_REGEX = /:root\s*\{(?<tokens>[\s\S]*?)\}/u;
const HTML_ESCAPE_REGEX = /[&<>"']/gu;
const HTML_ENTITIES: Readonly<Record<string, string>> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};
const FONTS = [
	['Space Grotesk', 'space-grotesk-latin.woff2'],
	['Inter', 'inter-latin.woff2'],
	['JetBrains Mono', 'jetbrains-mono-latin.woff2'],
] as const;

function escapeHtml(text: string): string {
	return text.replace(HTML_ESCAPE_REGEX, (character) => HTML_ENTITIES[character] ?? character);
}

async function renderSocialImages(): Promise<void> {
	const globalCss = await readFile(path.join(PROJECT_ROOT, 'src/styles/global.css'), 'utf8');
	const tokens = ROOT_TOKENS_REGEX.exec(globalCss)?.groups?.tokens;
	if (!tokens) {
		throw new Error('Cannot find the website color tokens for social images.');
	}
	const fontFaces = await Promise.all(
		FONTS.map(async ([family, filename]) => {
			const font = await readFile(path.join(PUBLIC_DIRECTORY, 'assets/fonts', filename));
			return `@font-face {
				font-family: '${family}'; font-style: normal; font-weight: 400 900;
				src: url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');
			}`;
		})
	);
	const logo = await readFile(path.join(PUBLIC_DIRECTORY, 'hotaisle-logo.svg'));
	await mkdir(OUTPUT_DIRECTORY, { recursive: true });
	const chrome = await launch({ chromeFlags: ['--headless=new'], logLevel: 'silent' });
	try {
		const browser = await connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
		try {
			const page = await browser.newPage();
			await page.setViewport({
				width: SOCIAL_IMAGE_WIDTH,
				height: SOCIAL_IMAGE_HEIGHT,
				deviceScaleFactor: 1,
			});
			for (const [route, card] of Object.entries(SOCIAL_CARDS)) {
				// biome-ignore lint/performance/noAwaitInLoops: Cards share one browser page and must render sequentially.
				await page.setContent(`<!doctype html>
					<html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(card.lines.join(' '))}</title>
					<style>
						${fontFaces.join('\n')}
						:root { ${tokens} }
						* { box-sizing: border-box; }
						body { margin: 0; width: 1200px; height: 630px; padding: 48px 64px;
							background: var(--background); color: var(--foreground); }
						main { height: 100%; display: flex; flex-direction: column; }
						header { height: 112px; }
						img { width: 234px; height: 72px; display: block; }
						h1 { margin: 30px 0 24px; font: 600 80px/1.06 'Space Grotesk', sans-serif;
							letter-spacing: -2.4px; }
						h1 span { display: block; white-space: nowrap; width: fit-content; }
						p { margin: 0; max-width: 1000px; font: 400 29px/1.5 'Inter', sans-serif;
							color: var(--muted-foreground); }
						footer { margin-top: auto; display: flex; justify-content: space-between;
							align-items: baseline; font: 400 20px/1.5 'JetBrains Mono', monospace; }
						.address { color: var(--hot-orange-contrast); }
						.category { color: var(--muted-foreground); font-size: 16px; }
					</style></head><body><main>
						<header><img alt="Hot Aisle" src="data:image/svg+xml;base64,${logo.toString('base64')}" width="234" height="72"></header>
						<h1>${card.lines.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</h1>
						<p>${escapeHtml(card.description)}</p>
						<footer><span class="address">hotaisle.xyz</span><span class="category">AMD GPU COMPUTE</span></footer>
					</main></body></html>`);
				await page.evaluate(async () => {
					await Promise.all([
						document.fonts.load('600 80px "Space Grotesk"'),
						document.fonts.load('400 29px Inter'),
						document.fonts.load('400 20px "JetBrains Mono"'),
						...Array.from(document.images, async (image) => await image.decode()),
					]);
				});
				const fits = await page.evaluate(() => {
					const footer = document.querySelector('footer');
					const description = document.querySelector('p');
					return (
						Array.from(document.querySelectorAll('h1 span')).every(
							(line) => line.getBoundingClientRect().right <= 1136
						) &&
						footer !== null &&
						description !== null &&
						description.getBoundingClientRect().bottom + 32 <=
							footer.getBoundingClientRect().top
					);
				});
				if (!fits) {
					throw new Error(`Social image text overflows its safe area: ${route}`);
				}
				const outputPath = path.join(PUBLIC_DIRECTORY, getSocialImage(route).url);
				const screenshot = await page.screenshot({ type: 'png' });
				await sharp(screenshot).png({ compressionLevel: 9 }).toFile(outputPath);
				console.log(`Generated ${path.relative(PROJECT_ROOT, outputPath)}`);
			}
		} finally {
			await browser.disconnect();
		}
	} finally {
		await chrome.kill();
	}
}

await renderSocialImages();
