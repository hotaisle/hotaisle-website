import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Build-time only: static pages embed a content fingerprint, without client-side fetching. */
export function versionedPublicAsset(source: string, contents: Uint8Array) {
	const version = createHash('sha256').update(contents).digest('hex').slice(0, 16);
	return `${source}?v=${version}`;
}

export function fingerprintPublicAsset(source: string) {
	return versionedPublicAsset(source, readFileSync(resolve('public', source.slice(1))));
}
