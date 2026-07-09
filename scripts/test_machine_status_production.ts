const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_TYPE = 'bm';
const MACHINE_STATUS_URL = 'https://hotaisle.xyz/api/machine-status';
const MACHINE_STATUS_WEBSOCKET_URL = 'wss://hotaisle.xyz/api/ws';
const VALID_STATUSES = ['reserved', 'deleted'] as const;
const VALID_TYPES = ['vm', 'bm'] as const;

type MachineType = (typeof VALID_TYPES)[number];
type MachineStatus = (typeof VALID_STATUSES)[number];

interface MachineStatusPayload {
	gpuCount?: number;
	status: MachineStatus;
	type: MachineType;
}

interface ScriptConfig {
	payloads: MachineStatusPayload[];
	secret: string;
	timeoutMs: number;
}

const isMachineType = (value: string): value is MachineType =>
	VALID_TYPES.includes(value as MachineType);

const isMachineStatus = (value: string): value is MachineStatus =>
	VALID_STATUSES.includes(value as MachineStatus);

const createPayload = (
	type: MachineType,
	status: MachineStatus,
	rawGpuCount?: string
): MachineStatusPayload => {
	if (type === 'vm') {
		const parsedGpuCount = Number.parseInt(rawGpuCount ?? '', 10);

		if (!Number.isInteger(parsedGpuCount) || parsedGpuCount <= 0) {
			throw new Error('VM events require a positive integer gpuCount as the third argument.');
		}

		return {
			gpuCount: parsedGpuCount,
			status,
			type,
		};
	}

	return {
		status,
		type,
	};
};

const parsePayloads = (): MachineStatusPayload[] => {
	const [, , rawType = DEFAULT_TYPE, rawStatus, rawGpuCount] = process.argv;
	const type = rawType.trim().toLowerCase();

	if (!isMachineType(type)) {
		throw new Error(`Invalid machine type "${rawType}". Use "bm" or "vm".`);
	}

	if (rawStatus === undefined) {
		return VALID_STATUSES.map((validStatus) => createPayload(type, validStatus, rawGpuCount));
	}

	const status = rawStatus.trim().toLowerCase();
	if (!isMachineStatus(status)) {
		throw new Error(`Invalid machine status "${rawStatus}". Use "reserved" or "deleted".`);
	}

	return [createPayload(type, status, rawGpuCount)];
};

const parseConfig = (): ScriptConfig => {
	const secret = process.env.HOTAISLE_WEBSITE_SECRET?.trim();
	if (!secret) {
		throw new Error('Set HOTAISLE_WEBSITE_SECRET before running this command.');
	}

	const timeoutValue = process.env.HOTAISLE_MACHINE_STATUS_TIMEOUT_MS;
	const parsedTimeout =
		timeoutValue === undefined ? DEFAULT_TIMEOUT_MS : Number.parseInt(timeoutValue, 10);
	if (!Number.isInteger(parsedTimeout) || parsedTimeout <= 0) {
		throw new Error('HOTAISLE_MACHINE_STATUS_TIMEOUT_MS must be a positive integer.');
	}

	return {
		payloads: parsePayloads(),
		secret,
		timeoutMs: parsedTimeout,
	};
};

const isMatchingPayload = (
	value: unknown,
	expectedPayload: MachineStatusPayload
): value is MachineStatusPayload => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const { gpuCount, status, type } = value as Record<string, unknown>;
	if (type !== expectedPayload.type || status !== expectedPayload.status) {
		return false;
	}

	return gpuCount === expectedPayload.gpuCount;
};

interface BroadcastClient {
	awaitMatchingBroadcast: (
		expectedPayload: MachineStatusPayload
	) => Promise<MachineStatusPayload>;
	close: () => void;
	waitForConnection: Promise<void>;
}

const createBroadcastClient = (timeoutMs: number): BroadcastClient => {
	const webSocket = new WebSocket(MACHINE_STATUS_WEBSOCKET_URL);

	const waitForConnection = new Promise<void>((resolve, reject) => {
		webSocket.addEventListener('open', () => {
			console.log(`Connected to ${MACHINE_STATUS_WEBSOCKET_URL}`);
			resolve();
		});

		webSocket.addEventListener('error', () => {
			reject(new Error(`WebSocket connection failed for ${MACHINE_STATUS_WEBSOCKET_URL}.`));
		});
	});

	return {
		awaitMatchingBroadcast(
			expectedPayload: MachineStatusPayload
		): Promise<MachineStatusPayload> {
			return new Promise((resolve, reject) => {
				let settled = false;

				const cleanup = () => {
					clearTimeout(timeoutId);
					webSocket.removeEventListener('close', handleClose);
					webSocket.removeEventListener('error', handleError);
					webSocket.removeEventListener('message', handleMessage);
				};

				const settle = (callback: () => void) => {
					if (settled) {
						return;
					}

					settled = true;
					cleanup();
					callback();
				};

				const handleClose = (event: CloseEvent) => {
					settle(() => {
						reject(
							new Error(
								`WebSocket closed before receiving a matching broadcast (code ${event.code}).`
							)
						);
					});
				};

				const handleError = () => {
					settle(() => {
						reject(
							new Error(
								`WebSocket connection failed for ${MACHINE_STATUS_WEBSOCKET_URL}.`
							)
						);
					});
				};

				const handleMessage = (messageEvent: MessageEvent) => {
					const data = typeof messageEvent.data === 'string' ? messageEvent.data : null;
					if (!data) {
						return;
					}

					try {
						const parsedMessage: unknown = JSON.parse(data);
						if (!isMatchingPayload(parsedMessage, expectedPayload)) {
							console.log(`Ignoring non-matching broadcast: ${data}`);
							return;
						}

						settle(() => {
							resolve(parsedMessage);
						});
					} catch {
						console.log(`Ignoring non-JSON broadcast: ${data}`);
					}
				};

				const timeoutId = setTimeout(() => {
					settle(() => {
						reject(
							new Error(
								`Timed out after ${timeoutMs}ms waiting for a matching broadcast on ${MACHINE_STATUS_WEBSOCKET_URL}.`
							)
						);
					});
				}, timeoutMs);

				webSocket.addEventListener('close', handleClose);
				webSocket.addEventListener('error', handleError);
				webSocket.addEventListener('message', handleMessage);
			});
		},
		close(): void {
			webSocket.close();
		},
		waitForConnection,
	};
};

const postMachineStatus = async (
	payload: MachineStatusPayload,
	secret: string
): Promise<Response> =>
	await fetch(MACHINE_STATUS_URL, {
		body: JSON.stringify(payload),
		headers: {
			'content-type': 'application/json',
			'x-hotaisle-auth': secret,
		},
		method: 'POST',
	});

const run = async (): Promise<void> => {
	const { payloads, secret, timeoutMs } = parseConfig();

	console.log(`Waiting for matching broadcast on ${MACHINE_STATUS_WEBSOCKET_URL}`);
	const broadcastClient = createBroadcastClient(timeoutMs);
	await broadcastClient.waitForConnection;

	try {
		await postPayloads(payloads, secret, broadcastClient);
	} finally {
		broadcastClient.close();
	}
};

const postPayloads = async (
	[payload, ...remainingPayloads]: MachineStatusPayload[],
	secret: string,
	broadcastClient: BroadcastClient
): Promise<void> => {
	if (!payload) {
		return;
	}

	console.log(`POST payload: ${JSON.stringify(payload)}`);
	const broadcastPromise = broadcastClient.awaitMatchingBroadcast(payload);
	const response = await postMachineStatus(payload, secret);
	const responseBody = await response.text();

	console.log(`POST ${MACHINE_STATUS_URL} -> ${response.status}`);
	if (responseBody) {
		console.log(responseBody);
	}

	if (!response.ok) {
		throw new Error(`Machine status POST failed with status ${response.status}.`);
	}

	const broadcastPayload = await broadcastPromise;
	console.log(`Received matching broadcast: ${JSON.stringify(broadcastPayload)}`);

	await postPayloads(remainingPayloads, secret, broadcastClient);
};

await run();

export {};
