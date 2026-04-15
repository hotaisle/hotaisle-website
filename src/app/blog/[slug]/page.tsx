import { ArrowLeft, Calendar } from 'lucide-react';
import NotFoundPage from '@/app/not-found.tsx';
import { AppLink } from '@/components/AppLink.tsx';
import { BlogContent } from '@/components/blog/BlogContent.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { getAllSlugs, getPageContent } from '@/lib/content.ts';
import './syntax-highlighting.css';
const PUBLISH_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: 'UTC',
});

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
	return getAllSlugs('blog').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = getPageContent('blog', slug);

	if (!post) {
		return {};
	}

	const title = post.metaTitle ?? post.title;
	const description = post.metaDescription ?? post.description ?? '';
	const url = `https://hotaisle.xyz/blog/${post.slug}`;
	const image = post.coverImage ?? '/assets/og/hot-aisle-share.png';
	const publishedTime = post.date ? new Date(post.date).toISOString() : undefined;
	const authors = post.author ? [post.author] : undefined;
	const tags = post.tags?.length ? post.tags : undefined;

	return {
		title,
		description,
		alternates: {
			canonical: url,
		},
		robots: {
			follow: true,
			index: true,
		},
		openGraph: {
			title,
			description,
			locale: 'en_US',
			type: 'article',
			url,
			publishedTime,
			authors,
			tags,
			images: [
				{
					alt: post.title,
					height: 630,
					url: image,
					width: 1200,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [
				{
					alt: post.title,
					height: 630,
					url: image,
					width: 1200,
				},
			],
		},
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = getPageContent('blog', slug);

	if (!post) {
		return <NotFoundPage />;
	}

	let prettyDate: string | undefined;
	if (post.date) {
		prettyDate = PUBLISH_DATE_FORMATTER.format(new Date(post.date));
	}

	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			<div className="relative h-[50vh] min-h-100 w-full overflow-hidden border-border border-b bg-background">
				{post.coverImage && (
					<div className="absolute inset-0">
						<OptimizedImage
							alt={post.title}
							className="h-full w-full object-cover"
							height={720}
							src={post.coverImage}
							width={1280}
						/>
						<div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/30" />
					</div>
				)}
				<div className="container absolute inset-0 z-10 mx-auto flex max-w-4xl flex-col justify-end px-6 pb-12">
					<AppLink
						className="group mb-8 inline-flex items-center font-bold text-muted-foreground text-sm uppercase tracking-wide transition-colors hover:text-foreground"
						href="/blog"
					>
						<ArrowLeft
							className="mr-2 transition-transform group-hover:-translate-x-1"
							size={16}
						/>
						Back to Blog
					</AppLink>

					<div className="mb-6 flex flex-wrap gap-2">
						{post.tags?.map((tag: string) => (
							<span
								className="rounded-full border border-hot-orange/20 bg-hot-orange/10 px-3 py-1 font-bold text-hot-orange-contrast text-xs uppercase tracking-wider backdrop-blur-sm"
								key={tag}
							>
								{tag}
							</span>
						))}
					</div>

					<h1 className="mb-6 font-black text-4xl text-foreground leading-tight tracking-tighter drop-shadow-2xl md:text-6xl">
						{post.title}
					</h1>

					<div className="flex flex-wrap items-center gap-6 font-medium text-muted-foreground">
						<div className="flex items-center gap-2">
							<Calendar className="text-hot-orange" size={18} />
							<time dateTime={post.date}>{prettyDate}</time>
						</div>
						{post.author ? (
							<p>
								<span className="inline-label-group">
									<span>By:</span>
									{post.authorProfile ? (
										<a
											className="font-semibold text-foreground underline-offset-2 hover:text-hot-orange hover:underline"
											href="#about-the-author"
										>
											{post.author}
										</a>
									) : (
										<strong className="font-semibold text-foreground">
											{post.author}
										</strong>
									)}
								</span>
							</p>
						) : null}
					</div>
				</div>
			</div>

			<article className="container relative z-20 mx-auto -mt-10 max-w-6xl px-6">
				<div className="rounded-2xl border border-border bg-card p-8 shadow-xl md:p-12">
					<div className="prose prose-lg max-w-none prose-img:rounded-lg prose-a:text-hot-orange prose-blockquote:text-muted-foreground prose-code:text-hot-orange prose-headings:text-foreground prose-strong:text-foreground text-foreground leading-relaxed prose-img:shadow-md">
						<BlogContent
							authorProfile={post.authorProfile}
							contentHtml={post.contentHtml}
							haFooter={post.haFooter}
						/>
					</div>
				</div>

				<div className="mt-16 border-border border-t pt-16 text-center">
					<h3 className="mb-6 font-bold text-2xl">More from Hot Aisle</h3>
					<AppLink
						className="inline-flex rounded-full border border-border bg-muted px-8 py-3 font-bold text-foreground transition-all hover:border-hot-orange/30 hover:bg-muted/80"
						href="/blog"
					>
						Read More Articles
					</AppLink>
				</div>
			</article>
		</div>
	);
}
