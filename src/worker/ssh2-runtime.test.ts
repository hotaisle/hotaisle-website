import { describe, expect, test } from 'bun:test';
import { spawn } from 'bun';

const RUNTIME_CHECK = `
const assert = require('node:assert/strict');
let wasmCalls = 0;
const disallowWasm = () => {
	wasmCalls++;
	throw new WebAssembly.CompileError('Wasm code generation disallowed by embedder');
};
WebAssembly.compile = disallowWasm;
WebAssembly.instantiate = disallowWasm;
WebAssembly.instantiateStreaming = disallowWasm;
const { init } = require('ssh2/lib/protocol/crypto.js');
await init;
assert.equal(wasmCalls, 0, 'SSH initialization must not compile WASM');
const { Client } = require('ssh2');
assert.equal(typeof new Client().connect, 'function');
const constants = require('ssh2/lib/protocol/constants.js');
for (const key of ['DEFAULT_CIPHER', 'SUPPORTED_CIPHER']) {
	assert.ok(constants[key].includes('aes128-ctr'), key + ' must support the terminal cipher');
	assert.ok(!constants[key].includes('chacha20-poly1305@openssh.com'), key + ' must exclude the unavailable WASM cipher');
}
`;

describe('SSH Worker runtime', () => {
	test('initializes with runtime WASM compilation disabled and advertises usable ciphers', async () => {
		const child = spawn([process.execPath, '--eval', RUNTIME_CHECK], {
			stderr: 'pipe',
			stdout: 'ignore',
			timeout: 5000,
		});
		const [exitCode, stderr] = await Promise.all([
			child.exited,
			new Response(child.stderr).text(),
		]);
		expect(stderr).toBe('');
		expect(exitCode).toBe(0);
	});
});
