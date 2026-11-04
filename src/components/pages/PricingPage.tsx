import { Check } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';
import { MI300X_BARE_METAL_PRICE, MI300X_VM_PRICE } from '@/lib/pricing.ts';

const INCLUDED_CAPABILITIES = [
	{
		description: 'Enterprise-grade hardware stability.',
		title: 'Dell XE9680 chassis',
	},
	{
		description: (
			<>
				Located in our{' '}
				<AppLink
					className="hover:text-foreground underline decoration-current/40 underline-offset-4 transition-colors"
					href="/datacenter"
				>
					secure Michigan facility
				</AppLink>
				.
			</>
		),
		title: '100% green datacenter',
	},
	{
		description: 'RoCEv2 for ultra-low latency clusters.',
		title: '8x400G networking',
	},
	{
		description: 'SSH, BMC, iDRAC: you control it all.',
		title: 'Full root access',
	},
	{
		description: 'Secure multi-node environments with public IP and firewall control.',
		title: 'Private isolated networking',
	},
	{
		description: 'Direct Slack channel with our engineers.',
		title: 'White glove support',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Transparent AMD GPU pricing from Hot Aisle with $2.99 hourly MI300X VM billing and 8x MI300X bare-metal monthly terms.',
		path: '/pricing',
		title: 'Pricing',
	});
}

export default function PricingPage() {
	return (
		<div className="animation-fade-in bg-background text-foreground pb-12">
			{/* Hero Header */}
			<div className="border-border relative overflow-hidden border-b px-6 py-14 text-center md:py-16">
				<div className="via-background to-background absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-200 opacity-80 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950" />

				<div className="relative z-10 mx-auto max-w-4xl">
					<h1 className="mb-6 text-5xl font-black tracking-tighter md:text-7xl">
						Transparent <span className="text-hot-orange">Pricing</span>
					</h1>
					<div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 text-left md:grid-cols-2">
						<div className="border-border bg-card/90 rounded-lg border p-5 backdrop-blur-sm">
							<p className="text-hot-orange-contrast text-sm font-bold tracking-wide uppercase">
								Virtual machines
							</p>
							<p className="text-foreground mt-3 text-3xl font-black md:text-4xl">
								{MI300X_VM_PRICE}
							</p>
							<p className="text-muted-foreground mt-2 text-sm">
								1, 2, and 4x MI300X VMs, billed by the minute.
							</p>
						</div>
						<div className="border-border bg-card/90 rounded-lg border p-5 backdrop-blur-sm">
							<p className="text-hot-orange-contrast text-sm font-bold tracking-wide uppercase">
								8x bare metal
							</p>
							<p className="text-foreground mt-3 text-3xl font-black md:text-4xl">
								{MI300X_BARE_METAL_PRICE}
							</p>
							<p className="text-muted-foreground mt-2 text-sm">
								Dedicated full-node access, billed by the minute.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Pricing Grid */}
			<div className="relative z-20 container mx-auto -mt-8 px-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Small Tier */}
					<div className="border-border bg-card/90 hover:border-hot-orange/50 flex flex-col rounded-lg border p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:shadow-2xl">
						<div className="mb-6">
							<p className="text-hot-orange-contrast mb-2 text-sm font-bold tracking-wide uppercase">
								VM
							</p>
							<h2 className="text-foreground mb-2 text-2xl font-bold">Small</h2>
							<div className="text-hot-orange-contrast mb-2 inline-flex items-baseline gap-1 text-4xl font-black">
								<span>1x</span>
								<span className="text-muted-foreground text-lg font-normal">
									MI300x
								</span>
							</div>
							<p className="text-foreground mb-3 font-bold">{MI300X_VM_PRICE}</p>
							<p className="text-muted-foreground text-sm md:min-h-14">
								Ideal for experimentation and development.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>
									<strong className="text-foreground">192GB</strong> HBM3 Memory
								</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>8 or 13 CPU Cores</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>224GB System RAM</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>12TB NVMe Storage</span>
							</li>
						</ul>
						<AppLink
							className="bg-foreground text-background hover:bg-foreground/90 w-full rounded-lg py-3 text-center font-bold transition-colors"
							href="/quick-start"
						>
							Deploy Small
						</AppLink>
					</div>

					{/* Medium Tier */}
					<div className="border-border bg-card/90 hover:border-hot-orange/50 flex flex-col rounded-lg border p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:shadow-2xl">
						<div className="mb-6">
							<p className="text-hot-orange-contrast mb-2 text-sm font-bold tracking-wide uppercase">
								VM
							</p>
							<h2 className="text-foreground mb-2 text-2xl font-bold">Medium</h2>
							<div className="text-hot-orange-contrast mb-2 inline-flex items-baseline gap-1 text-4xl font-black">
								<span>2x &amp; 4x</span>
								<span className="text-muted-foreground text-lg font-normal">
									MI300x
								</span>
							</div>
							<p className="text-foreground mb-3 font-bold">{MI300X_VM_PRICE}</p>
							<p className="text-muted-foreground text-sm md:min-h-14">
								For model fine-tuning and medium workloads.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>
									<strong className="text-foreground">384GB or 768GB</strong> HBM3
								</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>26 or 52 CPU Cores</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>448GB or 896GB RAM</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>12TB NVMe Storage</span>
							</li>
						</ul>
						<AppLink
							className="bg-foreground text-background hover:bg-foreground/90 w-full rounded-lg py-3 text-center font-bold transition-colors"
							href="/quick-start"
						>
							Deploy Medium
						</AppLink>
					</div>

					{/* Large Tier */}
					<div className="border-border bg-card/90 hover:border-hot-orange/50 flex flex-col rounded-lg border p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:shadow-2xl">
						<div className="mb-6">
							<p className="text-hot-orange-contrast mb-2 text-sm font-bold tracking-wide uppercase">
								Bare metal
							</p>
							<h2 className="text-foreground mb-2 text-2xl font-bold">Large</h2>
							<div className="text-hot-orange-contrast mb-2 inline-flex items-baseline gap-1 text-4xl font-black">
								<span>8x</span>
								<span className="text-muted-foreground text-lg font-normal">
									MI300x
								</span>
							</div>
							<p className="text-foreground mb-3 font-bold">
								{MI300X_BARE_METAL_PRICE}
							</p>
							<p className="text-muted-foreground text-sm md:min-h-14">
								Dedicated full-node power for training and massive inference.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>
									<strong className="text-foreground">1.5 TB</strong> HBM3 Memory
								</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>Dedicated bare-metal option</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>64 or 102 CPU Cores</span>
							</li>
							<li className="text-muted-foreground flex items-start">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>2TB RAM + 122TB NVMe</span>
							</li>
						</ul>
						<AppLink
							className="bg-foreground text-background hover:bg-foreground/90 w-full rounded-lg py-3 text-center font-bold transition-colors"
							href="/quick-start"
						>
							Deploy Bare Metal
						</AppLink>
					</div>
				</div>
			</div>

			{/* Features List */}
			<div className="container mx-auto mt-12 max-w-7xl px-6">
				<section className="border-border border-y py-12">
					<h2 className="text-foreground text-4xl font-black md:text-5xl">
						All plans <span className="text-hot-orange-contrast">include</span>
					</h2>

					<div className="ha-inset-dividers ha-inset-dividers-md-2 ha-inset-dividers-lg-3 bg-border mt-8 grid gap-y-px md:grid-cols-2 lg:grid-cols-3">
						{INCLUDED_CAPABILITIES.map((capability) => (
							<div className="bg-background p-6" key={capability.title}>
								<h3 className="text-foreground text-2xl font-bold">
									{capability.title}
								</h3>
								<p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
									{capability.description}
								</p>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* Quick Start Section */}
			<div className="container mx-auto mt-12 max-w-7xl px-6">
				<div className="border-border bg-muted/35 border">
					<div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
						<div>
							<h3 className="text-foreground text-2xl font-medium">
								From terminal to isolated compute
							</h3>
							<p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
								Create your team, add credits, and provision AMD GPU compute in
								under 60 seconds.
							</p>
						</div>
						<AppLink
							className="bg-foreground text-background inline-flex min-h-12 items-center justify-center px-6 py-3 font-medium transition-opacity hover:opacity-85"
							href="/quick-start"
						>
							Open quick start
						</AppLink>
					</div>
				</div>
			</div>
		</div>
	);
}
