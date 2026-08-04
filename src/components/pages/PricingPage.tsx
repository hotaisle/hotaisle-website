import { Check } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';
import {
	GRANDFATHERED_MI300X_VM_PRICE,
	MI300X_BARE_METAL_PRICE,
	MI300X_VM_PRICE,
} from '@/lib/pricing.ts';

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
					className="underline decoration-current/40 underline-offset-4 transition-colors hover:text-foreground"
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
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Header */}
			<div className="relative overflow-hidden border-border border-b px-6 py-20 text-center md:py-24">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-200 via-background to-background opacity-80 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950" />

				<div className="relative z-10 mx-auto max-w-4xl">
					<h1 className="mb-6 font-black text-5xl tracking-tighter md:text-7xl">
						Transparent <span className="text-hot-orange">Pricing</span>
					</h1>
					<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
						VMs stay self-service and pay-as-you-go. Full 8x bare-metal nodes are
						available on monthly terms.
					</p>
					<div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-left md:grid-cols-2">
						<div className="rounded-lg border border-border bg-card/90 p-5 backdrop-blur-sm">
							<p className="font-bold text-hot-orange-contrast text-sm uppercase tracking-wide">
								Virtual machines
							</p>
							<p className="mt-3 font-black text-3xl text-foreground md:text-4xl">
								{MI300X_VM_PRICE}
							</p>
							<p className="mt-2 text-muted-foreground text-sm">
								New customer rate. 1, 2, and 4x MI300X VMs, billed by the minute.
							</p>
						</div>
						<div className="rounded-lg border border-border bg-card/90 p-5 backdrop-blur-sm">
							<p className="font-bold text-hot-orange-contrast text-sm uppercase tracking-wide">
								8x bare metal
							</p>
							<p className="mt-3 font-black text-3xl text-foreground md:text-4xl">
								{MI300X_BARE_METAL_PRICE}
							</p>
							<p className="mt-2 text-muted-foreground text-sm">
								Dedicated full-node access. One-month minimum.
							</p>
						</div>
					</div>
					<p className="mt-5 text-muted-foreground text-sm">
						Existing customers with running compute remain grandfathered at{' '}
						<strong className="font-medium text-foreground">
							{GRANDFATHERED_MI300X_VM_PRICE}
						</strong>
						.{' '}
						<AppLink
							className="font-medium text-hot-orange-contrast hover:text-foreground"
							href="/blog/why-we-raised-our-mi300x-price"
						>
							Why we raised our MI300X price
						</AppLink>
						.
					</p>
				</div>
			</div>

			{/* Pricing Grid */}
			<div className="container relative z-20 mx-auto -mt-12 px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Small Tier */}
					<div className="flex flex-col rounded-lg border border-border bg-card/90 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:border-hot-orange/50 hover:shadow-2xl">
						<div className="mb-6">
							<p className="mb-2 font-bold text-hot-orange-contrast text-sm uppercase tracking-wide">
								VM
							</p>
							<h2 className="mb-2 font-bold text-2xl text-foreground">Small</h2>
							<div className="mb-2 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>1x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<p className="mb-3 font-bold text-foreground">{MI300X_VM_PRICE}</p>
							<p className="text-muted-foreground text-sm">
								Ideal for experimentation and development.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>
									<strong className="text-foreground">192GB</strong> HBM3 Memory
								</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>8 or 13 CPU Cores</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>224GB System RAM</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>12TB NVMe Storage</span>
							</li>
						</ul>
						<AppLink
							className="w-full rounded-lg bg-foreground py-3 text-center font-bold text-background transition-colors hover:bg-foreground/90"
							href="/quick-start"
						>
							Deploy Small
						</AppLink>
					</div>

					{/* Medium Tier */}
					<div className="flex flex-col rounded-lg border border-border bg-card/90 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:border-hot-orange/50 hover:shadow-2xl">
						<div className="mb-6">
							<p className="mb-2 font-bold text-hot-orange-contrast text-sm uppercase tracking-wide">
								VM
							</p>
							<h2 className="mb-2 font-bold text-2xl text-foreground">Medium</h2>
							<div className="mb-2 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>2x &amp; 4x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<p className="mb-3 font-bold text-foreground">{MI300X_VM_PRICE}</p>
							<p className="text-muted-foreground text-sm">
								For model fine-tuning and medium workloads.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>
									<strong className="text-foreground">384GB or 768GB</strong> HBM3
								</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>26 or 52 CPU Cores</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>448GB or 896GB RAM</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>12TB NVMe Storage</span>
							</li>
						</ul>
						<AppLink
							className="w-full rounded-lg bg-foreground py-3 text-center font-bold text-background transition-colors hover:bg-foreground/90"
							href="/quick-start"
						>
							Deploy Medium
						</AppLink>
					</div>

					{/* Large Tier */}
					<div className="flex flex-col rounded-lg border border-border bg-card/90 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:border-hot-orange/50 hover:shadow-2xl">
						<div className="mb-6">
							<p className="mb-2 font-bold text-hot-orange-contrast text-sm uppercase tracking-wide">
								Bare metal
							</p>
							<h2 className="mb-2 font-bold text-2xl text-foreground">Large</h2>
							<div className="mb-2 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>8x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<div className="mb-3 space-y-1">
								<p className="font-bold text-foreground">
									{MI300X_BARE_METAL_PRICE}
									<span className="font-normal text-muted-foreground">
										{' '}
										bare metal, one-month minimum
									</span>
								</p>
							</div>
							<p className="text-muted-foreground text-sm">
								Dedicated full-node power for training and massive inference.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>
									<strong className="text-foreground">1.5 TB</strong> HBM3 Memory
								</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>Dedicated bare-metal option</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>64 or 102 CPU Cores</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>2TB RAM + 122TB NVMe</span>
							</li>
						</ul>
						<AppLink
							className="w-full rounded-lg bg-foreground py-3 text-center font-bold text-background transition-colors hover:bg-foreground/90"
							href="/contact"
						>
							Reserve Bare Metal
						</AppLink>
					</div>
				</div>
			</div>

			{/* Features List */}
			<div className="container mx-auto mt-24 max-w-7xl px-6">
				<section className="border-border border-y py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
						<p className="ha-briefing-label">Included by default</p>
						<h2 className="font-black text-4xl text-foreground md:text-5xl">
							All plans <span className="text-hot-orange-contrast">include</span>
						</h2>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
						{INCLUDED_CAPABILITIES.map((capability) => (
							<div className="min-h-56 bg-background p-8" key={capability.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{capability.title}
								</h3>
								<p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
									{capability.description}
								</p>
							</div>
						))}
					</div>
				</section>
			</div>

			{/* Quick Start Section */}
			<div className="container mx-auto mt-16 max-w-7xl px-6">
				<div className="border border-border bg-muted/35">
					<div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
						<div>
							<p className="ha-briefing-label">Quick start</p>
							<h3 className="mt-4 font-medium text-2xl text-foreground">
								From terminal to isolated compute.
							</h3>
							<p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
								Create your team, add credits, and provision AMD GPU compute in
								under 60 seconds.
							</p>
						</div>
						<AppLink
							className="inline-flex min-h-12 items-center justify-center bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-85"
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
