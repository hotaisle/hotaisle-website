import { AppLink } from '@/components/AppLink.tsx';
import type { PageData } from '@/lib/content.ts';
import { createPageMetadata } from '@/lib/metadata.ts';

const POLICY_SUMMARIES: Record<string, string> = {
	'acceptable-use-policy':
		'Sets the rules for using Hot Aisle compute infrastructure responsibly.',
	'maintenance-policy': 'Explains how planned and emergency maintenance affects availability.',
	'privacy-policy': 'Explains how Hot Aisle handles data associated with visitors and customers.',
	'security-and-compliance':
		'Summarizes the security controls and compliance practices relevant to Hot Aisle services.',
	'shared-responsibility-model':
		'Clarifies what Hot Aisle operates and what customers are responsible for securing.',
	'terms-of-service': 'Defines the terms governing access to Hot Aisle services.',
};

export function generateMetadata(page: PageData) {
	const title = page.metaTitle ?? page.title;
	const description = page.metaDescription ?? page.description ?? '';

	return createPageMetadata({
		description,
		path: `/policies/${page.slug}`,
		title,
		type: 'article',
	});
}

export default function PolicyPage({ page }: { page: PageData }) {
	const policySummary = POLICY_SUMMARIES[page.slug] ?? page.description;

	return (
		<main className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Policy document</p>
							<AppLink
								className="mt-8 inline-flex border border-border px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
								href="/policies"
							>
								All policies
							</AppLink>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								{page.title}
							</h1>
							{page.description ? (
								<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
									{page.description}
								</p>
							) : null}
						</div>
					</div>
				</header>

				<section className="grid gap-8 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
					<aside className="lg:sticky lg:top-24">
						<p className="ha-briefing-label">Hot Aisle / legal</p>
						<p className="mt-5 max-w-xs text-muted-foreground text-sm leading-relaxed">
							{policySummary}
						</p>
					</aside>

					<article className="policy-document prose prose-lg dark:prose-invert max-w-none prose-code:bg-muted prose-a:text-hot-orange prose-code:text-hot-orange prose-headings:text-foreground prose-li:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-td:text-foreground prose-th:text-foreground hover:prose-a:underline">
						{/** biome-ignore lint/security/noDangerouslySetInnerHtml: policy content is generated from trusted local Markdown. */}
						<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
					</article>
				</section>
			</div>
		</main>
	);
}
