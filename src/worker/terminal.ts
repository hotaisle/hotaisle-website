import { createHash } from 'node:crypto';
import { Client, type ClientChannel, type KeyboardInteractiveCallback, utils } from 'ssh2';

const ADMIN_HOST = 'admin.hotaisle.app';
const ADMIN_PORT = 22;
const ADMIN_USERNAME = 'web';
const AUTHENTICATION_TIMEOUT_MS = 5 * 60 * 1000;
const BASE64_PADDING_PATTERN = /[=]+$/u;
const DEFAULT_COLUMNS = 120;
const DEFAULT_ROWS = 44;
const ENABLE_BROWSER_SSH_KEYS: boolean = false;
const MAX_INPUT_LENGTH = 65_536;
const MAX_COLUMNS = 240;
const MAX_ROWS = 120;
const MIN_COLUMNS = 20;
const MIN_ROWS = 6;
const SSH_HOST_KEY_FINGERPRINT = 'L25NNRJX0BMIAq7xzGZMrQGou3ZnIDDoZpVLyXkLqik';
const TERMINAL_KEY_COMMENT = 'hotaisle-browser-terminal';

interface AuthenticationPrompt {
	echo?: boolean;
	prompt: string;
}

interface AuthenticationState {
	answers: string[];
	currentAnswer: string;
	finish: KeyboardInteractiveCallback;
	promptIndex: number;
	prompts: AuthenticationPrompt[];
}

interface ClientInputMessage {
	data: string;
	type: 'input';
}

interface ClientResizeMessage {
	cols: number;
	rows: number;
	type: 'resize';
}

interface GeneratedKeyPair {
	private: string;
	public: string;
}

type ClientMessage = ClientInputMessage | ClientResizeMessage;
type AuthenticationInputResult = 'cancelled' | 'complete' | 'pending';

const createSessionKeyPair = (): GeneratedKeyPair | null => {
	if (!ENABLE_BROWSER_SSH_KEYS) {
		return null;
	}
	return utils.generateKeyPairSync('ed25519', {
		comment: TERMINAL_KEY_COMMENT,
	});
};

export function handleTerminalRequest(request: Request): Response {
	if (request.method !== 'GET') {
		return new Response('Method not allowed', {
			headers: { allow: 'GET' },
			status: 405,
		});
	}

	if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
		return new Response('Expected Upgrade: websocket', { status: 426 });
	}

	const requestOrigin = new URL(request.url).origin;
	if (request.headers.get('Origin') !== requestOrigin) {
		return new Response('Forbidden', { status: 403 });
	}

	const webSocketPair = new WebSocketPair();
	const [browserSocket, workerSocket] = webSocketPair;
	workerSocket.accept();

	try {
		startSshSession(workerSocket);
	} catch {
		workerSocket.close(1011, 'Unable to start terminal session');
	}

	return new Response(null, {
		status: 101,
		webSocket: browserSocket,
	});
}

function startSshSession(browserSocket: WebSocket): void {
	const sshClient = new Client();
	const keyPair = createSessionKeyPair();
	let authenticationState: AuthenticationState | null = null;
	let shell: ClientChannel | null = null;
	let columns = DEFAULT_COLUMNS;
	let rows = DEFAULT_ROWS;
	let closed = false;

	const sendOutput = (data: string): void => {
		sendMessage(browserSocket, { data, type: 'output' });
	};

	const close = (
		code = 1000,
		reason = 'Terminal session closed',
		forceTransportClose = false
	): void => {
		if (closed) {
			return;
		}
		closed = true;
		if (forceTransportClose) {
			sshClient.destroy();
		} else {
			shell?.end();
			sshClient.end();
		}
		if (browserSocket.readyState === WebSocket.OPEN) {
			browserSocket.close(code, reason);
		}
	};

	const handleAuthenticationInput = (data: string): void => {
		if (!authenticationState) {
			return;
		}

		for (const character of data) {
			const result = applyAuthenticationCharacter(authenticationState, character, sendOutput);
			if (result === 'cancelled') {
				close(1000, 'Authentication cancelled');
				return;
			}

			if (result === 'complete') {
				const { answers, finish } = authenticationState;
				authenticationState = null;
				finish(answers);
				return;
			}
		}
	};

	browserSocket.addEventListener('message', (event) => {
		const message = parseClientMessage(event.data);
		if (!message) {
			return;
		}

		if (message.type === 'resize') {
			columns = clampDimension(message.cols, MIN_COLUMNS, MAX_COLUMNS);
			rows = clampDimension(message.rows, MIN_ROWS, MAX_ROWS);
			shell?.setWindow(rows, columns, 0, 0);
			return;
		}

		if (authenticationState) {
			handleAuthenticationInput(message.data);
			return;
		}

		shell?.write(message.data);
	});

	browserSocket.addEventListener('close', () => {
		close(1000, 'Browser connection closed', true);
	});

	browserSocket.addEventListener('error', () => {
		close(1011, 'Browser connection failed', true);
	});

	sshClient.on('banner', (message) => {
		sendOutput(message);
	});

	sshClient.on('keyboard-interactive', (name, instructions, _language, prompts, finish) => {
		if (name) {
			sendOutput(`${name}\r\n`);
		}
		if (instructions) {
			sendOutput(`${instructions}\r\n`);
		}

		authenticationState = {
			answers: [],
			currentAnswer: '',
			finish,
			promptIndex: 0,
			prompts,
		};

		const [firstPrompt] = prompts;
		if (firstPrompt) {
			sendOutput(firstPrompt.prompt);
		}
	});

	sshClient.on('ready', () => {
		if (keyPair) {
			sendMessage(browserSocket, {
				privateKey: keyPair.private,
				publicKey: keyPair.public,
				type: 'keypair',
			});
		}

		sshClient.shell(
			{
				cols: columns,
				rows,
				term: 'xterm-256color',
			},
			(error, channel) => {
				if (error) {
					sendOutput(`\r\nUnable to open the terminal: ${error.message}\r\n`);
					close(1011, 'SSH shell failed');
					return;
				}

				shell = channel;
				channel.on('data', (data: Buffer) => {
					sendBinaryMessage(browserSocket, data);
				});
				channel.stderr.on('data', (data: Buffer) => {
					sendBinaryMessage(browserSocket, data);
				});
				channel.on('close', () => {
					close();
				});
			}
		);
	});

	sshClient.on('error', (error) => {
		sendOutput(`\r\nSSH connection failed: ${error.message}\r\n`);
		close(1011, 'SSH connection failed');
	});

	sshClient.on('close', () => {
		close();
	});

	sshClient.connect({
		algorithms: {
			cipher: ['aes128-ctr'],
			hmac: ['hmac-sha2-256'],
			kex: ['ecdh-sha2-nistp256'],
			serverHostKey: ['ssh-ed25519'],
		},
		authHandler: ENABLE_BROWSER_SSH_KEYS
			? ['publickey', 'keyboard-interactive']
			: ['keyboard-interactive'],
		host: ADMIN_HOST,
		hostVerifier: (key: Buffer) => {
			const fingerprint = createHash('sha256')
				.update(key)
				.digest('base64')
				.replace(BASE64_PADDING_PATTERN, '');
			return fingerprint === SSH_HOST_KEY_FINGERPRINT;
		},
		keepaliveInterval: 15_000,
		port: ADMIN_PORT,
		...(keyPair ? { privateKey: keyPair.private } : {}),
		readyTimeout: AUTHENTICATION_TIMEOUT_MS,
		tryKeyboard: true,
		username: ADMIN_USERNAME,
	});
}

function applyAuthenticationCharacter(
	state: AuthenticationState,
	character: string,
	sendOutput: (data: string) => void
): AuthenticationInputResult {
	const prompt = state.prompts.at(state.promptIndex);
	if (!prompt) {
		return 'complete';
	}

	if (character === '\u0003') {
		return 'cancelled';
	}

	if (character === '\b' || character === '\u007f') {
		if (state.currentAnswer.length > 0) {
			state.currentAnswer = state.currentAnswer.slice(0, -1);
			if (prompt.echo) {
				sendOutput('\b \b');
			}
		}
		return 'pending';
	}

	if (character !== '\r' && character !== '\n') {
		state.currentAnswer += character;
		if (prompt.echo) {
			sendOutput(character);
		}
		return 'pending';
	}

	state.answers.push(state.currentAnswer);
	state.currentAnswer = '';
	state.promptIndex += 1;
	sendOutput('\r\n');

	const nextPrompt = state.prompts.at(state.promptIndex);
	if (!nextPrompt) {
		return 'complete';
	}

	sendOutput(nextPrompt.prompt);
	return 'pending';
}

function clampDimension(value: number, minimum: number, maximum: number): number {
	return Math.min(Math.max(Math.trunc(value), minimum), maximum);
}

function parseClientMessage(value: unknown): ClientMessage | null {
	if (typeof value !== 'string' || value.length > MAX_INPUT_LENGTH) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(value);
		if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
			return null;
		}

		if (
			parsed.type === 'input' &&
			'data' in parsed &&
			typeof parsed.data === 'string' &&
			parsed.data.length <= MAX_INPUT_LENGTH
		) {
			return { data: parsed.data, type: 'input' };
		}

		if (
			parsed.type === 'resize' &&
			'cols' in parsed &&
			'rows' in parsed &&
			typeof parsed.cols === 'number' &&
			typeof parsed.rows === 'number' &&
			Number.isFinite(parsed.cols) &&
			Number.isFinite(parsed.rows)
		) {
			return { cols: parsed.cols, rows: parsed.rows, type: 'resize' };
		}
	} catch {
		return null;
	}

	return null;
}

function sendBinaryMessage(browserSocket: WebSocket, data: Uint8Array): void {
	if (browserSocket.readyState !== WebSocket.OPEN) {
		return;
	}

	try {
		const message = new Uint8Array(data);
		browserSocket.send(message.buffer);
	} catch {
		// The close/error handlers own session cleanup.
	}
}

function sendMessage(browserSocket: WebSocket, message: object): void {
	if (browserSocket.readyState !== WebSocket.OPEN) {
		return;
	}

	try {
		browserSocket.send(JSON.stringify(message));
	} catch {
		// The close/error handlers own session cleanup.
	}
}
