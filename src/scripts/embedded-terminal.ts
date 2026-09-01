import { GHOSTTY_WASM_PATH } from '@/lib/ghostty-wasm.ts';

const TERMINAL_SELECTOR = '[data-embedded-terminal]';
const TERMINAL_VIEWPORT_SELECTOR = '.ha-embedded-terminal__viewport';
const TERMINAL_SCREEN_SELECTOR = '[data-terminal-screen]';
const TERMINAL_GRID_SELECTOR = '.term-grid';
const TERMINAL_STATUS_SELECTOR = '[data-terminal-status]';
const TERMINAL_RECONNECT_SELECTOR = '[data-terminal-reconnect]';
const TERMINAL_FOCUS_PROMPT_SELECTOR = '[data-terminal-focus-prompt]';
const KEY_DOWNLOADS_SELECTOR = '[data-terminal-key-downloads]';
const PRIVATE_KEY_BUTTON_SELECTOR = '[data-download-private-key]';
const PUBLIC_KEY_BUTTON_SELECTOR = '[data-download-public-key]';
const PLATFORM_INSTRUCTIONS_SELECTOR = '[data-platform-instructions]';
const PLATFORM_TAB_SELECTOR = '[role="tab"][data-platform]';
const PLATFORM_PANEL_SELECTOR = '[data-platform-panel][data-platform]';
const PRIVATE_KEY_FILENAME = 'id_hotaisle_ed25519';
const PUBLIC_KEY_FILENAME = `${PRIVATE_KEY_FILENAME}.pub`;
const PLATFORMS = ['macos', 'windows', 'linux'] as const;
const TERMINAL_COLUMNS = 120;
const TERMINAL_CURSOR_BLINK_INTERVAL_MS = 500;
const TERMINAL_REVEAL_DELAY_MS = 50;
const TERMINAL_ROWS = 44;
const TERMINAL_SUPPORT_ATTRIBUTE = 'terminalSupport';
const ESCAPE_CHARACTER = '\x1b';

interface KeyPairMessage {
	privateKey: string;
	publicKey: string;
	type: 'keypair';
}

interface OutputMessage {
	data: string;
	type: 'output';
}

type ServerMessage = KeyPairMessage | OutputMessage;
type Platform = (typeof PLATFORMS)[number];

const isPlatform = (value: string | undefined): value is Platform =>
	PLATFORMS.some((platform) => platform === value);

const supportsEmbeddedTerminal = (): boolean => {
	try {
		return (
			typeof WebAssembly === 'object' &&
			typeof WebAssembly.instantiate === 'function' &&
			typeof WebSocket === 'function' &&
			typeof IntersectionObserver === 'function' &&
			typeof TextDecoder === 'function' &&
			typeof TextEncoder === 'function' &&
			typeof fetch === 'function' &&
			typeof atob === 'function' &&
			typeof Blob === 'function' &&
			typeof URL?.createObjectURL === 'function'
		);
	} catch {
		return false;
	}
};

const setTerminalSupport = (supported: boolean): void => {
	document.documentElement.dataset[TERMINAL_SUPPORT_ATTRIBUTE] = supported
		? 'supported'
		: 'unsupported';
};

const detectPlatform = (): Platform => {
	const browserPlatform = `${navigator.platform} ${navigator.userAgent}`.toLowerCase();
	if (browserPlatform.includes('win')) {
		return 'windows';
	}
	if (browserPlatform.includes('mac')) {
		return 'macos';
	}
	return 'linux';
};

const initializePlatformInstructions = (container: HTMLElement): void => {
	const instructions = container.querySelector<HTMLElement>(PLATFORM_INSTRUCTIONS_SELECTOR);
	if (!instructions) {
		return;
	}

	const tabs = Array.from(
		instructions.querySelectorAll<HTMLButtonElement>(PLATFORM_TAB_SELECTOR)
	);
	const panels = Array.from(instructions.querySelectorAll<HTMLElement>(PLATFORM_PANEL_SELECTOR));

	const selectPlatform = (platform: Platform, focusTab = false): void => {
		for (const tab of tabs) {
			const isSelected = tab.dataset.platform === platform;
			tab.setAttribute('aria-selected', String(isSelected));
			tab.tabIndex = isSelected ? 0 : -1;
			if (isSelected && focusTab) {
				tab.focus();
			}
		}
		for (const panel of panels) {
			panel.hidden = panel.dataset.platform !== platform;
		}
	};

	for (const tab of tabs) {
		tab.addEventListener('click', () => {
			const { platform } = tab.dataset;
			if (isPlatform(platform)) {
				selectPlatform(platform);
			}
		});
		tab.addEventListener('keydown', (event) => {
			const currentIndex = tabs.indexOf(tab);
			let nextIndex: number | null = null;
			if (event.key === 'ArrowRight') {
				nextIndex = (currentIndex + 1) % tabs.length;
			} else if (event.key === 'ArrowLeft') {
				nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
			} else if (event.key === 'Home') {
				nextIndex = 0;
			} else if (event.key === 'End') {
				nextIndex = tabs.length - 1;
			}

			const nextPlatform = nextIndex === null ? undefined : tabs[nextIndex]?.dataset.platform;
			if (!isPlatform(nextPlatform)) {
				return;
			}
			event.preventDefault();
			selectPlatform(nextPlatform, true);
		});
	}

	selectPlatform(detectPlatform());
};

const parseServerMessage = (value: unknown): ServerMessage | null => {
	if (typeof value !== 'string') {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(value);
		if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
			return null;
		}

		if (parsed.type === 'output' && 'data' in parsed && typeof parsed.data === 'string') {
			return { data: parsed.data, type: 'output' };
		}

		if (
			parsed.type === 'keypair' &&
			'privateKey' in parsed &&
			'publicKey' in parsed &&
			typeof parsed.privateKey === 'string' &&
			typeof parsed.publicKey === 'string'
		) {
			return {
				privateKey: parsed.privateKey,
				publicKey: parsed.publicKey,
				type: 'keypair',
			};
		}
	} catch {
		return null;
	}

	return null;
};

const createDownload = (contents: string, filename: string, blobUrls: string[]): (() => void) => {
	const blobUrl = URL.createObjectURL(new Blob([contents], { type: 'application/octet-stream' }));
	blobUrls.push(blobUrl);

	return () => {
		const link = document.createElement('a');
		link.download = filename;
		link.href = blobUrl;
		link.click();
	};
};

const initializeTerminal = async (container: HTMLElement): Promise<void> => {
	const viewport = container.querySelector<HTMLElement>(TERMINAL_VIEWPORT_SELECTOR);
	const screen = container.querySelector<HTMLElement>(TERMINAL_SCREEN_SELECTOR);
	const status = container.querySelector<HTMLElement>(TERMINAL_STATUS_SELECTOR);
	const reconnectButton = container.querySelector<HTMLButtonElement>(TERMINAL_RECONNECT_SELECTOR);
	const focusPrompt = container.querySelector<HTMLButtonElement>(TERMINAL_FOCUS_PROMPT_SELECTOR);
	const downloads = container.querySelector<HTMLElement>(KEY_DOWNLOADS_SELECTOR);
	const privateKeyButton = container.querySelector<HTMLButtonElement>(
		PRIVATE_KEY_BUTTON_SELECTOR
	);
	const publicKeyButton = container.querySelector<HTMLButtonElement>(PUBLIC_KEY_BUTTON_SELECTOR);
	const sshKeyHandlingEnabled = container.dataset.sshKeysEnabled === 'true';
	if (
		!(
			viewport &&
			screen &&
			status &&
			reconnectButton &&
			focusPrompt &&
			downloads &&
			privateKeyButton &&
			publicKeyButton
		)
	) {
		return;
	}

	status.textContent = 'Connecting';
	container.dataset.state = 'connecting';
	container.dataset.terminalCursorVisible = 'false';
	container.dataset.terminalFocus = 'false';
	downloads.classList.add('hidden');
	if (sshKeyHandlingEnabled) {
		initializePlatformInstructions(container);
	}

	const [{ WTerm }, { GhosttyCore }, { KittyGraphicsBridge }] = await Promise.all([
		import('@wterm/dom'),
		import('@wterm/ghostty'),
		import('@/lib/kitty-graphics.ts'),
	]);
	const core = await GhosttyCore.load({ wasmPath: GHOSTTY_WASM_PATH });
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const terminalUrl = `${protocol}//${window.location.host}/api/terminal`;
	let socket: WebSocket | null = null;
	let privateKeyDownload: (() => void) | null = null;
	let publicKeyDownload: (() => void) | null = null;
	const keyBlobUrls: string[] = [];
	let cursorBlinkTimer: ReturnType<typeof setInterval> | null = null;
	let revealTimer: ReturnType<typeof setTimeout> | null = null;

	const sendTerminalInput = (data: string): void => {
		if (socket?.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ data, type: 'input' }));
		}
	};

	const handleTerminalPaste = (event: ClipboardEvent): void => {
		const text = event.clipboardData?.getData('text');
		if (!text) {
			return;
		}

		event.preventDefault();
		event.stopImmediatePropagation();
		const safeText = text.split(ESCAPE_CHARACTER).join('');
		sendTerminalInput(safeText);
	};

	const stopCursorBlink = (): void => {
		if (cursorBlinkTimer !== null) {
			clearInterval(cursorBlinkTimer);
			cursorBlinkTimer = null;
		}
		container.dataset.terminalCursorVisible = 'false';
	};

	const startCursorBlink = (): void => {
		stopCursorBlink();
		container.dataset.terminalCursorVisible = 'true';
		cursorBlinkTimer = setInterval(() => {
			container.dataset.terminalCursorVisible =
				container.dataset.terminalCursorVisible === 'true' ? 'false' : 'true';
		}, TERMINAL_CURSOR_BLINK_INTERVAL_MS);
	};

	const setTerminalFocusState = (focused: boolean): void => {
		container.dataset.terminalFocus = String(focused);
		if (focused) {
			startCursorBlink();
			return;
		}
		stopCursorBlink();
	};

	const scheduleTerminalReveal = (): void => {
		if (revealTimer !== null) {
			clearTimeout(revealTimer);
		}

		revealTimer = setTimeout(() => {
			revealTimer = null;
			screen.setAttribute('aria-busy', 'false');
			container.dataset.terminalReady = 'true';
		}, TERMINAL_REVEAL_DELAY_MS);
	};

	const terminal = new WTerm(screen, {
		autoResize: false,
		cols: TERMINAL_COLUMNS,
		core,
		cursorBlink: true,
		onData: sendTerminalInput,
		onResize: (cols, rows) => {
			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ cols, rows, type: 'resize' }));
			}
		},
		rows: TERMINAL_ROWS,
	});

	const focusTerminal = (): void => {
		terminal.focus();
	};
	const restoreTerminalFocusAfterSelection = (): void => {
		const selection = screen.ownerDocument.getSelection();
		const selectionIsInsideTerminal =
			selection !== null &&
			!selection.isCollapsed &&
			selection.anchorNode !== null &&
			selection.focusNode !== null &&
			screen.contains(selection.anchorNode) &&
			screen.contains(selection.focusNode);
		if (!selectionIsInsideTerminal) {
			return;
		}

		const selectedRanges: Range[] = [];
		for (let index = 0; index < selection.rangeCount; index += 1) {
			selectedRanges.push(selection.getRangeAt(index).cloneRange());
		}

		terminal.focus();
		selection.removeAllRanges();
		for (const range of selectedRanges) {
			selection.addRange(range);
		}
		setTerminalFocusState(true);
	};
	const startTerminalSelection = (): void => {
		container.dataset.terminalSelecting = 'true';
	};
	const finishTerminalSelection = (): void => {
		delete container.dataset.terminalSelecting;
		restoreTerminalFocusAfterSelection();
	};
	const cancelTerminalSelection = (): void => {
		delete container.dataset.terminalSelecting;
	};

	screen.addEventListener('focusin', () => {
		setTerminalFocusState(true);
	});
	screen.addEventListener('focusout', () => {
		queueMicrotask(() => {
			const { activeElement } = screen.ownerDocument;
			setTerminalFocusState(activeElement !== null && screen.contains(activeElement));
		});
	});
	screen.addEventListener('paste', handleTerminalPaste, { capture: true });
	focusPrompt.addEventListener('click', focusTerminal);

	await terminal.init();
	const terminalGrid = screen.querySelector<HTMLElement>(TERMINAL_GRID_SELECTOR);
	if (!terminalGrid) {
		terminal.destroy();
		throw new Error('Embedded terminal graphics grid was not created');
	}
	const graphics = new KittyGraphicsBridge({
		core,
		grid: terminalGrid,
		sendResponse: sendTerminalInput,
		writeTerminal: (data) => {
			terminal.write(data);
		},
	});
	viewport.addEventListener('mouseenter', focusTerminal);
	screen.addEventListener('pointerdown', startTerminalSelection);
	screen.ownerDocument.addEventListener('pointerup', finishTerminalSelection);
	screen.ownerDocument.addEventListener('pointercancel', cancelTerminalSelection);

	const clearKeyDownloads = (): void => {
		for (const blobUrl of keyBlobUrls) {
			URL.revokeObjectURL(blobUrl);
		}
		keyBlobUrls.length = 0;
		privateKeyDownload = null;
		publicKeyDownload = null;
		downloads.classList.add('hidden');
	};

	const connect = (): void => {
		const connectionIsActive =
			socket?.readyState === WebSocket.CONNECTING || socket?.readyState === WebSocket.OPEN;
		if (connectionIsActive) {
			return;
		}

		status.textContent = 'Connecting';
		container.dataset.state = 'connecting';
		reconnectButton.disabled = true;
		reconnectButton.classList.add('hidden');

		const nextSocket = new WebSocket(terminalUrl);
		nextSocket.binaryType = 'arraybuffer';
		socket = nextSocket;

		nextSocket.addEventListener('open', () => {
			if (socket !== nextSocket) {
				return;
			}
			status.textContent = 'Connected';
			container.dataset.state = 'connected';
			terminal.focus();
		});

		nextSocket.addEventListener('message', (event) => {
			if (socket !== nextSocket) {
				return;
			}
			if (event.data instanceof ArrayBuffer) {
				graphics.write(new Uint8Array(event.data));
				scheduleTerminalReveal();
				return;
			}

			const message = parseServerMessage(event.data);
			if (!message) {
				return;
			}

			if (message.type === 'output') {
				graphics.write(message.data);
				scheduleTerminalReveal();
				return;
			}

			if (!sshKeyHandlingEnabled) {
				return;
			}

			clearKeyDownloads();
			privateKeyDownload = createDownload(
				message.privateKey,
				PRIVATE_KEY_FILENAME,
				keyBlobUrls
			);
			publicKeyDownload = createDownload(message.publicKey, PUBLIC_KEY_FILENAME, keyBlobUrls);
			downloads.classList.remove('hidden');
			status.textContent = 'Authenticated';
			container.dataset.state = 'authenticated';
		});

		nextSocket.addEventListener('close', () => {
			if (socket !== nextSocket) {
				return;
			}
			socket = null;
			status.textContent = 'Disconnected';
			container.dataset.state = 'disconnected';
			reconnectButton.disabled = false;
			reconnectButton.classList.remove('hidden');
			scheduleTerminalReveal();
		});

		nextSocket.addEventListener('error', () => {
			if (socket !== nextSocket) {
				return;
			}
			status.textContent = 'Connection failed';
			terminal.write('\r\nUnable to connect to the browser terminal.\r\n');
			scheduleTerminalReveal();
		});
	};

	if (sshKeyHandlingEnabled) {
		privateKeyButton.addEventListener('click', () => {
			privateKeyDownload?.();
		});
		publicKeyButton.addEventListener('click', () => {
			publicKeyDownload?.();
		});
	}
	reconnectButton.addEventListener('click', () => {
		clearKeyDownloads();
		graphics.reset();
		terminal.write('\x1bc');
		terminal.write('Reconnecting...\r\n');
		connect();
	});

	connect();

	window.addEventListener(
		'pagehide',
		() => {
			if (revealTimer !== null) {
				clearTimeout(revealTimer);
			}
			stopCursorBlink();
			clearKeyDownloads();
			const activeSocket = socket;
			socket = null;
			activeSocket?.close();
			screen.removeEventListener('paste', handleTerminalPaste, { capture: true });
			screen.removeEventListener('pointerdown', startTerminalSelection);
			screen.ownerDocument.removeEventListener('pointerup', finishTerminalSelection);
			screen.ownerDocument.removeEventListener('pointercancel', cancelTerminalSelection);
			graphics.destroy();
			terminal.destroy();
		},
		{ once: true }
	);
};

if (supportsEmbeddedTerminal()) {
	setTerminalSupport(true);
	const terminalContainers = document.querySelectorAll<HTMLElement>(TERMINAL_SELECTOR);
	const observer = new IntersectionObserver(
		async (entries) => {
			const initializationTasks: Promise<void>[] = [];
			for (const entry of entries) {
				if (!(entry.isIntersecting && entry.target instanceof HTMLElement)) {
					continue;
				}

				observer.unobserve(entry.target);
				initializationTasks.push(
					initializeTerminal(entry.target).catch((error: unknown) => {
						setTerminalSupport(false);
						console.error('Unable to initialize the embedded terminal', error);
					})
				);
			}
			await Promise.all(initializationTasks);
		},
		{ rootMargin: '200px' }
	);

	for (const container of terminalContainers) {
		observer.observe(container);
	}
} else {
	setTerminalSupport(false);
}
