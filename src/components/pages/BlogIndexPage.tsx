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
				<div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
					<h1 className="max-w-3xl font-semibold text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
						Blog
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-8 sm:text-xl">
						Technical guides, operating notes, and the work behind the infrastructure.
					</p>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
				<div className="mb-5 flex items-center justify-end border-border border-t pt-4">
					<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.12em]">
						{posts.length} posts
					</p>
				</div>

				<BlogIndex posts={posts} />
			</main>
		</div>
	);
}
