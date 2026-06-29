interface MachineStatusScriptConfig {
	apiBasePath: string;
	enabled: boolean;
}

export function initializeMachineStatusScript(config: MachineStatusScriptConfig): void {
	const { apiBasePath, enabled } = config;
	const EVENT_TYPES = new Set(['vm', 'bm']);
	const EVENT_STATUSES = new Set(['reserved', 'deleted']);
	const HOME_SIGNAL_ID = 'ha-machine-status-signal';
	const HOME_SIGNAL_LINK_PATH = '/quick-start/';
	const LIVE_REGION_ID = 'ha-machine-status-live-region';
	const HOME_SIGNAL_EXIT_DURATION_MS = 260;
	const MOBILE_HOME_SIGNAL_MEDIA_QUERY = '(max-width: 640px)';
	const MAX_VISIBLE_HOME_SIGNALS = 3;
	const MOBILE_VISIBLE_HOME_SIGNALS = 2;
	const RETRY_BASE_DELAY_MS = 1000;
	const RETRY_MAX_DELAY_MS = 15_000;
	const HOME_SIGNAL_DURATION_MS = 60_000;
	const HOME_SIGNAL_AUTO_DISMISS_DELAY_MS = Math.max(
		0,
		HOME_SIGNAL_DURATION_MS - HOME_SIGNAL_EXIT_DURATION_MS
	);

	type MachineType = 'vm' | 'bm';
	type MachineStatus = 'reserved' | 'deleted';

	interface MachineStatusEvent {
		gpuCount?: number;
		status: MachineStatus;
		type: MachineType;
	}

	interface MachineSignalDisplay {
		machineCount: string;
		machineLabel: string;
	}

	let reconnectTimeoutId = 0;
	let reconnectAttempts = 0;
	let activeSocket: WebSocket | null = null;

	if (!enabled) {
		return;
	}

	const setup = () => {
		const documentRoot = document;
		const body = document.body;
		if (!body) {
			return;
		}

		const liveRegion = ensureLiveRegion(documentRoot, body);
		const homeSignalStack = ensureHomeSignalStack(documentRoot, body);

		connect({
			homeSignalStack,
			liveRegion,
		});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setup, { once: true });
		return;
	}

	setup();

	window.addEventListener('beforeunload', () => {
		if (activeSocket) {
			activeSocket.close();
		}

		if (reconnectTimeoutId) {
			window.clearTimeout(reconnectTimeoutId);
		}
	});

	function connect({
		homeSignalStack,
		liveRegion,
	}: {
		homeSignalStack: HTMLDivElement;
		liveRegion: HTMLDivElement;
	}) {
		if (!('WebSocket' in window)) {
			return;
		}

		const socketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const socketUrl = `${socketProtocol}//${window.location.host}${apiBasePath}/ws`;
		const socket = new WebSocket(socketUrl);
		activeSocket = socket;

		socket.addEventListener('open', () => {
			reconnectAttempts = 0;
		});

		socket.addEventListener('message', (messageEvent) => {
			const machineEvent = parseMachineEvent(messageEvent.data);
			if (!machineEvent) {
				return;
			}

			announceEvent(liveRegion, machineEvent);
			activateHomeSignal(homeSignalStack, machineEvent);
		});

		socket.addEventListener('error', () => {
			socket.close();
		});

		socket.addEventListener('close', () => {
			if (activeSocket === socket) {
				activeSocket = null;
			}

			scheduleReconnect(() => {
				connect({ homeSignalStack, liveRegion });
			});
		});
	}

	function scheduleReconnect(reconnect: () => void) {
		if (reconnectTimeoutId) {
			window.clearTimeout(reconnectTimeoutId);
		}

		const retryDelay = Math.min(
			RETRY_BASE_DELAY_MS * 2 ** reconnectAttempts,
			RETRY_MAX_DELAY_MS
		);
		reconnectAttempts += 1;
		reconnectTimeoutId = window.setTimeout(reconnect, retryDelay);
	}

	function ensureLiveRegion(documentRoot: Document, body: HTMLElement): HTMLDivElement {
		const existingLiveRegion = documentRoot.getElementById(LIVE_REGION_ID);
		if (existingLiveRegion instanceof HTMLDivElement) {
			return existingLiveRegion;
		}

		const liveRegion = documentRoot.createElement('div');
		liveRegion.className = 'ha-visually-hidden';
		liveRegion.id = LIVE_REGION_ID;
		liveRegion.setAttribute('aria-atomic', 'true');
		liveRegion.setAttribute('aria-live', 'polite');
		body.append(liveRegion);

		return liveRegion;
	}

	function ensureHomeSignalStack(documentRoot: Document, body: HTMLElement): HTMLDivElement {
		const existingSignal = documentRoot.getElementById(HOME_SIGNAL_ID);
		if (existingSignal instanceof HTMLDivElement) {
			return existingSignal;
		}

		const homeSignalStack = documentRoot.createElement('div');
		homeSignalStack.className = 'ha-machine-home-signal-stack';
		homeSignalStack.id = HOME_SIGNAL_ID;
		homeSignalStack.setAttribute('aria-hidden', 'true');
		body.append(homeSignalStack);

		return homeSignalStack;
	}

	function parseMachineEvent(payload: unknown): MachineStatusEvent | null {
		let parsedPayload: unknown = payload;

		if (typeof payload === 'string') {
			try {
				parsedPayload = JSON.parse(payload);
			} catch {
				return null;
			}
		}

		if (typeof parsedPayload !== 'object' || parsedPayload === null) {
			return null;
		}

		const { gpuCount, status, type } = parsedPayload as Record<string, unknown>;
		if (typeof status !== 'string' || typeof type !== 'string') {
			return null;
		}

		const normalizedStatus = status.trim().toLowerCase();
		const normalizedType = type.trim().toLowerCase();
		const normalizedGpuCount =
			typeof gpuCount === 'number' && Number.isInteger(gpuCount) && gpuCount > 0
				? gpuCount
				: undefined;

		if (!(EVENT_STATUSES.has(normalizedStatus) && EVENT_TYPES.has(normalizedType))) {
			return null;
		}

		if (normalizedType === 'vm' && normalizedGpuCount === undefined) {
			return null;
		}

		return {
			gpuCount: normalizedGpuCount,
			status: normalizedStatus as MachineStatus,
			type: normalizedType as MachineType,
		};
	}

	function announceEvent(liveRegion: HTMLDivElement, machineEvent: MachineStatusEvent) {
		liveRegion.textContent = `${formatDisplayLabel(machineEvent)} ${machineEvent.status}`;
	}

	function activateHomeSignal(homeSignalStack: HTMLDivElement, machineEvent: MachineStatusEvent) {
		const { machineCount, machineLabel } = formatSignalDisplay(machineEvent);
		const statusLabel = machineEvent.status === 'reserved' ? 'Node engaged' : 'Node released';
		const homeSignal = document.createElement('div');
		const dismissButton = document.createElement('button');
		const glow = document.createElement('div');
		const frame = document.createElement('div');
		const topline = document.createElement('div');
		const eyebrow = document.createElement('div');
		const livePill = document.createElement('div');
		const body = document.createElement('div');
		const metric = document.createElement('div');
		const metricCount = document.createElement('div');
		const metricLabel = document.createElement('div');
		const copy = document.createElement('div');
		const title = document.createElement('div');
		const meta = document.createElement('div');
		const status = document.createElement('span');
		const progressTrack = document.createElement('div');
		const progressBar = document.createElement('div');

		homeSignal.className = 'ha-machine-home-signal';
		homeSignal.dataset.status = machineEvent.status;
		homeSignal.dataset.type = machineEvent.type;
		homeSignal.style.setProperty(
			'--ha-machine-home-signal-duration',
			`${HOME_SIGNAL_DURATION_MS}ms`
		);
		homeSignal.setAttribute('role', 'link');
		homeSignal.tabIndex = 0;
		homeSignal.setAttribute(
			'aria-label',
			`${formatDisplayLabel(machineEvent)} ${statusLabel}. Open quick start.`
		);
		homeSignal.addEventListener('click', () => {
			window.location.assign(HOME_SIGNAL_LINK_PATH);
		});
		homeSignal.addEventListener('keydown', (event) => {
			if (event.key !== 'Enter' && event.key !== ' ') {
				return;
			}

			event.preventDefault();
			window.location.assign(HOME_SIGNAL_LINK_PATH);
		});

		dismissButton.className = 'ha-machine-home-signal__dismiss';
		dismissButton.setAttribute('aria-label', 'Dismiss alert');
		dismissButton.type = 'button';
		dismissButton.addEventListener('click', (event) => {
			event.stopPropagation();
			dismissHomeSignal(homeSignal);
		});
		dismissButton.addEventListener('keydown', (event) => {
			event.stopPropagation();
		});

		glow.className = 'ha-machine-home-signal__glow';
		glow.setAttribute('aria-hidden', 'true');

		frame.className = 'ha-machine-home-signal__frame';
		topline.className = 'ha-machine-home-signal__topline';
		eyebrow.className = 'ha-machine-home-signal__eyebrow';
		eyebrow.textContent = 'Realtime Capacity Alert';
		livePill.className = 'ha-machine-home-signal__live-pill';
		livePill.textContent = 'Live';

		body.className = 'ha-machine-home-signal__body';
		metric.className = 'ha-machine-home-signal__metric';
		metric.setAttribute('aria-hidden', 'true');
		metricCount.className = 'ha-machine-home-signal__metric-count';
		metricCount.textContent = machineCount;
		metricLabel.className = 'ha-machine-home-signal__metric-label';
		metricLabel.textContent = 'GPU';

		copy.className = 'ha-machine-home-signal__copy';
		title.className = 'ha-machine-home-signal__title';
		title.textContent = machineLabel;
		meta.className = 'ha-machine-home-signal__meta';
		status.className = 'ha-machine-home-signal__status';
		status.textContent = statusLabel;
		progressTrack.className = 'ha-machine-home-signal__progress-track';
		progressTrack.setAttribute('aria-hidden', 'true');
		progressBar.className = 'ha-machine-home-signal__progress-bar';

		topline.append(livePill, eyebrow);
		metric.append(metricCount, metricLabel);
		meta.append(status);
		copy.append(title, meta);
		body.append(metric, copy);
		progressTrack.append(progressBar);
		frame.append(topline, body, progressTrack);
		homeSignal.append(dismissButton, glow, frame);

		homeSignalStack.prepend(homeSignal);

		while (homeSignalStack.childElementCount > getMaxVisibleHomeSignals()) {
			homeSignalStack.lastElementChild?.remove();
		}

		homeSignal.getBoundingClientRect();
		homeSignal.classList.add('is-active');

		window.setTimeout(() => {
			dismissHomeSignal(homeSignal);
		}, HOME_SIGNAL_AUTO_DISMISS_DELAY_MS);
	}

	function formatDisplayLabel(machineEvent: MachineStatusEvent): string {
		const { machineCount, machineLabel } = formatSignalDisplay(machineEvent);
		return `${machineCount} ${machineLabel}`;
	}

	function formatSignalDisplay(machineEvent: MachineStatusEvent): MachineSignalDisplay {
		if (machineEvent.type === 'bm') {
			return {
				machineCount: '8x',
				machineLabel: 'bare metal',
			};
		}

		return {
			machineCount: `${machineEvent.gpuCount ?? 0}x`,
			machineLabel: 'virtual machine',
		};
	}

	function getMaxVisibleHomeSignals(): number {
		if (window.matchMedia(MOBILE_HOME_SIGNAL_MEDIA_QUERY).matches) {
			return MOBILE_VISIBLE_HOME_SIGNALS;
		}

		return MAX_VISIBLE_HOME_SIGNALS;
	}

	function dismissHomeSignal(homeSignal: HTMLDivElement): void {
		if (homeSignal.classList.contains('is-exiting')) {
			return;
		}

		homeSignal.classList.add('is-exiting');

		window.setTimeout(() => {
			homeSignal.remove();
		}, HOME_SIGNAL_EXIT_DURATION_MS);
	}
}
