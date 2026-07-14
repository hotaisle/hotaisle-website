import { ArrowLeft } from 'lucide-react';
import NotFoundPage from '@/app/not-found.tsx';
import { AppLink } from '@/components/AppLink.tsx';
import { BlogContent } from '@/components/blog/BlogContent.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { type BlogPost, getAllBlogPosts, getAllSlugs, getPageContent } from '@/lib/content.ts';
import { createPageMetadata } from '@/lib/metadata.ts';
import './syntax-highlighting.css';

const DEFAULT_BLOG_IMAGE_ALT_SUFFIX = 'blog post cover image';

const PUBLISH_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'long',
	timeZone: 'UTC',
	year: 'numeric',
});

function sortPostsByDate() {
	return [...getAllBlogPosts()].sort((left, right) => {
		const rightTime = new Date(right.date).getTime();
		const leftTime = new Date(left.date).getTime();

		if (rightTime === leftTime) {
			return left.slug.localeCompare(right.slug);
		}

		return rightTime - leftTime;
	});
}

function AdjacentPostNavigation({
	nextPost,
	previousPost,
}: {
	nextPost?: BlogPost;
	previousPost?: BlogPost;
}) {
	const adjacentPosts = [
		previousPost ? { label: 'Previous post', post: previousPost } : null,
		nextPost ? { label: 'Next post', post: nextPost } : null,
	].filter((entry): entry is { label: string; post: BlogPost } => entry !== null);

	if (adjacentPosts.length === 0) {
		return null;
	}

	const hasBothAdjacentPosts = adjacentPosts.length === 2;

	return (
		<section className="border-border border-t">
			<nav
				aria-label="Adjacent blog posts"
				className="mx-auto grid max-w-7xl gap-px border-border border-x bg-border md:grid-cols-2"
			>
				{adjacentPosts.map(({ label, post }) => (
					<AppLink
						className={`group bg-background p-6 transition-colors hover:bg-muted/45 sm:p-8 ${hasBothAdjacentPosts ? '' : 'md:col-span-2'}`}
						href={`/blog/${post.slug}`}
						key={post.slug}
					>
						<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.12em]">
							{label}
						</p>
						<p className="mt-5 max-w-2xl font-medium text-2xl text-foreground transition-colors group-hover:text-hot-orange-contrast sm:text-3xl">
							{post.title}
						</p>
					</AppLink>
				))}
			</nav>
		</section>
	);
}

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
	const image = post.coverImage ?? '/assets/og/hot-aisle-inference-cloud.png';
	const imageAlt = `${post.title} ${DEFAULT_BLOG_IMAGE_ALT_SUFFIX}`;
	const publishedTime = post.date ? new Date(post.date).toISOString() : undefined;
	const authors = post.author ? [post.author] : undefined;
	const tags = post.tags?.length ? post.tags : undefined;
	const metadata = createPageMetadata({
		description,
		image,
		imageAlt,
		keywords: post.metaKeywords?.split(','),
		path: `/blog/${post.slug}`,
		title,
		type: 'article',
	});

	return {
		...metadata,
		openGraph: {
			...metadata.openGraph,
			authors,
			publishedTime,
			tags,
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
	const sortedPosts = sortPostsByDate();
	const postIndex = sortedPosts.findIndex(({ slug: postSlug }) => postSlug === post.slug);
	const previousPost = postIndex > 0 ? sortedPosts[postIndex - 1] : undefined;
	const nextPost = postIndex >= 0 ? sortedPosts[postIndex + 1] : undefined;

	return (
		<div className="animation-fade-in bg-background text-foreground">
			<header className="border-border border-b">
				<div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-20">
					<div className="flex flex-col items-start">
						<p className="ha-briefing-label">Field note</p>
						<AppLink
							className="group mt-8 inline-flex items-center font-mono text-muted-foreground text-xs uppercase tracking-[0.12em] transition-colors hover:text-foreground"
							href="/blog"
						>
							<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
							Back to Blog
						</AppLink>

						<h1 className="mt-12 max-w-3xl font-semibold text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
							{post.title}
						</h1>

						<div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-border border-t pt-4 font-mono text-muted-foreground text-xs uppercase tracking-[0.12em]">
							<time dateTime={post.date}>{prettyDate}</time>
							{post.author ? (
								<p className="border-border border-l pl-4">
									<span>By </span>
									{post.authorProfile ? (
										<a
											className="text-foreground transition-colors hover:text-hot-orange-contrast"
											href="#about-the-author"
										>
											{post.author}
										</a>
									) : (
										<strong className="text-foreground">{post.author}</strong>
									)}
								</p>
							) : null}
						</div>

						{post.tags?.length ? (
							<div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.12em]">
								{post.tags.map((tag: string) => (
									<span key={tag}>{tag}</span>
								))}
							</div>
						) : null}
					</div>

					{post.coverImage ? (
						<figure className="border border-border bg-muted p-2 sm:p-3 lg:self-center">
							<OptimizedImage
								alt={post.title}
								className={`aspect-video w-full object-cover object-left ${post.coverImageDark ? 'dark:hidden' : ''}`}
								disableAvif
								height={900}
								src={post.coverImage}
								width={1200}
							/>
							{post.coverImageDark ? (
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="hidden aspect-video w-full object-cover object-left dark:block"
									disableAvif
									height={900}
									src={post.coverImageDark}
									width={1200}
								/>
							) : null}
						</figure>
					) : null}
				</div>
			</header>

			<article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:py-20">
				<div className="ha-blog-article prose prose-lg max-w-none prose-img:rounded-none prose-pre:rounded-none prose-img:border prose-img:border-border prose-a:text-hot-orange prose-blockquote:text-muted-foreground prose-code:text-hot-orange prose-headings:text-foreground prose-strong:text-foreground text-foreground leading-relaxed prose-headings:tracking-normal prose-img:shadow-none">
					<BlogContent
						authorProfile={post.authorProfile}
						contentHtml={post.contentHtml}
						haFooter={post.haFooter}
					/>
				</div>
			</article>

			<AdjacentPostNavigation nextPost={nextPost} previousPost={previousPost} />
		</div>
	);
}
