import type { BlogAuthorProfile } from '@/generated/blog-data.ts';
import { BLOG_POSTS } from '@/generated/blog-data.ts';
import { POLICIES } from '@/generated/static-content-data.ts';

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

export type BlogPost = PageData & {
	coverImage?: string;
	coverImageDark?: string;
	date: string;
	tags?: string[];
};

const BLOG_POSTS_BY_SLUG = new Map(BLOG_POSTS.map((post) => [post.slug, post]));
const POLICIES_BY_SLUG = new Map(POLICIES.map((policy) => [policy.slug, policy]));

export function getPageContent(category: 'policies' | 'blog', slug: string): PageData | null {
	if (category === 'blog') {
		return BLOG_POSTS_BY_SLUG.get(slug) ?? null;
	}

	return POLICIES_BY_SLUG.get(slug) ?? null;
}

export function getAllSlugs(category: 'policies' | 'blog'): string[] {
	if (category === 'blog') {
		return BLOG_POSTS.map((post) => post.slug);
	}

	return POLICIES.map((policy) => policy.slug);
}

export function getAllBlogPosts(): BlogPost[] {
	const sortedPosts = [...BLOG_POSTS].sort(
		(left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
	);
	return sortedPosts;
}
