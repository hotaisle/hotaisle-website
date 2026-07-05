import { FileText, Info, Lock, Server, Shield, Users } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Legal documents, compliance information, and operational policies for Hot Aisle services.',
		path: '/policies',
		title: 'Legal and Policies',
	});
}

const policies = [
	{
		title: 'Terms of Service',
		slug: 'terms-of-service',
		icon: FileText,
		desc: 'General terms governing the use of our services.',
	},
	{
		title: 'Privacy Policy',
		slug: 'privacy-policy',
		icon: Lock,
		desc: 'How we collect, use, and protect your data.',
	},
	{
		title: 'Acceptable Use Policy',
		slug: 'acceptable-use-policy',
		icon: Shield,
		desc: 'Rules for using our compute infrastructure.',
	},
	{
		title: 'Security & Compliance',
		slug: 'security-and-compliance',
		icon: Info,
		desc: 'Overview of our security measures and SOC 2 status.',
	},
	{
		title: 'Shared Responsibility',
		slug: 'shared-responsibility-model',
		icon: Users,
		desc: 'Defining our security breakdown vs client responsibility.',
	},
	{
		title: 'Maintenance Policy',
		slug: 'maintenance-policy',
		icon: Server,
		desc: 'Procedures for scheduled and emergency maintenance.',
	},
];

export default function PoliciesIndexPage() {
	return (
		<div className="container mx-auto px-6 py-12">
			<div className="mb-12">
				<h1 className="mb-4 font-black text-4xl tracking-tighter md:text-5xl">
					Legal & <span className="text-hot-orange">Policies</span>
				</h1>
				<p className="text-muted-foreground text-xl">
					Governance constraints and operational standards.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{policies.map((p) => (
					<AppLink
						className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-hot-orange/50 hover:shadow-lg"
						href={`/policies/${p.slug}`}
						key={p.slug}
					>
						<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-hot-orange/10">
							<p.icon
								className="text-foreground group-hover:text-hot-orange"
								size={24}
							/>
						</div>
						<h2 className="mb-2 font-bold text-foreground text-xl">{p.title}</h2>
						<p className="text-muted-foreground text-sm">{p.desc}</p>
					</AppLink>
				))}
			</div>
		</div>
	);
}
