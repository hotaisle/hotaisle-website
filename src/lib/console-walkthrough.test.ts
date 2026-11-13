import { describe, expect, test } from 'bun:test';
import { CONSOLE_WALKTHROUGH, walkthroughAssetURL } from '@/lib/console-walkthrough.ts';
import { versionedPublicAsset } from '@/lib/versioned-public-asset.ts';

const HASHED_MEDIA_URL = /\?v=[a-f0-9]{16}$/u;

describe('walkthrough cache versions', () => {
	test('changes the browser cache key only when the file contents change', () => {
		const original = new TextEncoder().encode('original video');
		const revised = new TextEncoder().encode('revised video');
		const path = '/assets/demo.mp4';
		const first = versionedPublicAsset(path, original);
		expect(first).toMatch(HASHED_MEDIA_URL);
		expect(first).toBe(versionedPublicAsset(path, original));
		expect(first).not.toBe(versionedPublicAsset(path, revised));
	});
	test.each([
		CONSOLE_WALKTHROUGH.src,
		CONSOLE_WALKTHROUGH.poster,
		CONSOLE_WALKTHROUGH.captions,
		CONSOLE_WALKTHROUGH.transcript,
	])('versions the shared media asset %s', (path) => {
		const url = walkthroughAssetURL(path);
		expect(url).toStartWith(`${path}?v=`);
		expect(url).toMatch(HASHED_MEDIA_URL);
		expect(url).toBe(walkthroughAssetURL(path));
	});
	test('preserves unrelated or already-versioned URLs and optional media', () => {
		expect(walkthroughAssetURL('/assets/other.mp4')).toBe('/assets/other.mp4');
		const current = walkthroughAssetURL(CONSOLE_WALKTHROUGH.src);
		expect(walkthroughAssetURL(current)).toBe(current);
		expect(walkthroughAssetURL(undefined)).toBeUndefined();
	});
});
