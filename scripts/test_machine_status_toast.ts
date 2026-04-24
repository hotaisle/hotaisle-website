import { spawnSync } from 'node:child_process';

const DEFAULT_SECRET = 'dev-secret';
const DEFAULT_STATUS = 'deleted';
const DEFAULT_TYPE = 'bm';
const DEFAULT_URL = 'https://localhost:4174/api/machine-status';
const VALID_STATUSES = ['reserved', 'deleted'] as const;
const VALID_TYPES = ['vm', 'bm'] as const;

type MachineType = 'vm' | 'bm';
type MachineStatus = 'reserved' | 'deleted';

interface MachineStatusPayload {
	gpuCount?: number;
	status: MachineStatus;
	type: MachineType;
}

const isMachineType = (value: string): value is MachineType => {
	return VALID_TYPES.includes(value as MachineType);
};

const isMachineStatus = (value: string): value is MachineStatus => {
	return VALID_STATUSES.includes(value as MachineStatus);
};

const parseArgs = (): MachineStatusPayload => {
	const [, , rawType = DEFAULT_TYPE, rawStatus = DEFAULT_STATUS, rawGpuCount] = process.argv;
	const type = rawType.trim().toLowerCase();
	const status = rawStatus.trim().toLowerCase();

	if (!isMachineType(type)) {
		throw new Error(`Invalid machine type "${rawType}". Use "bm" or "vm".`);
	}

	if (!isMachineStatus(status)) {
		throw new Error(`Invalid machine status "${rawStatus}". Use "reserved" or "deleted".`);
	}

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

const run = (): void => {
	const payload = parseArgs();
	const secret = process.env.HOTAISLE_SECRET ?? DEFAULT_SECRET;
	const url = process.env.HOTAISLE_MACHINE_STATUS_URL ?? DEFAULT_URL;

	const processResult = spawnSync(
		'curl',
		[
			'-k',
			'-i',
			'-X',
			'POST',
			url,
			'-H',
			'content-type: application/json',
			'-H',
			`x-hotaisle-auth: ${secret}`,
			'--data',
			JSON.stringify(payload),
		],
		{ stdio: 'inherit' }
	);

	if (processResult.status !== 0) {
		throw new Error(`curl exited with code ${processResult.status ?? 'unknown'}`);
	}
};

run();
