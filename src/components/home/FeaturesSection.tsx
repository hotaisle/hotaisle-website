import { ArrowRight, Clock, Cpu, CreditCard, Lock, MemoryStick, Zap } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { MI300X_VM_PRICE } from '@/lib/pricing.ts';

const FEATURES = [
	{
		description:
			'Built exclusively for AMD MI300X. No NVIDIA tax. Pure AMD performance tuned for large AI workloads.',
		icon: Cpu,
		label: 'AMD Exclusive',
		title: 'AMD-Only Infrastructure',
	},
	{
		description:
			'192GB HBM3 per GPU. Run the largest frontier models without memory constraints holding you back.',
		icon: MemoryStick,
		label: 'High Memory',
		title: '192GB HBM3 Per GPU',
	},
	{
		description:
			'Go from zero to a running GPU instance in under 60 seconds. No queues, no waiting, no procurement process.',
		icon: Zap,
		label: 'Instant',
		title: '60-Second Deploy',
	},
	{
		description: `${MI300X_VM_PRICE}, billed by the minute. See exactly what you pay — no hidden fees, no surprises.`,
		icon: CreditCard,
		label: 'Transparent',
		title: MI300X_VM_PRICE,
	},
	{
		description:
			"Walk away whenever you want. No annual contracts, no minimum spend, no penalties. It's just cloud.",
		icon: Clock,
		label: 'Flexible',
		title: 'No Commitments',
	},
	{
		description:
			'SOC2 Type 2 certified and HIPAA compliant. Enterprise-grade physical and logical security you can trust.',
		icon: Lock,
		label: 'Secure',
		title: 'SOC2 + HIPAA',
	},
];

export function FeaturesSection() {
	return (
		<section className="border-border/60 bg-background border-t py-16">
			<div className="mx-auto max-w-7xl px-6">
				{/* Section header */}
				<div className="mb-16 text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						GPU infrastructure that gets out of your way
					</h2>
					<p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
						Everything you need to run serious AI workloads — none of the enterprise
						friction.
					</p>
				</div>

				{/* Feature cards grid */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{FEATURES.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								className="group border-border/60 bg-card hover:border-hot-orange/30 hover:shadow-hot-orange/5 relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
								key={feature.title}
							>
								<div className="bg-hot-orange/10 mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
									<Icon className="text-hot-orange h-5 w-5" />
								</div>
								<div className="text-hot-orange-contrast mb-1 text-xs font-semibold tracking-wider uppercase">
									{feature.label}
								</div>
								<h3 className="text-foreground mb-2 text-lg font-semibold">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>

				{/* Bottom CTA */}
				<div className="mt-8 text-center">
					<AppLink
						className="group text-hot-orange-contrast inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-80"
						href="/compute"
					>
						Explore the full infrastructure
						<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
					</AppLink>
				</div>
			</div>
		</section>
	);
}
