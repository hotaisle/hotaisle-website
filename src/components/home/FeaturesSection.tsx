import { ArrowRight, Clock, Cpu, CreditCard, Lock, MemoryStick, Zap } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';

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
		description:
			'$1.99 per GPU per hour, billed by the minute. See exactly what you pay — no hidden fees, no surprises.',
		icon: CreditCard,
		label: 'Transparent',
		title: '$1.99/GPU/hr',
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
		<section className="border-border/60 border-t bg-background py-24">
			<div className="mx-auto max-w-7xl px-6">
				{/* Section header */}
				<div className="mb-16 text-center">
					<p className="mb-4 font-semibold text-hot-orange text-sm uppercase tracking-widest">
						Why Hot Aisle
					</p>
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
						GPU infrastructure that gets out of your way
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
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
								className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-hot-orange/30 hover:shadow-hot-orange/5 hover:shadow-lg"
								key={feature.title}
							>
								<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-hot-orange/10">
									<Icon className="h-5 w-5 text-hot-orange" />
								</div>
								<div className="mb-1 font-semibold text-hot-orange text-xs uppercase tracking-wider">
									{feature.label}
								</div>
								<h3 className="mb-2 font-semibold text-foreground text-lg">
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
				<div className="mt-12 text-center">
					<AppLink
						className="group inline-flex items-center gap-2 font-medium text-hot-orange text-sm transition hover:text-orange-500"
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
