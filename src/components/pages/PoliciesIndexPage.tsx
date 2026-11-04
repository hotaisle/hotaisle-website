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
				<header className="border-border border-b py-12 md:py-14">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h1 className="text-foreground text-5xl font-black tracking-tighter md:text-7xl">
							Policies, clearly stated
						</h1>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
							The documents that govern Hot Aisle services, infrastructure, and shared
							responsibilities.
						</p>
					</div>
				</header>

				<section className="py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div className="border-border border-y lg:col-start-2">
							{POLICIES.map((policy) => (
								<AppLink
									className="group border-border hover:bg-muted/35 grid gap-5 border-b py-7 transition-colors last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-start sm:px-5"
									href={`/policies/${policy.slug}`}
									key={policy.slug}
								>
									<div>
										<h2 className="text-foreground text-xl font-bold">
											{policy.title}
										</h2>
										<p className="text-muted-foreground mt-3 leading-relaxed">
											{policy.description}
										</p>
									</div>
									<span className="text-hot-orange-contrast group-hover:text-foreground text-sm font-medium transition-colors">
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
