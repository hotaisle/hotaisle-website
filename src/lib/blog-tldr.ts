const TLDR_BLOCKQUOTE_REGEX =
	/<blockquote>\s*<p><strong>TL;DR:?<\/strong>\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi;

export function enhanceBlogTldrBlocks(html: string): string {
	return html.replace(
		TLDR_BLOCKQUOTE_REGEX,
		(_match, summary: string) =>
			`<aside aria-label="TL;DR" class="blog-tldr"><p class="blog-tldr__label">TL;DR</p><p class="blog-tldr__summary">${summary.trim()}</p></aside>`
	);
}
