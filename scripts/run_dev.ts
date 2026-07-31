import { type ChildProcess, spawn } from 'node:child_process';
import { once } from 'node:events';

const DEVELOPMENT_COMMANDS = [
	['run', 'dev:site'],
	['run', 'dev:worker'],
] as const;
const TERMINATION_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

interface ProcessExit {
	code: number;
	command: string;
}

const childProcesses: ChildProcess[] = [];
let isShuttingDown = false;

const stopChildProcess = (childProcess: ChildProcess): void => {
	if (childProcess.exitCode !== null || childProcess.signalCode !== null) {
		return;
	}

	const processId = childProcess.pid;
	const canTerminateProcessGroup = process.platform !== 'win32' && processId !== undefined;
	if (!canTerminateProcessGroup) {
		childProcess.kill('SIGTERM');
		return;
	}

	try {
		process.kill(-processId, 'SIGTERM');
	} catch (error) {
		const processAlreadyExited =
			error instanceof Error && 'code' in error && error.code === 'ESRCH';
		if (!processAlreadyExited) {
			throw error;
		}
	}
};

const stopChildProcesses = (): void => {
	if (isShuttingDown) {
		return;
	}
	isShuttingDown = true;

	for (const childProcess of childProcesses) {
		stopChildProcess(childProcess);
	}
};

const waitForExit = async (
	childProcess: ChildProcess,
	command: readonly string[]
): Promise<ProcessExit> => {
	const [code, signal] = (await once(childProcess, 'exit')) as [
		number | null,
		NodeJS.Signals | null,
	];
	return {
		code: code ?? (signal ? 1 : 0),
		command: `bun ${command.join(' ')}`,
	};
};

for (const signal of TERMINATION_SIGNALS) {
	process.once(signal, stopChildProcesses);
}

const exitPromises: Promise<ProcessExit>[] = [];
for (const command of DEVELOPMENT_COMMANDS) {
	const childProcess = spawn('bun', command, {
		cwd: import.meta.dirname.replace(/\/scripts$/u, ''),
		detached: process.platform !== 'win32',
		stdio: 'inherit',
	});
	childProcesses.push(childProcess);
	exitPromises.push(waitForExit(childProcess, command));
}

const firstExit = await Promise.race(exitPromises);
stopChildProcesses();
await Promise.all(exitPromises);

if (firstExit.code !== 0 && !process.exitCode) {
	console.error(`${firstExit.command} exited with code ${firstExit.code}.`);
	process.exitCode = firstExit.code;
}
