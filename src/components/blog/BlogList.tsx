import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import type { BlogPost } from '@/lib/content.ts';

const PUBLISH_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
	day: 'numeric',
	month: 'long',
	timeZone: 'UTC',
	year: 'numeric',
});

const GUEST_TAG = 'Guest';
const GRID_FILLER_KEYS = ['first', 'second'] as const;

export function BlogList({ posts }: { posts: BlogPost[] }) {
	const twoColumnFillers = (2 - (posts.length % 2)) % 2;
	const threeColumnFillers = (3 - (posts.length % 3)) % 3;

	return (
		<div className="ha-inset-dividers ha-inset-dividers-md-2 ha-inset-dividers-xl-3 border-border bg-border grid gap-y-px border md:grid-cols-2 xl:grid-cols-3">
			{posts.map((post, index) => {
				const isLatest = index === 0;
				const isGuestPost = post.tags.includes(GUEST_TAG);
				const postNumber = String(index + 1).padStart(2, '0');

				return (
					<AppLink
						className="group bg-background hover:bg-muted/45 focus-visible:bg-muted flex min-h-full flex-col transition-colors focus-visible:outline-none"
						href={`/blog/${post.slug}`}
						key={post.slug}
					>
						<div className="border-border relative aspect-16/10 w-full overflow-hidden border-b bg-white dark:bg-black">
							{post.coverImage ? (
								<>
									<OptimizedImage
										alt={post.title}
										className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${post.coverImageDark ? 'dark:hidden' : ''}`}
										height={450}
										src={post.coverImage}
										width={720}
									/>
									{post.coverImageDark ? (
										<OptimizedImage
											alt=""
											aria-hidden="true"
											className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 dark:block"
											height={450}
											src={post.coverImageDark}
											width={720}
										/>
									) : null}
								</>
							) : null}
						</div>

						<div className="flex flex-1 flex-col p-5 sm:p-6">
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.12em] uppercase">
								<span className="text-hot-orange-contrast">
									{postNumber}
									{isLatest ? ' / Latest' : ''}
								</span>
								<time className="text-muted-foreground" dateTime={post.date}>
									{PUBLISH_DATE_FORMATTER.format(new Date(post.date))}
								</time>
								{isGuestPost ? (
									<span className="border-border text-muted-foreground border-l pl-3">
										Guest feature
									</span>
								) : null}
							</div>

							<h2 className="text-foreground group-hover:text-hot-orange-contrast mt-5 line-clamp-2 text-2xl font-medium transition-colors">
								{post.title}
							</h2>

							<p className="text-muted-foreground mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">
								{post.description}
							</p>

							<div className="border-border text-muted-foreground mt-6 flex flex-wrap gap-x-3 gap-y-1 border-t pt-4 font-mono text-xs tracking-widest uppercase">
								{post.tags.slice(0, 3).map((tag: string) => (
									<span key={tag}>{tag}</span>
								))}
							</div>
						</div>
					</AppLink>
				);
			})}
			{GRID_FILLER_KEYS.slice(0, twoColumnFillers).map((key) => (
				<div
					aria-hidden="true"
					className="ha-divider-md bg-background hidden md:block xl:hidden"
					key={`two-column-filler-${key}`}
				/>
			))}
			{GRID_FILLER_KEYS.slice(0, threeColumnFillers).map((key, index) => (
				<div
					aria-hidden="true"
					className={`bg-background hidden xl:block ${(posts.length + index) % 3 === 0 ? 'ha-no-divider-xl' : 'ha-divider-xl'}`}
					key={`three-column-filler-${key}`}
				/>
			))}
		</div>
	);
}
