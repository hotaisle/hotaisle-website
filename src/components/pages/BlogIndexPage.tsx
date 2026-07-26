import { BlogIndex } from '@/components/blog/BlogIndex.tsx';
import type { BlogPost } from '@/lib/content.ts';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Latest news, technical writing, interviews, and product updates from Hot Aisle.',
		image: '/assets/og/hot-aisle-inference-cloud.png',
		imageAlt: 'Hot Aisle branded share image',
		path: '/blog',
		title: 'Hot Aisle Blog',
	});
}

export default function BlogPage({ posts }: { posts: BlogPost[] }) {
	return (
		<div className="bg-background text-foreground">
			<header className="border-border border-b">
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-[minmax(10rem,0.45fr)_1fr] lg:px-8 lg:py-20">
					<p className="ha-briefing-label">Operator notes</p>
					<div>
						<h1 className="max-w-3xl font-semibold text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
							Blog
						</h1>
						<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-8 sm:text-xl">
							Technical guides, operating notes, and the work behind the
							infrastructure.
						</p>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
				<div className="mb-5 flex items-center justify-between border-border border-t pt-4">
					<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
						Latest dispatches
					</p>
					<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.12em]">
						{posts.length} posts
					</p>
				</div>

				<BlogIndex posts={posts} />
			</main>
		</div>
	);
}
