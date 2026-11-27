import { ResourceLinkList } from '@/components/ResourceLinkList.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const READ_POLICY_LABEL = 'Read policy';

const POLICIES = [
	{
		description: 'The terms that govern use of Hot Aisle services.',
		href: '/policies/terms-of-service',
		label: READ_POLICY_LABEL,
		title: 'Terms of Service',
	},
	{
		description: 'How Hot Aisle handles customer and account data.',
		href: '/policies/privacy-policy',
		label: READ_POLICY_LABEL,
		title: 'Privacy Policy',
	},
	{
		description: 'The permitted use of Hot Aisle infrastructure.',
		href: '/policies/acceptable-use-policy',
		label: READ_POLICY_LABEL,
		title: 'Acceptable Use Policy',
	},
	{
		description: 'Security controls, practices, and compliance information.',
		href: '/policies/security-and-compliance',
		label: READ_POLICY_LABEL,
		title: 'Security and Compliance',
	},
	{
		description: 'Where Hot Aisle responsibilities end and customer responsibilities begin.',
		href: '/policies/shared-responsibility-model',
		label: READ_POLICY_LABEL,
		title: 'Shared Responsibility',
	},
	{
		description: 'How scheduled and emergency maintenance is handled.',
		href: '/policies/maintenance-policy',
		label: READ_POLICY_LABEL,
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
		<div className="animation-fade-in bg-background text-foreground pt-4 lg:pt-8">
			<div className="ha-inset-dividers ha-inset-dividers-lg-2 container mx-auto grid max-w-6xl px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
				<header className="py-10 lg:pr-16 xl:pr-20">
					<h1 className="text-foreground max-w-sm text-5xl font-black tracking-tighter md:text-6xl">
						Policies
					</h1>
					<p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
						The documents that govern Hot Aisle services, infrastructure, and shared
						responsibilities.
					</p>
				</header>
				<div className="pb-10 lg:py-10 lg:pl-16">
					<ResourceLinkList resources={POLICIES} />
				</div>
			</div>
		</div>
	);
}
