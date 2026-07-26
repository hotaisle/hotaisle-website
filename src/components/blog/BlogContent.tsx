import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard.tsx';
import type { BlogAuthorProfile } from '@/lib/load-blog-posts.ts';

interface BlogContentProps {
	authorProfile?: BlogAuthorProfile;
	contentHtml: string;
	haFooter?: boolean;
}

function HotAisleFooter() {
	return (
		<section
			aria-labelledby="contribute-to-hot-aisle"
			className="mt-12 border-border border-t pt-8"
		>
			<h2 className="mb-4 font-bold text-2xl" id="contribute-to-hot-aisle">
				Contribute to Hot Aisle
			</h2>
			<p className="mb-4">
				The Hot Aisle website is open source under the MIT License and welcomes
				contributions from the community. Whether you want to fix a typo, improve
				documentation, or share your own technical content, we'd love to have your input.
			</p>
			<p>
				<span className="inline-label-group">
					<strong>Visit our GitHub repository:</strong>
					<a
						href="https://github.com/hotaisle/hotaisle-website"
						rel="noopener"
						target="_blank"
					>
						github.com/hotaisle/hotaisle-website
					</a>
				</span>
			</p>
		</section>
	);
}

export function BlogContent({ authorProfile, contentHtml, haFooter = false }: BlogContentProps) {
	return (
		<>
			{/** biome-ignore lint/security/noDangerouslySetInnerHtml: trusted repository content */}
			<div dangerouslySetInnerHTML={{ __html: contentHtml }} />
			{authorProfile ? <BlogAuthorCard profile={authorProfile} /> : null}
			{haFooter ? <HotAisleFooter /> : null}
		</>
	);
}
