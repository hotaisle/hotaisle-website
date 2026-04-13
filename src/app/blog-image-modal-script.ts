export function initializeBlogImageModalScript(): void {
	const MODAL_IMAGE_SELECTOR = 'img.blog-inline-image';

	let overlay: HTMLElement | null = null;
	let modalImg: HTMLImageElement | null = null;

	const closeModal = () => {
		if (!overlay) {
			return;
		}
		overlay.style.display = 'none';
		document.body.style.overflow = '';
	};

	const ensureModal = () => {
		if (overlay) {
			return;
		}

		overlay = document.createElement('div');
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('aria-modal', 'true');
		overlay.setAttribute('tabindex', '-1');
		overlay.style.cssText =
			'display:none;position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);padding:1.5rem';

		const closeBtn = document.createElement('button');
		closeBtn.setAttribute('aria-label', 'Close image');
		closeBtn.setAttribute('type', 'button');
		closeBtn.style.cssText =
			'position:absolute;top:1rem;right:1rem;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;border-radius:9999px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.5);color:white;cursor:pointer;font-size:1.25rem;line-height:1';
		closeBtn.textContent = '\u00d7';
		closeBtn.addEventListener('click', closeModal);

		const imgWrapper = document.createElement('div');
		imgWrapper.style.cssText = 'max-height:100%;max-width:72rem';

		modalImg = document.createElement('img');
		modalImg.alt = '';
		modalImg.style.cssText =
			'max-height:85vh;width:auto;max-width:100%;border-radius:0.75rem;object-fit:contain;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);border:2px solid rgba(255,255,255,0.35)';

		imgWrapper.appendChild(modalImg);
		overlay.appendChild(closeBtn);
		overlay.appendChild(imgWrapper);
		document.body.appendChild(overlay);

		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				closeModal();
			}
		});
	};

	const openModal = (img: HTMLImageElement) => {
		ensureModal();
		if (!(modalImg && overlay)) {
			return;
		}
		modalImg.src = img.currentSrc || img.src;
		modalImg.alt = img.alt;
		const w = img.getAttribute('width');
		const h = img.getAttribute('height');
		if (w) {
			modalImg.width = Number(w);
		}
		if (h) {
			modalImg.height = Number(h);
		}
		overlay.style.display = 'flex';
		document.body.style.overflow = 'hidden';
	};

	document.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}
		const img = target.closest(MODAL_IMAGE_SELECTOR);
		if (!(img instanceof HTMLImageElement)) {
			return;
		}
		openModal(img);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && overlay && overlay.style.display !== 'none') {
			closeModal();
		}
	});
}
