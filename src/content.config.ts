import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blogLoader } from '@/lib/load-blog-posts.ts';

const blog = defineCollection({
	loader: blogLoader(),
	schema: z.object({
		author: z.string().optional(),
		authorProfile: z
			.object({
				bio: z.string(),
				links: z.array(
					z.object({
						label: z.string(),
						url: z.string(),
						value: z.string(),
					})
				),
				name: z.string(),
				note: z.string().optional(),
			})
			.optional(),
		contentHtml: z.string(),
		coverImage: z.string().optional(),
		coverImageDark: z.string().optional(),
		date: z.string(),
		description: z.string(),
		haFooter: z.boolean(),
		metaDescription: z.string().optional(),
		metaKeywords: z.string().optional(),
		metaTitle: z.string().optional(),
		tags: z.array(z.string()),
		title: z.string(),
	}),
});

const policies = defineCollection({
	loader: glob({
		base: './src/content/policies',
		pattern: '*.md',
	}),
	schema: z.object({
		date: z.coerce.date().optional(),
		description: z.string().optional(),
		title: z.string(),
	}),
});

export const collections = { blog, policies };
