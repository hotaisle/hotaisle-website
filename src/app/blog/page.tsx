import { BlogIndex } from '@/components/blog/BlogIndex.tsx';
import { getAllBlogPosts } from '@/lib/content.ts';
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

export default function BlogPage() {
	const posts = getAllBlogPosts();

	return (
		<div className="container mx-auto min-h-screen px-6 py-8 md:py-12">
			<div className="mb-12">
				<h1 className="mb-4 font-extrabold text-4xl tracking-tight md:text-5xl">Blog</h1>
				<p className="text-muted-foreground text-xl">
					Latest news and updates from Hot Aisle
				</p>
			</div>

			<BlogIndex posts={posts} />
		</div>
	);
}
