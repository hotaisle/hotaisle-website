import { Check, Server, Shield, Zap } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Transparent AMD GPU pricing from Hot Aisle with self-service hourly billing and no long-term contracts.',
		image: '/assets/compute/hero.png',
		imageAlt: 'Hot Aisle compute infrastructure',
		path: '/pricing',
		title: 'Pricing',
	});
}

export default function PricingPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* MI355x Announcement Banner */}
			<div className="animate-pulse bg-linear-to-r from-hot-orange to-red-600 px-4 py-3 text-center font-bold text-sm text-white md:text-base">
				🔥 We are now accepting MI355x reservations!
				<AppLink className="ml-2 underline hover:text-white/90" href="/mi355x">
					Reserve now
				</AppLink>
			</div>

			{/* Hero Header */}
			<div className="relative overflow-hidden border-border border-b px-6 py-24 text-center">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-200 via-background to-background opacity-80 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950" />
				<div className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hot-orange/10 blur-3xl" />

				<div className="relative z-10 mx-auto max-w-4xl">
					<h1 className="mb-6 font-black text-5xl tracking-tighter md:text-7xl">
						Transparent <span className="text-hot-orange">Pricing</span>
					</h1>
					<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
						<span className="font-bold text-foreground">$1.99/GPU/hr</span>.
						Self-service. No contracts. Billed by the minute.
					</p>
				</div>
			</div>

			{/* Pricing Grid */}
			<div className="container relative z-20 mx-auto -mt-12 px-6">
				{/* ... (Existing Pricing Grid) ... */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Small Tier */}
					<div className="flex flex-col rounded-2xl border border-border bg-card/90 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:border-hot-orange/50 hover:shadow-2xl">
						<div className="mb-6">
							<h2 className="mb-2 font-bold text-2xl text-foreground">Small</h2>
							<div className="mb-1 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>1x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
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
					<div className="relative flex flex-col rounded-2xl border-2 border-hot-orange bg-card p-8 shadow-[0_0_40px] shadow-hot-orange/10 backdrop-blur-md transition-all hover:-translate-y-2 hover:transform">
						<div className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg bg-hot-orange px-3 py-1 font-bold text-white text-xs">
							POPULAR
						</div>
						<div className="mb-6">
							<h2 className="mb-2 font-bold text-2xl text-foreground">Medium</h2>
							<div className="mb-1 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>2-4x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<p className="text-muted-foreground text-sm">
								For model fine-tuning and medium workloads.
							</p>
						</div>
						<ul className="mb-8 flex-1 space-y-4">
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-hot-orange" />
								<span>
									<strong className="text-foreground">384GB - 768GB</strong> HBM3
								</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-hot-orange" />
								<span>26 - 52 CPU Cores</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-hot-orange" />
								<span>448GB - 896GB RAM</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-hot-orange" />
								<span>12TB NVMe Storage</span>
							</li>
						</ul>
						<AppLink
							className="w-full rounded-lg bg-hot-orange py-3 text-center font-bold text-white shadow-hot-orange/20 shadow-lg transition-opacity hover:opacity-90"
							href="/quick-start"
						>
							Deploy Medium
						</AppLink>
					</div>

					{/* Large Tier */}
					<div className="flex flex-col rounded-2xl border border-border bg-card/90 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:transform hover:border-hot-orange/50 hover:shadow-2xl">
						<div className="mb-6">
							<h2 className="mb-2 font-bold text-2xl text-foreground">Large</h2>
							<div className="mb-1 inline-flex items-baseline gap-1 font-black text-4xl text-hot-orange-contrast">
								<span>8x</span>
								<span className="font-normal text-lg text-muted-foreground">
									MI300x
								</span>
							</div>
							<p className="text-muted-foreground text-sm">
								Full node power for training and massive inference.
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
								<span>BARE METAL Options</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>64 - 102 CPU Cores</span>
							</li>
							<li className="flex items-start text-muted-foreground">
								<Check className="mr-3 h-5 w-5 shrink-0 text-green-400" />
								<span>2TB RAM + 122TB NVMe</span>
							</li>
						</ul>
						<AppLink
							className="w-full rounded-lg bg-foreground py-3 text-center font-bold text-background transition-colors hover:bg-foreground/90"
							href="/quick-start"
						>
							Deploy Large
						</AppLink>
					</div>
				</div>
			</div>

			{/* Features List */}
			<div className="container mx-auto mt-24 px-6">
				<h2 className="mb-16 text-center font-black text-4xl tracking-tight md:text-5xl">
					All Plans <span className="text-hot-orange-contrast">Include</span>
				</h2>
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[
						{
							icon: Server,
							title: 'Dell XE9680 Chassis',
							desc: 'Enterprise-grade hardware stability.',
						},
						{
							icon: Shield,
							title: '100% Green Datacenter',
							desc: 'Located in our secure Michigan facility.',
						},
						{
							icon: Zap,
							title: '8x400G Networking',
							desc: 'RoCEv2 for ultra-low latency clusters.',
						},
						{
							icon: Server,
							title: 'Full Root Access',
							desc: 'SSH, BMC, iDRAC - you control it all.',
						},
						{
							icon: Shield,
							title: 'Private Isolated Networking',
							desc: 'Secure multi-node environments with public IP and firewall control.',
						},
						{
							icon: Zap,
							title: 'White Glove Support',
							desc: 'Direct Slack channel with our engineers.',
						},
					].map((feature) => (
						<div
							className="flex items-start rounded-lg border border-transparent p-4 transition-colors hover:border-border hover:bg-muted/50"
							key={feature.title}
						>
							<feature.icon className="mr-4 h-6 w-6 shrink-0 text-hot-orange" />
							<div>
								<p className="mb-1 font-bold text-foreground">{feature.title}</p>
								<p className="text-muted-foreground text-sm">{feature.desc}</p>
							</div>
						</div>
					))}
				</div>
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
