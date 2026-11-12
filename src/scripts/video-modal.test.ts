import { describe, expect, spyOn, test } from 'bun:test';
import { Window } from 'happy-dom';
import { initializeVideoModalScript } from '@/scripts/video-modal.ts';

const MARKUP = `<button type="button" data-video-modal="/assets/demo.mp4"
	data-video-title="Console walkthrough" data-video-poster="/assets/poster.webp"
	data-video-captions="/assets/demo.en.vtt" data-video-transcript="/assets/transcript.txt">
	<img src="/assets/light.webp" alt="Console dashboard"><span>Play</span>
</button>`;

const createFixture = (markup = MARKUP) => {
	const window = new Window({ url: 'https://hotaisle.ai/quick-start' });
	const { document } = window;
	document.body.innerHTML = markup;
	const play = spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
	const pause = spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(
		() => undefined
	);
	const load = spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(
		() => undefined
	);
	const cleanup = initializeVideoModalScript(document as unknown as Document);
	const destroy = async () => {
		cleanup();
		play.mockRestore();
		pause.mockRestore();
		load.mockRestore();
		await window.happyDOM.close();
	};
	return { cleanup, destroy, document, load, pause, play, window };
};

describe('video preview dialog', () => {
	test('loads media only after activation and opens a named native player with captions', async () => {
		const fixture = createFixture();
		try {
			expect(fixture.document.querySelector('video')).toBeNull();
			fixture.document
				.querySelector('button img')
				?.dispatchEvent(new fixture.window.MouseEvent('click', { bubbles: true }));
			const dialog = fixture.document.querySelector('dialog');
			const video = dialog?.querySelector('video');
			if (!video) {
				throw new Error('Missing video player');
			}
			expect(dialog?.open).toBe(true);
			expect(dialog?.getAttribute('closedby')).toBe('any');
			expect(dialog?.querySelector('h2')?.textContent).toBe('Console walkthrough');
			expect(dialog?.getAttribute('aria-labelledby')).toBe(dialog?.querySelector('h2')?.id);
			expect(dialog?.querySelector('form')?.method).toBe('dialog');
			expect(dialog?.querySelector('button')?.hasAttribute('autofocus')).toBe(true);
			expect(video.controls).toBe(true);
			expect(video.hasAttribute('playsinline')).toBe(true);
			expect(video.getAttribute('width')).toBe('1920');
			expect(video.getAttribute('height')).toBe('1080');
			expect(video.getAttribute('src')).toBe('/assets/demo.mp4');
			expect(video.getAttribute('poster')).toBe('/assets/poster.webp');
			expect(video.querySelector('track')?.getAttribute('src')).toBe('/assets/demo.en.vtt');
			expect(video.querySelector('track')?.kind).toBe('captions');
			expect(dialog?.querySelector('a')?.getAttribute('href')).toBe('/assets/transcript.txt');
			expect(fixture.play).toHaveBeenCalledTimes(1);
		} finally {
			await fixture.destroy();
		}
	});

	test('stops and unloads closed players and starts a fresh playback on reopening', async () => {
		const fixture = createFixture();
		try {
			const trigger = fixture.document.querySelector('button');
			trigger?.click();
			fixture.document.querySelector('dialog')?.close();
			expect(fixture.pause).toHaveBeenCalled();
			expect(fixture.load).toHaveBeenCalled();
			expect(fixture.document.querySelector('video')?.hasAttribute('src')).toBe(false);
			expect(fixture.document.querySelector('track')?.hasAttribute('src')).toBe(false);
			trigger?.click();
			expect(fixture.document.querySelectorAll('video').length).toBe(1);
			expect(fixture.play).toHaveBeenCalledTimes(2);
		} finally {
			await fixture.destroy();
		}
	});

	test('stops playback on pagehide while keeping the trigger usable after returning', async () => {
		const fixture = createFixture();
		try {
			fixture.document.querySelector('button')?.click();
			fixture.window.dispatchEvent(new fixture.window.Event('pagehide'));
			expect(fixture.document.querySelector('video')?.hasAttribute('src')).toBe(false);
			fixture.document.querySelector('button')?.click();
			expect(fixture.document.querySelector('dialog')?.open).toBe(true);
			expect(fixture.play).toHaveBeenCalledTimes(2);
		} finally {
			await fixture.destroy();
		}
	});

	test.each([
		'https://unrelated.example/assets/demo.mp4',
		'javascript:alert(1)',
		'/api/private',
		'/assets/../api/private',
	])('rejects the invalid or non-asset source %s', async (src) => {
		const fixture = createFixture();
		try {
			const trigger = fixture.document.querySelector('button');
			trigger?.setAttribute('data-video-modal', src);
			trigger?.click();
			expect(fixture.document.querySelector('dialog')).toBeNull();
			expect(fixture.play).not.toHaveBeenCalled();
		} finally {
			await fixture.destroy();
		}
	});

	test('keeps native controls available when automatic playback is blocked', async () => {
		const fixture = createFixture();
		try {
			fixture.play.mockRejectedValue(new Error('NotAllowedError'));
			fixture.document.querySelector('button')?.click();
			await fixture.window.happyDOM.waitUntilComplete();
			expect(fixture.document.querySelector('dialog')?.open).toBe(true);
			expect(fixture.document.querySelector('video')?.controls).toBe(true);
			expect(fixture.document.querySelector('[role="alert"]')?.textContent).toBe(
				'Press play to start the video.'
			);
		} finally {
			await fixture.destroy();
		}
	});

	test('provides a visible error and direct video link when loading fails', async () => {
		const fixture = createFixture();
		try {
			fixture.document.querySelector('button')?.click();
			fixture.document
				.querySelector('video')
				?.dispatchEvent(new fixture.window.Event('error'));
			expect(fixture.document.querySelector('[role="alert"]')?.textContent).toContain(
				'could not be loaded'
			);
			expect(fixture.document.querySelector('[role="alert"]')?.hasAttribute('hidden')).toBe(
				false
			);
			expect(fixture.document.querySelector('a[target="_blank"]')?.getAttribute('href')).toBe(
				'/assets/demo.mp4'
			);
		} finally {
			await fixture.destroy();
		}
	});

	test('cleans up the dialog and activation listener', async () => {
		const fixture = createFixture();
		try {
			fixture.document.querySelector('button')?.click();
			fixture.cleanup();
			fixture.document.querySelector('button')?.click();
			expect(fixture.document.querySelector('dialog')).toBeNull();
		} finally {
			await fixture.destroy();
		}
	});
});
