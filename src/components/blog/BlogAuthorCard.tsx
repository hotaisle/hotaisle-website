import type { BlogAuthorProfile } from '@/lib/load-blog-posts.ts';

interface BlogAuthorCardProps {
	profile: BlogAuthorProfile;
}

export function BlogAuthorCard({ profile }: BlogAuthorCardProps) {
	const namePrefix = `${profile.name} `;
	const bioWithoutName = profile.bio.startsWith(namePrefix)
		? profile.bio.slice(namePrefix.length)
		: profile.bio;

	return (
		<section aria-labelledby="about-the-author" className="mt-12 border-border border-t pt-8">
			<h2 className="mb-4 font-bold text-2xl" id="about-the-author">
				About the Author
			</h2>
			{profile.note ? (
				<p className="mb-4 text-muted-foreground italic">{profile.note}</p>
			) : null}
			<p className="mb-6">
				<span className="inline-label-group">
					<strong>{profile.name}</strong>
					<span>{bioWithoutName}</span>
				</span>
			</p>
			<ul className="space-y-2">
				{profile.links.map(({ label, url, value }) => (
					<li key={label}>
						<span className="inline-label-group">
							<strong>{label}:</strong>
							<a href={url} rel="noopener" target="_blank">
								{value}
							</a>
						</span>
					</li>
				))}
			</ul>
		</section>
	);
}
