import type { BlogAuthorProfile, GeneratedBlogPost } from '@/lib/load-blog-posts.ts';

export interface PageData {
	author?: string;
	authorProfile?: BlogAuthorProfile;
	contentHtml: string;
	coverImage?: string;
	coverImageDark?: string;
	date?: string;
	description?: string;
	haFooter?: boolean;
	metaDescription?: string;
	metaKeywords?: string;
	metaTitle?: string;
	slug: string;
	tags?: string[];
	title: string;
}

export type BlogPost = GeneratedBlogPost;

export function sortBlogPosts(posts: readonly BlogPost[]): BlogPost[] {
	return [...posts].sort(
		(left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
	);
}
