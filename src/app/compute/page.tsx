import { Server, ShieldCheck } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Dell PowerEdge XE9680 infrastructure with 8x AMD MI300X GPUs, high-bandwidth memory, and dense networking for demanding AI workloads.',
		image: '/assets/compute/hero.png',
		imageAlt: 'Dell PowerEdge XE9680 with AMD MI300X GPUs',
		path: '/compute',
		title: 'Supercomputer Infrastructure',
	});
}

const specs = [
	{
		item: 'CPU',
		desc: 'Your choice of Highest Core or Highest Clock Intel CPUs',
		detail: [
			'Intel® Xeon® Platinum 8470 2G, 52C/104T, 16GT/s, 105M Cache, Turbo, HT (350W)',
			'Intel® Xeon® Platinum 8462Y+ 2.8G, 32C/64T, 16GT/s, 60M Cache, Turbo, HT (300W)',
		],
		subtext: '52 core or 32 core options',
	},
	{
		item: 'GPU',
		desc: 'AMD MI300X 8-GPU OAM 192GB 750W GPUs [x8]',
		detail: ['1.5 TB HBM3 Total Memory'],
		subtext: 'Best-in-class AI acceleration',
	},
	{
		item: 'RAM',
		desc: '64GB RDIMM, 4800MT/s Dual Rank [x32]',
		detail: ['2048 GB Total System Memory'],
		subtext: 'Massive memory footprint for large models',
	},
	{
		item: 'Disk',
		desc: '15.36TB Enterprise NVMe Read Intensive AG Drive U.2 Gen4 [x8]',
		detail: ['122.88 TB High-Speed Storage'],
		subtext: 'Ultra-fast local scratch space',
	},
	{
		item: 'Network',
		desc: 'Broadcom 57608 Dual Port 200G Q112 Adapter, PCIe Full Height [x8]',
		detail: ['8x 400G (3200 Gbps ROCEv2 Ethernet)'],
		subtext: 'Hyperscale-ready networking',
	},
	{
		item: 'PDU',
		desc: 'Geist NU30213 - 6 per rack for redundancy',
		detail: ['6x / rack'],
		subtext: 'Robust power delivery',
	},
];

export default function ComputePage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Section */}
			<div className="relative overflow-hidden border-border border-b bg-background px-6 pt-32 pb-20">
				<div className="pointer-events-none absolute top-0 right-0 h-150 w-150 rounded-full bg-hot-orange/10 opacity-40 blur-[100px]" />

				<div className="container relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
					<div className="flex-1">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-bold text-foreground text-xs tracking-wider">
							<span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
							OFFICIAL DELL TECHNOLOGIES PARTNER
						</div>
						<h1 className="mb-6 font-black text-5xl text-foreground leading-tight tracking-tighter md:text-7xl">
							Dell PowerEdge <span className="text-hot-orange-contrast">XE9680</span>
						</h1>
						<p className="mb-8 max-w-2xl font-light text-muted-foreground text-xl leading-relaxed md:text-2xl">
							<span>We offer remote access to the Dell PowerEdge XE9680 with </span>
							<strong className="font-semibold text-foreground">
								8x AMD MI300x GPUs
							</strong>
							<span>
								. Best-in-class specifications for your most demanding AI workloads.
							</span>
						</p>

						<div className="flex flex-wrap gap-4">
							<AppLink
								className="rounded-lg bg-foreground px-8 py-4 font-bold text-background transition-transform hover:scale-105 hover:opacity-90"
								href="/quick-start"
							>
								Reserve Now
							</AppLink>
							<AppLink
								className="rounded-lg border border-border px-8 py-4 font-bold text-foreground transition-colors hover:bg-muted"
								href="#specs"
							>
								View Specs
							</AppLink>
						</div>
					</div>

					{/* Hero Image */}
					<div className="group relative w-full flex-1">
						<div className="relative overflow-hidden rounded-3xl border border-border p-8 shadow-2xl">
							<OptimizedImage
								alt="Dell PowerEdge XE9680"
								className="h-auto w-full object-contain transition-transform duration-700 hover:scale-105"
								fetchPriority="high"
								height={316}
								src="/assets/compute/hero-compact.webp"
								width={544}
							/>
						</div>
						{/* GPU Detail - Bottom Left */}
						<div className="absolute -bottom-8 -left-8 z-20 h-32 w-32 overflow-hidden rounded-xl border border-border bg-background shadow-2xl md:h-40 md:w-40">
							<OptimizedImage
								alt="AMD MI300X Detail"
								className="h-full w-full object-cover"
								height={184}
								src="/assets/compute/gpu-compact.webp"
								width={184}
							/>
						</div>
						<div className="absolute -right-6 -bottom-6 flex animate-bounce-slow items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-xl">
							<div className="rounded-lg bg-hot-orange/10 p-2 text-hot-orange">
								<Server size={24} />
							</div>
							<div>
								<div className="font-bold text-muted-foreground text-xs uppercase">
									Powered By
								</div>
								<div className="font-black text-lg">8x AMD MI300x</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Strict Specs Table */}
			<div className="container mx-auto max-w-6xl px-6 py-24" id="specs">
				<div className="mb-12">
					<h2 className="font-black text-3xl md:text-4xl">
						Best-in-Class Specifications
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-6">
					{specs.map((spec) => (
						<div
							className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-hot-orange/50 md:p-8"
							key={spec.item}
						>
							<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
								{/* Item Label */}
								<div className="md:col-span-2">
									<h3 className="font-bold text-2xl text-foreground">
										{spec.item}
									</h3>
									<p className="mt-1 font-mono text-muted-foreground text-xs">
										{spec.subtext}
									</p>
								</div>

								{/* Description */}
								<div className="border-border border-l md:col-span-6 md:pl-6">
									<div className="mb-2 font-medium text-lg">{spec.desc}</div>
									{Array.isArray(spec.detail) ? (
										<ul className="space-y-1">
											{spec.detail.map((line) => (
												<li
													className="flex items-start gap-2 text-muted-foreground"
													key={line}
												>
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hot-orange" />
													{line}
												</li>
											))}
										</ul>
									) : (
										<div className="text-muted-foreground">{spec.detail}</div>
									)}
								</div>

								{/* Highlight/Total */}
								<div className="flex h-full items-center border-border md:col-span-4 md:justify-end md:border-l md:pl-6">
									<div className="w-full rounded-xl bg-muted/30 px-4 py-3 text-center transition-colors group-hover:bg-hot-orange/5 md:w-auto md:text-right">
										<span className="mb-1 block font-bold text-muted-foreground text-sm uppercase tracking-wider">
											Total Capacity
										</span>
										{spec.item === 'RAM' && (
											<span className="font-black text-3xl text-hot-orange-contrast">
												2,048 GB
											</span>
										)}
										{spec.item === 'Disk' && (
											<span className="font-black text-3xl text-hot-orange-contrast">
												122.88 TB
											</span>
										)}
										{spec.item === 'GPU' && (
											<span className="font-black text-3xl text-hot-orange-contrast">
												1.5 TB HBM3
											</span>
										)}
										{spec.item === 'Network' && (
											<span className="font-black text-3xl text-hot-orange-contrast">
												3.2 Tbps
											</span>
										)}
										{spec.item === 'CPU' && (
											<span className="font-bold text-xl">Dual Socket</span>
										)}
										{spec.item === 'PDU' && (
											<span className="font-bold text-xl">6x Redundant</span>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Uptime & Racks Section */}
			<div className="overflow-hidden border-border border-t bg-muted px-6 py-24">
				<div className="container mx-auto max-w-7xl">
					<div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
						<div className="space-y-8">
							<h2 className="font-black text-4xl text-foreground leading-tight">
								Uptime is critical for you,
								<br />
								and for us.
							</h2>
							<p className="text-muted-foreground text-xl leading-relaxed">
								<span>All of our servers are backed by a </span>
								<strong>Dell ProSupport Next Business Day warranty</strong>
								<span>
									, and we have a parts locker on site to eliminate downtime.
								</span>
							</p>

							<ul className="space-y-4">
								<li className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
									<ShieldCheck className="h-8 w-8 text-green-500" />
									<div>
										<div className="font-bold text-foreground text-lg">
											Dell ProSupport Warranty
										</div>
										<div className="text-muted-foreground text-sm">
											Next Business Day Response
										</div>
									</div>
								</li>
								<li className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
									<Server className="h-8 w-8 text-hot-orange" />
									<div>
										<div className="font-bold text-foreground text-lg">
											On-Site Parts Locker
										</div>
										<div className="text-muted-foreground text-sm">
											Instant replacement availability
										</div>
									</div>
								</li>
							</ul>

							<div className="mt-8 border-border border-t pt-8">
								<p className="mb-4 font-light text-muted-foreground">
									If you would like a specific design, contact us, and we will
									create it for you.
								</p>
								<a
									className="inline-block rounded-full bg-foreground px-8 py-3 font-bold text-background transition-transform hover:scale-105 hover:opacity-90"
									href="mailto:hello@hotaisle.ai"
								>
									Contact Design Team
								</a>
							</div>
						</div>

						{/* Racks Image Visual */}
						<div className="relative">
							<div className="relative z-10 overflow-hidden rounded-2xl border-4 border-background shadow-2xl">
								<OptimizedImage
									alt="Hot Aisle Server Racks"
									className="h-auto w-full object-cover"
									height={836}
									src="/assets/compute/racks-compact.webp"
									width={600}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
