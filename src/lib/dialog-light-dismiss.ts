export function enableDialogLightDismiss(dialog: HTMLDialogElement, signal: AbortSignal): void {
	const view = dialog.ownerDocument.defaultView;
	if (!view || 'closedBy' in view.HTMLDialogElement.prototype) {
		return;
	}
	let pressedOutside = false;
	const outside = (event: PointerEvent): boolean => {
		const bounds = dialog.getBoundingClientRect();
		return (
			event.clientX < bounds.left ||
			event.clientX > bounds.right ||
			event.clientY < bounds.top ||
			event.clientY > bounds.bottom
		);
	};
	dialog.addEventListener(
		'pointerdown',
		(event) => {
			pressedOutside = outside(event);
		},
		{ signal }
	);
	dialog.addEventListener(
		'pointerup',
		(event) => {
			if (pressedOutside && outside(event)) {
				dialog.close();
			}
			pressedOutside = false;
		},
		{ signal }
	);
	dialog.addEventListener(
		'pointercancel',
		() => {
			pressedOutside = false;
		},
		{ signal }
	);
}
