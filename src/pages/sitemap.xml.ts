import type { APIRoute } from 'astro';

const SITEMAP_URL = new URL('/sitemap-0.xml', 'https://hotaisle.xyz').toString();
const XML_CONTENT_TYPE = 'application/xml; charset=utf-8';

const COMPATIBILITY_SITEMAP_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${SITEMAP_URL}</loc>
	</sitemap>
</sitemapindex>
`;

export const GET: APIRoute = () =>
	new Response(COMPATIBILITY_SITEMAP_INDEX, {
		headers: {
			'content-type': XML_CONTENT_TYPE,
		},
	});
