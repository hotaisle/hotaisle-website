import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const POLICIES = [
	{
		description: 'The terms that govern use of Hot Aisle services.',
		slug: 'terms-of-service',
		title: 'Terms of Service',
	},
	{
		description: 'How Hot Aisle handles customer and account data.',
		slug: 'privacy-policy',
		title: 'Privacy Policy',
	},
	{
		description: 'The permitted use of Hot Aisle infrastructure.',
		slug: 'acceptable-use-policy',
		title: 'Acceptable Use Policy',
	},
	{
		description: 'Security controls, practices, and compliance information.',
		slug: 'security-and-compliance',
		title: 'Security and Compliance',
	},
	{
		description: 'Where Hot Aisle responsibilities end and customer responsibilities begin.',
		slug: 'shared-responsibility-model',
		title: 'Shared Responsibility',
	},
	{
		description: 'How scheduled and emergency maintenance is handled.',
		slug: 'maintenance-policy',
		title: 'Maintenance Policy',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Legal documents, compliance information, and operational policies for Hot Aisle services.',
		path: '/policies',
		title: 'Legal and Policies',
	});
}

export default function PoliciesIndexPage() {
	return (
		<main className="animation-fade-in bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Legal and policies</p>
						<div>
							<h1 className="font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Policies, clearly stated.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								The documents that govern Hot Aisle services, infrastructure, and
								shared responsibilities.
							</p>
						</div>
					</div>
				</header>

				<section className="pt-16 pb-20 md:pt-20">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Documents</p>
						<div className="border-border border-y">
							{POLICIES.map((policy, index) => (
								<AppLink
									className="group grid gap-5 border-border border-b py-7 transition-colors last:border-b-0 hover:bg-muted/35 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:px-5"
									href={`/policies/${policy.slug}`}
									key={policy.slug}
								>
									<p className="font-mono text-hot-orange-contrast text-xs">
										{String(index + 1).padStart(2, '0')}
									</p>
									<div>
										<h2 className="font-bold text-foreground text-xl">
											{policy.title}
										</h2>
										<p className="mt-3 text-muted-foreground leading-relaxed">
											{policy.description}
										</p>
									</div>
									<span className="font-medium text-hot-orange-contrast text-sm transition-colors group-hover:text-foreground">
										Read policy
									</span>
								</AppLink>
							))}
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
