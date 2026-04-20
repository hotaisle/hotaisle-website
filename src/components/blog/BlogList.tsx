import { Calendar } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import type { BlogPost } from '@/lib/content.ts';
import { cn } from '@/lib/utils.ts';

const PUBLISH_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	timeZone: 'UTC',
});

const GUEST_TAG = 'Guest';

export function BlogList({ posts }: { posts: BlogPost[] }) {
	return (
		<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{posts.map((post, index) => {
				const isLatest = index === 0;
				const isGuestPost = post.tags?.includes(GUEST_TAG) ?? false;

				return (
					<AppLink
						className={cn(
							'group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg dark:hover:border-hot-orange/50',
							isGuestPost &&
								'border-hot-orange/40 bg-linear-to-br from-hot-orange/10 via-card to-card shadow-hot-orange/10',
							isLatest &&
								'border-hot-orange bg-hot-orange/5 shadow-hot-orange/10 shadow-lg hover:border-hot-orange/70'
						)}
						href={`/blog/${post.slug}`}
						key={post.slug}
					>
						{/* Image */}
						<div className="relative h-48 w-full overflow-hidden bg-muted">
							{post.coverImage ? (
								<OptimizedImage
									alt={post.title}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
									height={200}
									src={post.coverImage}
									width={200}
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
									<span className="font-bold text-4xl opacity-20">HA</span>
								</div>
							)}
						</div>

						{/* Content */}
						<div className="flex flex-1 flex-col p-6">
							<div className="mb-3 flex items-center gap-2 text-muted-foreground text-xs">
								<div className="flex min-w-0 items-center gap-2">
									{isLatest ? (
										<span className="rounded-full bg-hot-orange px-2 py-1 font-semibold text-[10px] text-white uppercase tracking-[0.2em]">
											Latest
										</span>
									) : null}
									<Calendar size={14} />
									<time dateTime={post.date}>
										{PUBLISH_DATE_FORMATTER.format(new Date(post.date))}
									</time>
								</div>
								{isGuestPost ? (
									<span className="ml-auto rounded-full border border-hot-orange/30 bg-hot-orange/10 px-2 py-1 font-semibold text-[10px] text-hot-orange uppercase tracking-[0.2em]">
										Guest Feature
									</span>
								) : null}
							</div>

							<h3 className="mb-2 line-clamp-2 font-bold text-xl transition-colors group-hover:text-hot-orange">
								{post.title}
							</h3>

							<p className="mb-4 line-clamp-3 flex-1 text-muted-foreground text-sm">
								{post.description}
							</p>

							<div className="mt-auto flex flex-wrap gap-2">
								{post.tags?.slice(0, 3).map((tag: string) => (
									<span
										className="rounded bg-secondary px-2 py-1 text-secondary-foreground text-xs"
										key={tag}
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</AppLink>
				);
			})}
		</div>
	);
}
