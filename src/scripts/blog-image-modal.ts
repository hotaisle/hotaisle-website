import { enableDialogLightDismiss } from '@/lib/dialog-light-dismiss.ts';

const MODAL_TRIGGER_SELECTOR =
	'img.blog-inline-image, img[data-image-modal="true"], a[data-image-modal="true"], button[data-image-modal="true"]';
const MODAL_ACTIVATION_KEYS = new Set(['Enter', ' ']);

interface ImageModal {
	dialog: HTMLDialogElement;
	image: HTMLImageElement;
}

const getModalSource = (
	trigger: HTMLElement,
	image: HTMLImageElement | null,
	isDark: boolean
): string | undefined => {
	if (isDark && trigger.dataset.imageModalDarkSrc) {
		return trigger.dataset.imageModalDarkSrc;
	}
	return trigger.dataset.imageModalSrc ?? (image?.currentSrc || image?.src);
};

export function initializeBlogImageModalScript(localDocument: Document = document): () => void {
	const view = localDocument.defaultView;
	if (!view) {
		return () => undefined;
	}
	const controller = new view.AbortController();
	const { signal } = controller;
	let modal: ImageModal | undefined;
	let activeTrigger: HTMLElement | undefined;

	const createModal = (): ImageModal => {
		const dialog = localDocument.createElement('dialog');
		dialog.className = 'ha-image-dialog';
		dialog.setAttribute('closedby', 'any');

		const closeForm = localDocument.createElement('form');
		closeForm.method = 'dialog';
		closeForm.className = 'ha-image-dialog__toolbar';
		const closeButton = localDocument.createElement('button');
		closeButton.type = 'submit';
		closeButton.setAttribute('autofocus', '');
		closeButton.textContent = 'Close image';
		closeForm.append(closeButton);

		const image = localDocument.createElement('img');
		image.className = 'ha-image-dialog__image';
		image.decoding = 'async';
		dialog.append(closeForm, image);
		localDocument.body.append(dialog);
		dialog.addEventListener(
			'close',
			() => {
				themeObserver.disconnect();
				activeTrigger = undefined;
			},
			{ signal }
		);

		enableDialogLightDismiss(dialog, signal);

		return { dialog, image };
	};

	const updateModalImage = (trigger: HTMLElement): ImageModal | undefined => {
		const triggerImage =
			trigger instanceof view.HTMLImageElement ? trigger : trigger.querySelector('img');
		const isDark = localDocument.documentElement.classList.contains('dark');
		const src = getModalSource(trigger, triggerImage, isDark);
		if (!src) {
			return;
		}
		modal ??= createModal();
		const { dialog, image } = modal;
		image.src = src;
		image.alt = trigger.dataset.imageModalAlt ?? triggerImage?.alt ?? '';
		dialog.setAttribute('aria-label', image.alt || 'Image preview');
		for (const dimension of ['width', 'height'] as const) {
			const value =
				trigger.dataset[dimension === 'width' ? 'imageModalWidth' : 'imageModalHeight'] ??
				triggerImage?.getAttribute(dimension);
			if (value) {
				image.setAttribute(dimension, value);
			} else {
				image.removeAttribute(dimension);
			}
		}
		return modal;
	};

	const themeObserver = new view.MutationObserver(() => {
		if (activeTrigger && modal?.dialog.open) {
			updateModalImage(activeTrigger);
		}
	});

	const openModal = (trigger: HTMLElement): void => {
		const currentModal = updateModalImage(trigger);
		if (!currentModal) {
			return;
		}
		activeTrigger = trigger;
		if (trigger.dataset.imageModalDarkSrc) {
			themeObserver.observe(localDocument.documentElement, {
				attributeFilter: ['class'],
			});
		}
		if (!currentModal.dialog.open) {
			trigger.focus();
			currentModal.dialog.showModal();
		}
	};

	const findTrigger = (target: EventTarget | null): HTMLElement | null => {
		if (!(target instanceof view.Element)) {
			return null;
		}
		const trigger = target.closest(MODAL_TRIGGER_SELECTOR);
		return trigger instanceof view.HTMLElement ? trigger : null;
	};

	localDocument.addEventListener(
		'click',
		(event) => {
			const trigger = findTrigger(event.target);
			if (trigger) {
				event.preventDefault();
				openModal(trigger);
			}
		},
		{ signal }
	);
	localDocument.addEventListener(
		'keydown',
		(event) => {
			if (!MODAL_ACTIVATION_KEYS.has(event.key)) {
				return;
			}
			const trigger = findTrigger(event.target);
			if (
				!trigger ||
				trigger instanceof view.HTMLAnchorElement ||
				trigger instanceof view.HTMLButtonElement
			) {
				return;
			}
			event.preventDefault();
			openModal(trigger);
		},
		{ signal }
	);

	return () => {
		controller.abort();
		themeObserver.disconnect();
		modal?.dialog.close();
		modal?.dialog.remove();
	};
}
