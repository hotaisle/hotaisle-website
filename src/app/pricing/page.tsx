import { Check } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const vmPrice = '$1.99/GPU/hr';
const bareMetalPrice = '$3.39/GPU/hr';

const INCLUDED_CAPABILITIES = [
	{
		description: 'Enterprise-grade hardware stability.',
		title: 'Dell XE9680 chassis',
	},
	{
		description: 'Located in our secure Michigan facility.',
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
			'Transparent AMD GPU pricing from Hot Aisle with hourly VM billing and 8x MI300x bare-metal monthly terms.',
		path: '/pricing',
		title: 'Pricing',
	});
}

export default function PricingPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* MI355x Announcement Banner */}
			<div className="animate-pulse bg-linear-to-r from-hot-orange to-red-600 px-4 py-3 text-center font-bold text-sm text-white md:text-base">
				🔥 We are accepting MI355x reservations!
				<AppLink className="ml-2 underline hover:text-white/90" href="/mi355x">
					Reserve now
				</AppLink>
			</div>

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
							<p className="font-bold text-hot-orange text-sm uppercase tracking-wide">
								Virtual machines
							</p>
							<p className="mt-3 font-black text-3xl text-foreground md:text-4xl">
								{vmPrice}
							</p>
							<p className="mt-2 text-muted-foreground text-sm">
								1, 2, 4x MI300x VMs. Billed by the minute.
							</p>
						</div>
						<div className="rounded-lg border border-border bg-card/90 p-5 backdrop-blur-sm">
							<p className="font-bold text-hot-orange text-sm uppercase tracking-wide">
								8x bare metal
							</p>
							<p className="mt-3 font-black text-3xl text-foreground md:text-4xl">
								{bareMetalPrice}
							</p>
							<p className="mt-2 text-muted-foreground text-sm">
								Dedicated full-node access. One-month minimum.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Pricing Grid */}
			<div className="container relative z-20 mx-auto -mt-12 px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Small Tier */}
					<div className="flex flex-col rounded-lg border border-border bg-card/90 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:border-hot-orange/50 hover:shadow-2xl">
						<div className="mb-6">
							<p className="mb-2 font-bold text-hot-orange text-sm uppercase tracking-wide">
								VM
							</p>
							<h2 className="mb-2 font-bold text-2xl text-foreground">Small</h2>
							<div className="mb-2 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>1x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<p className="mb-3 font-bold text-foreground">{vmPrice}</p>
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
							<p className="mb-2 font-bold text-hot-orange text-sm uppercase tracking-wide">
								VM
							</p>
							<h2 className="mb-2 font-bold text-2xl text-foreground">Medium</h2>
							<div className="mb-2 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>2x &amp; 4x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<p className="mb-3 font-bold text-foreground">{vmPrice}</p>
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
							<p className="mb-2 font-bold text-hot-orange text-sm uppercase tracking-wide">
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
									{bareMetalPrice}
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
						{INCLUDED_CAPABILITIES.map((capability, index) => (
							<div className="min-h-56 bg-background p-8" key={capability.title}>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{String(index + 1).padStart(2, '0')}
								</p>
								<h3 className="mt-10 font-bold text-2xl text-foreground">
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

			{/* Resources Section */}
			<div className="container mx-auto mt-16 max-w-4xl px-6 text-center">
				<div className="mt-12 rounded-xl border border-border bg-linear-to-r from-purple-900/20 to-blue-900/20 p-8 text-center">
					<h3 className="mb-2 font-bold text-xl">Accepting MI355x Reservations</h3>
					<p className="mb-6 text-muted-foreground">
						Be the first to access the next generation of AMD compute.
					</p>
					<AppLink
						className="rounded-lg bg-foreground px-6 py-2 font-bold text-background transition-colors hover:opacity-90"
						href="/mi355x"
					>
						Reserve Now
					</AppLink>
				</div>
			</div>
		</div>
	);
}
