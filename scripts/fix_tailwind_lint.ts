/**
 * fix_tailwind_lint.ts
 *
 * Uses @tailwindcss/language-server (via LSP protocol) to find and auto-fix
 * Tailwind CSS linting warnings in .tsx files.
 *
 * Usage: bun run scripts/fix_tailwind_lint.ts [--dry-run]
 */

import { spawn } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PROJECT_ROOT = process.cwd();
const SERVER_BIN = path.join(PROJECT_ROOT, 'node_modules', '.bin', 'tailwindcss-language-server');
const DRY_RUN = process.argv.includes('--dry-run');

const contentLengthRegex = /Content-Length:\s*(\d+)/;
const sevMap: Record<number, string> = { 1: 'error', 2: 'warn', 3: 'info', 4: 'hint' };

// ---------------------------------------------------------------------------
// LSP client
// ---------------------------------------------------------------------------

interface Pending {
	reject: (reason: Error) => void;
	resolve: (value: unknown) => void;
}

interface TextEdit {
	newText: string;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
}

interface Diagnostic {
	code?: string | number;
	message: string;
	range: {
		start: { line: number; character: number };
		end: { line: number; character: number };
	};
	severity?: number;
	source?: string;
}

interface CodeAction {
	edit?: {
		changes?: Record<string, TextEdit[]>;
		documentChanges?: Array<{
			textDocument?: { uri: string };
			edits: TextEdit[];
		}>;
	};
	kind?: string;
	title: string;
}

class LspClient {
	private readonly proc: ReturnType<typeof spawn>;
	// Use a Buffer accumulator so that `length` is byte-accurate.
	// Content-Length is measured in bytes; JS string.length is in code units,
	// which diverges for multibyte UTF-8 characters (e.g., the ellipsis '…').
	private buf = Buffer.alloc(0);
	private readonly pending = new Map<number, Pending>();
	private readonly diagCallbacks = new Map<string, (diags: Diagnostic[]) => void>();
	private nextId = 1;
	private dead = false;

	constructor() {
		this.proc = spawn(SERVER_BIN, ['--stdio'], {
			cwd: PROJECT_ROOT,
			stdio: ['pipe', 'pipe', 'pipe'],
			env: { ...process.env },
		});

		this.proc.stdout?.on('data', (chunk: Buffer) => {
			this.buf = Buffer.concat([this.buf, chunk]);
			this.drain();
		});

		this.proc.stderr?.on('data', (data: Buffer) => {
			const msg = data.toString().trim();
			if (msg) {
				process.stderr.write(`[lsp] ${msg}\n`);
			}
		});

		this.proc.on('exit', () => {
			this.dead = true;
		});
	}

	private drain() {
		while (true) {
			// Find the \r\n\r\n header terminator in byte space
			const sep = this.buf.indexOf('\r\n\r\n');
			if (sep === -1) {
				break;
			}

			const header = this.buf.subarray(0, sep).toString('ascii');
			const m = header.match(contentLengthRegex);
			if (!m) {
				// Malformed header; skip past this separator
				this.buf = this.buf.subarray(sep + 4);
				continue;
			}

			const bodyLen = Number(m[1]);
			const bodyStart = sep + 4;

			// Wait until the full body has arrived (byte-accurate comparison)
			if (this.buf.length < bodyStart + bodyLen) {
				break;
			}

			const body = this.buf.subarray(bodyStart, bodyStart + bodyLen).toString('utf8');
			this.buf = this.buf.subarray(bodyStart + bodyLen);

			try {
				this.handle(JSON.parse(body));
			} catch {
				// ignore malformed messages
			}
		}
	}

	private handle(msg: Record<string, unknown>) {
		if (msg.id !== undefined && msg.method === undefined) {
			// Response to one of our requests
			const p = this.pending.get(msg.id as number);
			if (p) {
				this.pending.delete(msg.id as number);
				const err = msg.error as Record<string, unknown> | undefined;
				if (err) {
					p.reject(new Error(String(err.message)));
				} else {
					p.resolve(msg.result);
				}
			}
		} else if (msg.id !== undefined && msg.method !== undefined) {
			// Server-to-client request — we must send a response or the server stalls.
			this.handleServerRequest(msg.id as number, msg.method as string, msg.params);
		} else if (msg.method === 'textDocument/publishDiagnostics') {
			const params = msg.params as { uri: string; diagnostics: Diagnostic[] };
			const cb = this.diagCallbacks.get(params.uri);
			if (cb) {
				this.diagCallbacks.delete(params.uri);
				cb(params.diagnostics);
			}
		}
		// ignore window/logMessage, $/progress, etc.
	}

	private handleServerRequest(id: number, method: string, _params: unknown) {
		if (method === 'workspace/configuration') {
			// Return one config object per requested item.
			const items = (_params as { items?: unknown[] })?.items ?? [];
			const config = {
				validate: true,
				lint: {
					cssConflict: 'warning',
					invalidApply: 'error',
					invalidScreen: 'error',
					invalidVariant: 'error',
					invalidConfigPath: 'error',
					invalidTailwindDirective: 'error',
					recommendedVariantOrder: 'warning',
				},
				classAttributes: ['class', 'className', 'ngClass'],
				includeLanguages: {},
				emmetCompletions: false,
				showPixelEquivalents: true,
				rootFontSize: 16,
				colorDecorators: true,
				hovers: true,
				suggestions: true,
				codeActions: true,
				experimental: {},
			};
			this.respond(
				id,
				items.map(() => config)
			);
		} else {
			// All other server→client requests (workspaceFolders, registerCapability, etc.)
			this.respond(id, null);
		}
	}

	private respond(id: number, result: unknown) {
		this.write({ jsonrpc: '2.0', id, result });
	}

	private write(msg: object) {
		const body = JSON.stringify(msg);
		const hdr = `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n`;
		this.proc.stdin?.write(hdr + body);
	}

	request<T = unknown>(method: string, params: unknown): Promise<T> {
		const id = this.nextId++;
		return new Promise<T>((resolve, reject) => {
			this.pending.set(id, {
				resolve: resolve as (v: unknown) => void,
				reject,
			});
			this.write({ jsonrpc: '2.0', id, method, params });
		});
	}

	notify(method: string, params: unknown) {
		this.write({ jsonrpc: '2.0', method, params });
	}

	waitForDiagnostics(uri: string, timeoutMs = 10_000): Promise<Diagnostic[]> {
		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				this.diagCallbacks.delete(uri);
				resolve([]);
			}, timeoutMs);
			this.diagCallbacks.set(uri, (diags) => {
				clearTimeout(timer);
				resolve(diags);
			});
		});
	}

	async shutdown() {
		if (!this.dead) {
			try {
				await this.request('shutdown', null);
				this.notify('exit', null);
			} catch {
				// ignore
			}
			this.proc.kill();
		}
	}
}

// ---------------------------------------------------------------------------
// File utilities
// ---------------------------------------------------------------------------

async function findTsxFiles(root: string): Promise<string[]> {
	const result: string[] = [];

	async function walk(dir: string) {
		const entries = await readdir(dir, { withFileTypes: true });
		for (const e of entries) {
			if (e.name.startsWith('.') || e.name === 'node_modules') {
				continue;
			}
			const full = path.join(dir, e.name);
			if (e.isDirectory()) {
				await walk(full);
			} else if (e.isFile() && e.name.endsWith('.tsx')) {
				result.push(full);
			}
		}
	}

	await walk(root);
	return result;
}

/**
 * Apply LSP TextEdits to a string buffer, returning the modified content.
 * Edits must not overlap. We apply them in reverse document order.
 */
function applyEdits(content: string, edits: TextEdit[]): string {
	// Build an offset-based representation
	const lines = content.split('\n');

	function lineColToOffset(line: number, col: number): number {
		let off = 0;
		for (let i = 0; i < line; i++) {
			off += lines[i].length + 1; // +1 for \n
		}
		return off + col;
	}

	// Sort in reverse order (end of file first) so earlier offsets stay valid
	const sorted = [...edits].sort((a, b) => {
		const ld = b.range.start.line - a.range.start.line;
		return ld === 0 ? b.range.start.character - a.range.start.character : ld;
	});

	let result = content;
	for (const edit of sorted) {
		const start = lineColToOffset(edit.range.start.line, edit.range.start.character);
		const end = lineColToOffset(edit.range.end.line, edit.range.end.character);
		result = result.slice(0, start) + edit.newText + result.slice(end);
	}
	return result;
}

// ---------------------------------------------------------------------------
// Per-file processing
// ---------------------------------------------------------------------------

async function collectEdits(
	client: LspClient,
	uri: string,
	diags: Diagnostic[]
): Promise<TextEdit[]> {
	const edits: TextEdit[] = [];
	for (const diag of diags) {
		let actions: CodeAction[] | null = null;
		try {
			actions = await client.request<CodeAction[]>('textDocument/codeAction', {
				textDocument: { uri },
				range: diag.range,
				context: { diagnostics: [diag], only: ['quickfix'] },
			});
		} catch {
			continue;
		}
		for (const action of actions ?? []) {
			if (action.edit?.changes?.[uri]) {
				edits.push(...action.edit.changes[uri]);
			}
			for (const dc of action.edit?.documentChanges ?? []) {
				if (dc.textDocument?.uri === uri) {
					edits.push(...dc.edits);
				}
			}
		}
	}
	return edits;
}

/** Returns true if the file was (or would be) fixed. */
async function processFile(
	client: LspClient,
	filePath: string
): Promise<{ diagCount: number; fixed: boolean }> {
	const uri = pathToFileURL(filePath).toString();
	const original = await readFile(filePath, 'utf8');
	const rel = path.relative(PROJECT_ROOT, filePath);

	const diagsPromise = client.waitForDiagnostics(uri);
	client.notify('textDocument/didOpen', {
		textDocument: { uri, languageId: 'typescriptreact', version: 1, text: original },
	});
	const diags = await diagsPromise;

	if (diags.length === 0) {
		client.notify('textDocument/didClose', { textDocument: { uri } });
		return { diagCount: 0, fixed: false };
	}

	console.log(`${rel} — ${diags.length} diagnostic(s):`);
	for (const d of diags) {
		const sev = sevMap[d.severity ?? 0] ?? 'info';
		console.log(
			`  [${sev}] ${d.message} (${d.code ?? '?'}) @ ${d.range.start.line + 1}:${d.range.start.character + 1}`
		);
	}

	const edits = await collectEdits(client, uri, diags);
	client.notify('textDocument/didClose', { textDocument: { uri } });

	if (edits.length === 0) {
		console.log('  (no auto-fix available)\n');
		return { diagCount: diags.length, fixed: false };
	}

	const fixed = applyEdits(original, edits);
	if (fixed !== original) {
		if (!DRY_RUN) {
			await writeFile(filePath, fixed, 'utf8');
		}
		console.log(`  → ${DRY_RUN ? '[dry-run] would fix' : 'fixed'} ${edits.length} edit(s)\n`);
	}
	return { diagCount: diags.length, fixed: fixed !== original };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	const client = new LspClient();

	const tsxFiles = await findTsxFiles(path.join(PROJECT_ROOT, 'src'));
	console.log(`Scanning ${tsxFiles.length} .tsx files${DRY_RUN ? ' (dry run)' : ''}…\n`);

	await client.request('initialize', {
		processId: process.pid,
		rootUri: pathToFileURL(PROJECT_ROOT).toString(),
		workspaceFolders: [
			{ uri: pathToFileURL(PROJECT_ROOT).toString(), name: path.basename(PROJECT_ROOT) },
		],
		capabilities: {
			textDocument: {
				publishDiagnostics: { relatedInformation: true },
				codeAction: {
					codeActionLiteralSupport: {
						codeActionKind: { valueSet: ['quickfix', 'source', 'source.fixAll'] },
					},
					resolveSupport: { properties: ['edit'] },
				},
			},
			workspace: { applyEdit: true, configuration: true, workspaceFolders: true },
		},
		initializationOptions: { userLanguages: { typescriptreact: 'html' } },
	});
	client.notify('initialized', {});

	let totalDiags = 0;
	let totalFiles = 0;
	for (const filePath of tsxFiles) {
		const { diagCount, fixed } = await processFile(client, filePath);
		totalDiags += diagCount;
		if (fixed) {
			totalFiles++;
		}
	}

	console.log('─'.repeat(60));
	console.log(`Diagnostics found : ${totalDiags}`);
	console.log(
		`Files fixed       : ${totalFiles}${DRY_RUN ? ' (dry run — no files written)' : ''}`
	);

	await client.shutdown();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
