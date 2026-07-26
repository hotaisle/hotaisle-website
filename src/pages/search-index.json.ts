import type { APIRoute } from 'astro';
import { buildSearchIndex } from '@/lib/search-index.ts';

const CACHE_CONTROL = 'public, max-age=3600, stale-while-revalidate=86400';

export const GET: APIRoute = async () => {
	const searchIndex = await buildSearchIndex();

	return Response.json(searchIndex, {
		headers: {
			'cache-control': CACHE_CONTROL,
		},
	});
};
