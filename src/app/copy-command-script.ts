export function initializeCopyCommandScript(): void {
	const COPY_BUTTON_SELECTOR = '[data-copy-command-button]';
	const COPY_TEXT_ATTRIBUTE = 'data-copy-command-text';
	const COPY_DEFAULT_LABEL_ATTRIBUTE = 'data-copy-default-label';
	const COPY_COPIED_CLASS_ATTRIBUTE = 'data-copy-copied-class';
	const COPY_RESET_DELAY_MS = 2000;

	const resetButtonLabel = (button: HTMLButtonElement) => {
		const defaultLabel = button.getAttribute(COPY_DEFAULT_LABEL_ATTRIBUTE) ?? 'Copy';
		const copiedClassName = button.getAttribute(COPY_COPIED_CLASS_ATTRIBUTE);

		if (copiedClassName) {
			button.classList.remove(copiedClassName);
		}

		button.textContent = defaultLabel;
	};

	const scheduleReset = (button: HTMLButtonElement) => {
		const activeTimeout = button.dataset.copyResetTimeout;
		if (activeTimeout) {
			window.clearTimeout(Number(activeTimeout));
		}

		const timeoutId = window.setTimeout(() => {
			resetButtonLabel(button);
			delete button.dataset.copyResetTimeout;
		}, COPY_RESET_DELAY_MS);

		button.dataset.copyResetTimeout = String(timeoutId);
	};

	const copyWithFallback = async (text: string): Promise<void> => {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);

			return;
		}

		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.setAttribute('readonly', '');
		textArea.style.position = 'absolute';
		textArea.style.left = '-9999px';

		document.body.append(textArea);
		textArea.select();

		try {
			const wasCopied = document.execCommand('copy');
			if (!wasCopied) {
				throw new Error('Unable to copy command.');
			}
		} finally {
			textArea.remove();
		}
	};

	document.addEventListener('click', async ({ target }) => {
		if (!(target instanceof Element)) {
			return;
		}

		const button = target.closest(COPY_BUTTON_SELECTOR);
		if (!(button instanceof HTMLButtonElement)) {
			return;
		}

		const text = button.getAttribute(COPY_TEXT_ATTRIBUTE) ?? '';
		const copiedClassName = button.getAttribute(COPY_COPIED_CLASS_ATTRIBUTE);

		if (copiedClassName) {
			button.classList.add(copiedClassName);
		}
		button.textContent = 'Copied';
		scheduleReset(button);

		try {
			await copyWithFallback(text);
		} catch {
			if (copiedClassName) {
				button.classList.remove(copiedClassName);
			}
			button.textContent = 'Failed';
			scheduleReset(button);
		}
	});
}
