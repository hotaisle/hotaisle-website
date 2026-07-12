import { BlogList } from '@/components/blog/BlogList.tsx';
import type { BlogPost } from '@/lib/content.ts';

interface BlogIndexProps {
	posts: BlogPost[];
}

export function BlogIndex({ posts }: BlogIndexProps) {
	const sortedPosts = [...posts].sort((left, right) => {
		const rightTime = new Date(right.date).getTime();
		const leftTime = new Date(left.date).getTime();
		if (rightTime === leftTime) {
			return left.slug.localeCompare(right.slug);
		}
		return rightTime - leftTime;
	});

	return <BlogList posts={sortedPosts} />;
}
