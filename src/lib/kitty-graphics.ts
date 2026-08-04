import type { TerminalCore } from '@wterm/core';

const ASCII_DECODER = new TextDecoder('latin1');
const BEL = 0x07;
const ESC = 0x1b;
const KITTY_GRAPHICS = 0x47;
const PLACEHOLDER_CODEPOINT = 0x10_ee_ee;
const SEMICOLON = 0x3b;
const STRING_TERMINATOR = 0x5c;
const UNDERSCORE = 0x5f;
const MAX_TRANSFER_BASE64_BYTES = 32 * 1024 * 1024;
const PNG_FORMAT = 100;
const INTEGER_PATTERN = /^-?\d+$/;

const PARSER_STATE = {
	ApplicationProgramCommand: 2,
	Escape: 1,
	Idle: 0,
	KittyGraphics: 3,
	KittyGraphicsEscape: 4,
} as const;
type ParserState = (typeof PARSER_STATE)[keyof typeof PARSER_STATE];

export interface KittyGraphicsControl {
	a?: string;
	C?: number;
	c?: number;
	d?: string;
	f?: number;
	I?: number;
	i?: number;
	m?: number;
	p?: number;
	q?: number;
	r?: number;
	t?: string;
	U?: number;
	X?: number;
	Y?: number;
	z?: number;
	[key: string]: number | string | undefined;
}

interface KittyGraphicsCommand {
	control: KittyGraphicsControl;
	data: Uint8Array;
}

export type KittyGraphicsParserEvent =
	| { bytes: Uint8Array; type: 'text' }
	| { command: KittyGraphicsCommand; type: 'graphics' };

interface PendingTransfer {
	control: KittyGraphicsControl;
	payload: string;
}

interface StoredImage {
	data: Uint8Array;
}

interface PendingPlacement {
	columns: number;
	imageKey: string;
	placementId: number;
	rows: number;
	zIndex?: number;
}

interface RenderedPlacement {
	element: HTMLImageElement;
	imageKey: string;
	objectUrl: string;
	placementId: number;
}

export interface KittyGraphicsBridgeOptions {
	core: TerminalCore;
	grid: HTMLElement;
	sendResponse: (response: string) => void;
	writeTerminal: (data: Uint8Array) => void;
}

const decodeAscii = (bytes: number[]): string => ASCII_DECODER.decode(new Uint8Array(bytes));

const parseControl = (value: string): KittyGraphicsControl => {
	const control: KittyGraphicsControl = {};
	for (const part of value.split(',')) {
		const separator = part.indexOf('=');
		if (separator < 1) {
			continue;
		}

		const key = part.slice(0, separator).trim();
		const rawValue = part.slice(separator + 1).trim();
		if (INTEGER_PATTERN.test(rawValue)) {
			control[key] = Number(rawValue);
		} else {
			control[key] = rawValue;
		}
	}
	return control;
};

const decodeBase64 = (value: string): Uint8Array | null => {
	try {
		const decoded = atob(value);
		const bytes = new Uint8Array(decoded.length);
		for (let index = 0; index < decoded.length; index += 1) {
			bytes[index] = decoded.charCodeAt(index);
		}
		return bytes;
	} catch {
		return null;
	}
};

const imageKey = (control: KittyGraphicsControl): string => {
	if (typeof control.i === 'number') {
		return `i:${control.i}`;
	}
	if (typeof control.I === 'number') {
		return `I:${control.I}`;
	}
	return 'i:0';
};

const imageIdentifier = (control: KittyGraphicsControl): string => {
	if (typeof control.i === 'number') {
		return `i=${control.i}`;
	}
	if (typeof control.I === 'number') {
		return `I=${control.I}`;
	}
	return '';
};

export const createKittyGraphicsQueryResponse = (control: KittyGraphicsControl): string | null => {
	if ((control.f ?? PNG_FORMAT) !== PNG_FORMAT) {
		return null;
	}
	const identifier = imageIdentifier(control);
	const responseControl = identifier ? `${identifier};` : '';
	return `\x1b_G${responseControl}OK\x1b\\`;
};

const combineByteArrays = (chunks: Uint8Array[]): Uint8Array => {
	const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
	const combined = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		combined.set(chunk, offset);
		offset += chunk.length;
	}
	return combined;
};

const coalesceTextEvents = (events: KittyGraphicsParserEvent[]): KittyGraphicsParserEvent[] => {
	const coalesced: KittyGraphicsParserEvent[] = [];
	for (const event of events) {
		const previous = coalesced.at(-1);
		if (event.type === 'text' && previous?.type === 'text') {
			coalesced[coalesced.length - 1] = {
				bytes: combineByteArrays([previous.bytes, event.bytes]),
				type: 'text',
			};
			continue;
		}
		coalesced.push(event);
	}
	return coalesced;
};

export class KittyGraphicsParser {
	private applicationProgramCommand: number[] = [];
	private pendingTransfer: PendingTransfer | null = null;
	private state: ParserState = PARSER_STATE.Idle;

	// A state machine is clearer here than splitting each two-byte terminal prefix
	// across callbacks that also need to preserve byte-for-byte output ordering.
	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: protocol parser state machine
	push(input: Uint8Array): KittyGraphicsParserEvent[] {
		const events: KittyGraphicsParserEvent[] = [];
		let textStart = -1;

		const flushText = (end: number): void => {
			if (textStart >= 0 && end > textStart) {
				events.push({ bytes: input.slice(textStart, end), type: 'text' });
			}
			textStart = -1;
		};
		const emitLiteral = (bytes: number[]): void => {
			if (bytes.length > 0) {
				events.push({ bytes: new Uint8Array(bytes), type: 'text' });
			}
		};

		for (let index = 0; index < input.length; index += 1) {
			const byte = input[index];
			switch (this.state) {
				case PARSER_STATE.Idle:
					if (byte === ESC) {
						flushText(index);
						this.state = PARSER_STATE.Escape;
					} else if (textStart < 0) {
						textStart = index;
					}
					break;
				case PARSER_STATE.Escape:
					if (byte === UNDERSCORE) {
						this.state = PARSER_STATE.ApplicationProgramCommand;
					} else if (byte === ESC) {
						emitLiteral([ESC]);
					} else {
						emitLiteral([ESC, byte]);
						this.state = PARSER_STATE.Idle;
					}
					break;
				case PARSER_STATE.ApplicationProgramCommand:
					if (byte === KITTY_GRAPHICS) {
						this.applicationProgramCommand = [];
						this.state = PARSER_STATE.KittyGraphics;
					} else if (byte === ESC) {
						emitLiteral([ESC, UNDERSCORE]);
						this.state = PARSER_STATE.Escape;
					} else {
						emitLiteral([ESC, UNDERSCORE, byte]);
						this.state = PARSER_STATE.Idle;
					}
					break;
				case PARSER_STATE.KittyGraphics:
					if (byte === ESC) {
						this.state = PARSER_STATE.KittyGraphicsEscape;
					} else if (byte === BEL) {
						this.completeApplicationProgramCommand(events);
						this.state = PARSER_STATE.Idle;
					} else {
						this.applicationProgramCommand.push(byte);
					}
					break;
				case PARSER_STATE.KittyGraphicsEscape:
					if (byte === STRING_TERMINATOR) {
						this.completeApplicationProgramCommand(events);
						this.state = PARSER_STATE.Idle;
					} else {
						this.applicationProgramCommand.push(ESC);
						this.state = PARSER_STATE.KittyGraphics;
						index -= 1;
					}
					break;
				default:
					throw new Error(`Unknown Kitty graphics parser state: ${this.state}`);
			}
		}

		flushText(input.length);
		return coalesceTextEvents(events);
	}

	reset(): void {
		this.applicationProgramCommand = [];
		this.pendingTransfer = null;
		this.state = PARSER_STATE.Idle;
	}

	private completeApplicationProgramCommand(events: KittyGraphicsParserEvent[]): void {
		const separator = this.applicationProgramCommand.indexOf(SEMICOLON);
		const controlBytes =
			separator < 0
				? this.applicationProgramCommand
				: this.applicationProgramCommand.slice(0, separator);
		const payloadBytes =
			separator < 0 ? [] : this.applicationProgramCommand.slice(separator + 1);
		this.applicationProgramCommand = [];

		const control = parseControl(decodeAscii(controlBytes));
		const payload = decodeAscii(payloadBytes);
		const moreChunksFollow = control.m === 1;

		if (this.pendingTransfer || moreChunksFollow) {
			if (!this.pendingTransfer) {
				this.pendingTransfer = { control: { ...control }, payload: '' };
			}
			if (this.pendingTransfer.payload.length + payload.length > MAX_TRANSFER_BASE64_BYTES) {
				this.pendingTransfer = null;
				return;
			}

			this.pendingTransfer.payload += payload;
			if (moreChunksFollow) {
				return;
			}

			const completed = this.pendingTransfer;
			this.pendingTransfer = null;
			const data = decodeBase64(completed.payload);
			if (data) {
				events.push({
					command: { control: completed.control, data },
					type: 'graphics',
				});
			}
			return;
		}

		const data = decodeBase64(payload);
		if (data) {
			events.push({ command: { control, data }, type: 'graphics' });
		}
	}
}

export const findKittyPlaceholder = (
	core: Pick<TerminalCore, 'getCell' | 'getCols' | 'getRows'>
): { column: number; row: number } | null => {
	for (let row = 0; row < core.getRows(); row += 1) {
		for (let column = 0; column < core.getCols(); column += 1) {
			if (core.getCell(row, column).char === PLACEHOLDER_CODEPOINT) {
				return { column, row };
			}
		}
	}
	return null;
};

export class KittyGraphicsBridge {
	private readonly core: TerminalCore;
	private readonly grid: HTMLElement;
	private readonly images = new Map<string, StoredImage>();
	private readonly layer: HTMLDivElement;
	private readonly parser = new KittyGraphicsParser();
	private pendingPlacement: PendingPlacement | null = null;
	private readonly placements = new Map<string, RenderedPlacement>();
	private readonly sendResponse: (response: string) => void;
	private readonly writeTerminal: (data: Uint8Array) => void;

	constructor(options: KittyGraphicsBridgeOptions) {
		this.core = options.core;
		this.grid = options.grid;
		this.sendResponse = options.sendResponse;
		this.writeTerminal = options.writeTerminal;
		this.layer = this.grid.ownerDocument.createElement('div');
		this.layer.className = 'term-image-layer';
		this.grid.append(this.layer);
	}

	write(data: string | Uint8Array): void {
		const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
		for (const event of this.parser.push(bytes)) {
			if (event.type === 'graphics') {
				this.handleCommand(event.command);
				continue;
			}
			this.writeTerminal(event.bytes);
			this.placePendingImage();
		}
	}

	reset(): void {
		this.parser.reset();
		this.clearImages();
	}

	destroy(): void {
		this.reset();
		this.layer.remove();
	}

	private handleCommand(command: KittyGraphicsCommand): void {
		const { control } = command;
		const action = control.a ?? 't';
		if (action === 'q') {
			this.answerQuery(control);
			return;
		}
		if (action === 'd') {
			this.deleteImages(control);
			return;
		}
		if (action === 't' || action === 'T') {
			this.storeImage(command);
		}
		if (action === 'p' || action === 'T') {
			this.queuePlacement(control);
		}
	}

	private answerQuery(control: KittyGraphicsControl): void {
		const response = createKittyGraphicsQueryResponse(control);
		if (response) {
			this.sendResponse(response);
		}
	}

	private storeImage(command: KittyGraphicsCommand): void {
		if ((command.control.f ?? PNG_FORMAT) !== PNG_FORMAT || command.data.length === 0) {
			return;
		}
		this.images.set(imageKey(command.control), { data: command.data });
	}

	private queuePlacement(control: KittyGraphicsControl): void {
		if (control.U !== 1) {
			return;
		}
		const columns = control.c ?? 0;
		const rows = control.r ?? 0;
		if (columns < 1 || rows < 1) {
			return;
		}
		this.pendingPlacement = {
			columns,
			imageKey: imageKey(control),
			placementId: control.p ?? 0,
			rows,
			zIndex: control.z,
		};
		// Bubble Tea may paint the virtual placeholder before its asynchronous
		// image command arrives. Try both orderings: text writes call this method
		// after updating the terminal grid, and a late placement retries here.
		this.placePendingImage();
	}

	private placePendingImage(): void {
		const pending = this.pendingPlacement;
		if (!pending) {
			return;
		}
		const stored = this.images.get(pending.imageKey);
		const placeholder = findKittyPlaceholder(this.core);
		if (!(stored && placeholder)) {
			return;
		}

		const ownerWindow = this.grid.ownerDocument.defaultView;
		if (!ownerWindow) {
			return;
		}
		const terminal = this.grid.parentElement;
		if (!terminal) {
			return;
		}
		const styles = ownerWindow.getComputedStyle(terminal);
		const cellWidth = Number.parseFloat(styles.getPropertyValue('--term-cell-width'));
		const rowHeight = Number.parseFloat(styles.getPropertyValue('--term-row-height'));
		if (!(cellWidth > 0 && rowHeight > 0)) {
			return;
		}

		const placementKey = `${pending.imageKey}#${pending.placementId}`;
		this.removePlacement(placementKey);
		const objectUrl = ownerWindow.URL.createObjectURL(
			new ownerWindow.Blob([new Uint8Array(stored.data)], { type: 'image/png' })
		);
		const image = this.grid.ownerDocument.createElement('img');
		image.alt = '';
		image.className = 'term-image';
		image.draggable = false;
		image.src = objectUrl;
		image.style.height = `${pending.rows * rowHeight}px`;
		image.style.left = `${placeholder.column * cellWidth}px`;
		image.style.top = `${(this.core.getScrollbackCount() + placeholder.row) * rowHeight}px`;
		image.style.width = `${pending.columns * cellWidth}px`;
		if (pending.zIndex !== undefined) {
			image.style.zIndex = String(pending.zIndex);
		}
		this.layer.append(image);
		this.placements.set(placementKey, {
			element: image,
			imageKey: pending.imageKey,
			objectUrl,
			placementId: pending.placementId,
		});
		this.pendingPlacement = null;
	}

	private deleteImages(control: KittyGraphicsControl): void {
		const deleteMode = typeof control.d === 'string' ? control.d : 'a';
		if (deleteMode.toLowerCase() === 'a') {
			this.clearImages();
			return;
		}
		if (deleteMode.toLowerCase() !== 'i') {
			return;
		}

		const key = imageKey(control);
		for (const [placementKey, placement] of this.placements) {
			if (placement.imageKey === key) {
				this.removePlacement(placementKey);
			}
		}
		this.images.delete(key);
		if (this.pendingPlacement?.imageKey === key) {
			this.pendingPlacement = null;
		}
	}

	private clearImages(): void {
		for (const placementKey of this.placements.keys()) {
			this.removePlacement(placementKey);
		}
		this.images.clear();
		this.pendingPlacement = null;
	}

	private removePlacement(placementKey: string): void {
		const placement = this.placements.get(placementKey);
		if (!placement) {
			return;
		}
		const ownerWindow = this.grid.ownerDocument.defaultView;
		ownerWindow?.URL.revokeObjectURL(placement.objectUrl);
		placement.element.remove();
		this.placements.delete(placementKey);
	}
}
