const MACHINE_TYPES = ['vm', 'bm'] as const;
const MACHINE_STATUSES = ['reserved', 'deleted'] as const;

export type MachineType = (typeof MACHINE_TYPES)[number];
export type MachineStatus = (typeof MACHINE_STATUSES)[number];

export interface MachineStatusEvent {
	gpuCount?: number;
	status: MachineStatus;
	type: MachineType;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isMachineType(value: string): value is MachineType {
	return MACHINE_TYPES.includes(value as MachineType);
}

function isMachineStatus(value: string): value is MachineStatus {
	return MACHINE_STATUSES.includes(value as MachineStatus);
}

function normalizeGpuCount(value: unknown): number | undefined {
	if (value === undefined) {
		return;
	}

	if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
		return;
	}

	return value;
}

export function parseMachineStatusEvent(payload: unknown): MachineStatusEvent | null {
	if (!isRecord(payload)) {
		return null;
	}

	const normalizedType =
		typeof payload.type === 'string' ? payload.type.trim().toLowerCase() : null;
	const normalizedStatus =
		typeof payload.status === 'string' ? payload.status.trim().toLowerCase() : null;
	const normalizedGpuCount = normalizeGpuCount(payload.gpuCount);

	if (!(normalizedType && normalizedStatus)) {
		return null;
	}

	if (!(isMachineType(normalizedType) && isMachineStatus(normalizedStatus))) {
		return null;
	}

	if (normalizedType === 'vm' && normalizedGpuCount === undefined) {
		return null;
	}

	return {
		gpuCount: normalizedGpuCount,
		status: normalizedStatus,
		type: normalizedType,
	};
}
