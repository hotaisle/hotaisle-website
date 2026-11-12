import { enableDialogLightDismiss } from '@/lib/dialog-light-dismiss.ts';

const VIDEO_TRIGGER_SELECTOR = 'button[data-video-modal]';
const VIDEO_TITLE_ID = 'ha-video-dialog-title';

interface VideoModal {
	captions: HTMLTrackElement;
	dialog: HTMLDialogElement;
	message: HTMLParagraphElement;
	openLink: HTMLAnchorElement;
	title: HTMLHeadingElement;
	transcript: HTMLAnchorElement;
	video: HTMLVideoElement;
}

export function initializeVideoModalScript(localDocument: Document = document): () => void {
	const view = localDocument.defaultView;
	if (!view) {
		return () => undefined;
	}
	const controller = new view.AbortController();
	const { signal } = controller;
	let modal: VideoModal | undefined;
	let generation = 0;

	const assetURL = (value: string | undefined): string | undefined => {
		if (!value) {
			return;
		}
		if (!view.URL.canParse(value, localDocument.baseURI)) {
			return;
		}
		const url = new view.URL(value, localDocument.baseURI);
		if (url.origin === view.location.origin && url.pathname.startsWith('/assets/')) {
			return `${url.pathname}${url.search}`;
		}
	};

	const stopPlayback = (): void => {
		generation += 1;
		if (modal) {
			modal.video.pause();
			modal.video.removeAttribute('src');
			modal.captions.removeAttribute('src');
			modal.video.load();
		}
	};

	const createModal = (): VideoModal => {
		const dialog = localDocument.createElement('dialog');
		dialog.className = 'ha-video-dialog';
		dialog.setAttribute('aria-labelledby', VIDEO_TITLE_ID);
		dialog.setAttribute('closedby', 'any');
		const header = localDocument.createElement('header');
		header.className = 'ha-video-dialog__header';
		const title = localDocument.createElement('h2');
		title.id = VIDEO_TITLE_ID;
		const closeForm = localDocument.createElement('form');
		closeForm.method = 'dialog';
		const closeButton = localDocument.createElement('button');
		closeButton.type = 'submit';
		closeButton.setAttribute('autofocus', '');
		closeButton.textContent = 'Close video';
		closeForm.append(closeButton);
		header.append(title, closeForm);
		const video = localDocument.createElement('video');
		video.controls = true;
		video.setAttribute('playsinline', '');
		video.preload = 'none';
		video.setAttribute('width', '1920');
		video.setAttribute('height', '1080');
		const captions = localDocument.createElement('track');
		captions.kind = 'captions';
		captions.srclang = 'en';
		captions.label = 'English';
		video.append(captions);
		const message = localDocument.createElement('p');
		message.hidden = true;
		message.setAttribute('role', 'alert');
		const links = localDocument.createElement('p');
		links.className = 'ha-video-dialog__links';
		const transcript = localDocument.createElement('a');
		transcript.textContent = 'Read transcript';
		const openLink = localDocument.createElement('a');
		openLink.textContent = 'Open video';
		openLink.target = '_blank';
		openLink.rel = 'noopener';
		links.append(transcript, openLink);
		dialog.append(header, video, message, links);
		localDocument.body.append(dialog);
		dialog.addEventListener('close', stopPlayback, { signal });
		video.addEventListener(
			'error',
			() => {
				if (dialog.open) {
					message.textContent = 'The video could not be loaded. Try opening it directly.';
					message.hidden = false;
				}
			},
			{ signal }
		);
		enableDialogLightDismiss(dialog, signal);
		return { captions, dialog, message, openLink, title, transcript, video };
	};

	const openModal = async (trigger: HTMLButtonElement): Promise<void> => {
		const src = assetURL(trigger.dataset.videoModal);
		if (!src) {
			return;
		}
		modal ??= createModal();
		const current = modal;
		generation += 1;
		const attempt = generation;
		const title = trigger.dataset.videoTitle ?? 'Video';
		current.title.textContent = title;
		current.video.setAttribute('aria-label', title);
		current.message.hidden = true;
		current.video.setAttribute('poster', assetURL(trigger.dataset.videoPoster) ?? '');
		current.video.src = src;
		const captionsURL = assetURL(trigger.dataset.videoCaptions);
		if (captionsURL) {
			current.captions.setAttribute('src', captionsURL);
		} else {
			current.captions.removeAttribute('src');
		}
		const transcriptURL = assetURL(trigger.dataset.videoTranscript);
		current.transcript.hidden = !transcriptURL;
		if (transcriptURL) {
			current.transcript.href = transcriptURL;
		} else {
			current.transcript.removeAttribute('href');
		}
		current.openLink.href = src;
		trigger.focus();
		current.dialog.showModal();
		try {
			await current.video.play();
		} catch {
			if (current.dialog.open && generation === attempt && !current.video.error) {
				current.message.textContent = 'Press play to start the video.';
				current.message.hidden = false;
			}
		}
	};

	localDocument.addEventListener(
		'click',
		async (event) => {
			if (!(event.target instanceof view.Element)) {
				return;
			}
			const trigger = event.target.closest(VIDEO_TRIGGER_SELECTOR);
			if (trigger instanceof view.HTMLButtonElement) {
				event.preventDefault();
				await openModal(trigger);
			}
		},
		{ signal }
	);
	view.addEventListener(
		'pagehide',
		() => {
			modal?.dialog.close();
			stopPlayback();
		},
		{ signal }
	);

	return () => {
		controller.abort();
		stopPlayback();
		modal?.dialog.close();
		modal?.dialog.remove();
	};
}
