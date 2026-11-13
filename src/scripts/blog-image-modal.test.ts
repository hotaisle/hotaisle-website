import { describe, expect, spyOn, test } from 'bun:test';
import { Window } from 'happy-dom';
import { initializeBlogImageModalScript } from '@/scripts/blog-image-modal.ts';

const SCREENSHOT_MARKUP = `
	<button type="button" data-image-modal="true"
		data-image-modal-src="/original.jpg" data-image-modal-width="1966"
		data-image-modal-height="1472">
		<picture><img alt="Console dashboard" src="/thumbnail.webp" width="800" height="599"></picture>
	</button>`;

const createFixture = (markup = SCREENSHOT_MARKUP) => {
	const window = new Window();
	const { document } = window;
	document.body.innerHTML = markup;
	const cleanup = initializeBlogImageModalScript(document as unknown as Document);
	const destroy = async (): Promise<void> => {
		cleanup();
		await window.happyDOM.close();
	};
	return { cleanup, destroy, document, window };
};

describe('image preview dialog', () => {
	test('opens the original screenshot in a named native modal', async () => {
		const fixture = createFixture();
		try {
			fixture.document.querySelector('img')?.click();
			const dialog = fixture.document.querySelector('dialog');
			expect(dialog?.open).toBe(true);
			expect(dialog?.getAttribute('aria-label')).toBe('Console dashboard');
			expect(dialog?.getAttribute('closedby')).toBe('any');
			expect(dialog?.querySelector('img')?.getAttribute('src')).toBe('/original.jpg');
			expect(dialog?.querySelector('img')?.width).toBe(1966);
			expect(dialog?.querySelector('img')?.height).toBe(1472);
			expect(dialog?.querySelector('form')?.method).toBe('dialog');
			expect(dialog?.querySelector('button')?.hasAttribute('autofocus')).toBe(true);
			expect(fixture.document.body.style.overflow).toBe('');
		} finally {
			await fixture.destroy();
		}
	});

	test.each([
		{
			markup: '<img class="blog-inline-image" src="/blog.jpg" alt="Blog image">',
			name: 'blog image before currentSrc is populated',
			source: '/blog.jpg',
		},
		{
			markup: '<img data-image-modal="true" src="/compute.jpg" alt="Compute image" role="button" tabindex="0">',
			name: 'existing clickable image',
			source: '/compute.jpg',
		},
		{
			markup: '<a data-image-modal="true" data-image-modal-src="/full.svg" data-image-modal-alt="Diagram" href="/full.svg">View diagram</a>',
			name: 'diagram link',
			source: '/full.svg',
		},
	])('preserves $name support', async ({ markup, source }) => {
		const fixture = createFixture(markup);
		try {
			fixture.document.body.firstElementChild?.dispatchEvent(
				new fixture.window.MouseEvent('click', { bubbles: true, cancelable: true })
			);
			expect(fixture.document.querySelector('dialog')?.open).toBe(true);
			expect(fixture.document.querySelector('dialog img')?.getAttribute('src')).toBe(source);
		} finally {
			await fixture.destroy();
		}
	});

	test.each(['Enter', ' '])('opens image controls with the %p key', async (key) => {
		const fixture = createFixture(
			'<img data-image-modal="true" src="/image.jpg" alt="Image" role="button" tabindex="0">'
		);
		try {
			fixture.document
				.querySelector('img')
				?.dispatchEvent(
					new fixture.window.KeyboardEvent('keydown', { bubbles: true, key })
				);
			expect(fixture.document.querySelector('dialog')?.open).toBe(true);
		} finally {
			await fixture.destroy();
		}
	});

	test.each([
		{ end: 40, name: 'dialog padding', start: 40, staysOpen: true },
		{ end: 0, name: 'a drag from the image onto the backdrop', start: 40, staysOpen: true },
		{ end: 40, name: 'a drag from the backdrop onto the image', start: 0, staysOpen: true },
		{ end: 0, name: 'a backdrop press and release', start: 0, staysOpen: false },
	])('handles $name without native light dismiss', async ({ start, end, staysOpen }) => {
		const fixture = createFixture();
		try {
			fixture.document.querySelector('button')?.click();
			const dialog = fixture.document.querySelector('dialog');
			if (!dialog) {
				throw new Error('Expected a preview dialog');
			}
			spyOn(dialog, 'getBoundingClientRect').mockReturnValue(
				new fixture.window.DOMRect(20, 20, 100, 100)
			);
			for (const [type, position] of [
				['pointerdown', start],
				['pointerup', end],
			] as const) {
				dialog.dispatchEvent(
					new fixture.window.PointerEvent(type, { clientX: position, clientY: position })
				);
			}
			expect(dialog.open).toBe(staysOpen);
		} finally {
			await fixture.destroy();
		}
	});

	test('clears stale dimensions when another image is opened', async () => {
		const fixture = createFixture(
			`${SCREENSHOT_MARKUP}<img data-image-modal="true" src="/second.jpg" alt="Second image">`
		);
		try {
			fixture.document.querySelector('button')?.click();
			fixture.document.querySelector('dialog')?.close();
			fixture.document.querySelectorAll('img')[1]?.click();
			const image = fixture.document.querySelector('dialog img');
			expect(image?.getAttribute('src')).toBe('/second.jpg');
			expect(image?.hasAttribute('width')).toBe(false);
			expect(image?.hasAttribute('height')).toBe(false);
		} finally {
			await fixture.destroy();
		}
	});

	test.each([
		{ name: 'light', source: '/original.jpg', theme: 'light' },
		{ name: 'dark', source: '/dark.jpg', theme: 'dark' },
	])('opens the $name screenshot for the website theme', async ({ theme, source }) => {
		const fixture = createFixture();
		try {
			fixture.document.documentElement.className = theme;
			const button = fixture.document.querySelector('button');
			button?.setAttribute('data-image-modal-dark-src', '/dark.jpg');
			button?.click();
			expect(fixture.document.querySelector('dialog img')?.getAttribute('src')).toBe(source);
		} finally {
			await fixture.destroy();
		}
	});

	test.each([
		{ from: 'light', source: '/dark.jpg', to: 'dark' },
		{ from: 'dark', source: '/original.jpg', to: 'light' },
	])('updates the open modal from $from to $to', async ({ from, to, source }) => {
		const fixture = createFixture();
		try {
			fixture.document.documentElement.className = from;
			const button = fixture.document.querySelector('button');
			button?.setAttribute('data-image-modal-dark-src', '/dark.jpg');
			button?.click();
			fixture.document.documentElement.className = to;
			await fixture.window.happyDOM.waitUntilComplete();
			expect(fixture.document.querySelector('dialog img')?.getAttribute('src')).toBe(source);
		} finally {
			await fixture.destroy();
		}
	});

	test('removes the dialog and listeners during cleanup', async () => {
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
