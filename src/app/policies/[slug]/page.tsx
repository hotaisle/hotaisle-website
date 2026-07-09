import { ChevronLeft, FileText } from 'lucide-react';
import NotFoundPage from '@/app/not-found.tsx';
import { AppLink } from '@/components/AppLink.tsx';
import { getAllSlugs, getPageContent } from '@/lib/content.ts';
import { createPageMetadata } from '@/lib/metadata.ts';

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
	return getAllSlugs('policies').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const page = getPageContent('policies', slug);

	if (!page) {
		return {};
	}

	const title = page.metaTitle ?? page.title;
	const description = page.metaDescription ?? page.description ?? '';

	return createPageMetadata({
		description,
		path: `/policies/${page.slug}`,
		title,
		type: 'article',
	});
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const page = getPageContent('policies', slug);

	if (!page) {
		return <NotFoundPage />;
	}

	return (
		<div className="container mx-auto max-w-5xl px-6 py-12">
			{/* Breadcrumb / Back */}
			{/* Breadcrumb / Back */}
			<div className="sticky top-0 z-50 -mx-6 mb-8 border-transparent border-b bg-background/80 px-6 py-4 backdrop-blur-md transition-all data-[stuck=true]:border-border">
				<AppLink
					className="inline-flex items-center font-medium text-muted-foreground text-sm transition-colors hover:text-hot-orange"
					href="/policies"
				>
					<ChevronLeft className="mr-1" size={16} />
					Back to Policies
				</AppLink>
			</div>

			{/* Header */}
			<div className="mb-4 pb-0">
				<div className="mb-4 flex items-center gap-3">
					<div className="rounded-lg bg-hot-orange/10 p-2">
						<FileText className="text-hot-orange" size={24} />
					</div>
					<span className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
						Legal Document
					</span>
				</div>
				<h1 className="font-black text-4xl text-foreground tracking-tighter md:text-5xl">
					{page.title}
				</h1>
				{page.description ? (
					<p className="mt-4 font-light text-muted-foreground text-xl">
						{page.description}
					</p>
				) : null}
			</div>

			{/* Content */}
			<article className="prose prose-lg dark:prose-invert max-w-none prose-code:rounded prose-blockquote:rounded-r-lg prose-blockquote:border-hot-orange prose-blockquote:bg-muted/50 prose-code:bg-muted prose-blockquote:px-4 prose-code:px-1 prose-blockquote:py-2 prose-headings:font-bold prose-a:text-hot-orange prose-blockquote:text-muted-foreground prose-code:text-hot-orange prose-headings:text-foreground prose-li:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-td:text-foreground prose-th:text-foreground prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline">
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: danger lover */}
				<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
			</article>
		</div>
	);
}
