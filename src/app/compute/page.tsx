import { AppLink } from '@/components/AppLink.tsx';
import { ClickableImage } from '@/components/ClickableImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const SPECS = [
	{
		capacity: 'Dual socket',
		description: 'Your choice of highest-core or highest-clock Intel CPUs.',
		details: [
			'Intel Xeon Platinum 8470: 52 cores / 104 threads, 105 MB cache',
			'Intel Xeon Platinum 8462Y+: 32 cores / 64 threads, 60 MB cache',
		],
		name: 'CPU',
		summary: '52-core or 32-core options',
	},
	{
		capacity: '1.5 TB HBM3',
		description: 'AMD MI300X 8-GPU OAM 192 GB 750 W GPUs [x8].',
		details: ['1.5 TB HBM3 total memory'],
		name: 'GPU',
		summary: 'AI acceleration',
	},
	{
		capacity: '2,048 GB',
		description: '64 GB RDIMM, 4800 MT/s dual-rank memory [x32].',
		details: ['2,048 GB total system memory'],
		name: 'RAM',
		summary: 'Large-model memory footprint',
	},
	{
		capacity: '122.88 TB',
		description: '15.36 TB enterprise NVMe read-intensive AG drive U.2 Gen4 [x8].',
		details: ['122.88 TB high-speed local storage'],
		name: 'Disk',
		summary: 'Local scratch space',
	},
	{
		capacity: '3.2 Tbps',
		description: 'Broadcom 57608 dual-port 200G Q112 adapters [x8].',
		details: ['8x 400G (3,200 Gbps) RoCEv2 Ethernet'],
		name: 'Network',
		summary: 'Cluster networking',
	},
	{
		capacity: '6x redundant',
		description: 'Geist NU30213 power distribution units, six per rack.',
		details: ['Redundant power delivery for every rack'],
		name: 'PDU',
		summary: 'Power delivery',
	},
] as const;

const OPERATIONS = [
	{
		description: 'Next Business Day support on the infrastructure that runs your workload.',
		title: 'Dell ProSupport warranty',
	},
	{
		description:
			'Replacement parts are held on site to reduce the path from diagnosis to recovery.',
		title: 'On-site parts locker',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Dell PowerEdge XE9680 infrastructure with 8x AMD MI300X GPUs, high-bandwidth memory, and dense networking for demanding AI workloads.',
		path: '/compute',
		title: 'Supercomputer Infrastructure',
	});
}

export default function ComputePage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Platform</p>
							<figure className="mt-10 max-w-sm border border-border bg-muted/20 p-3">
								<ClickableImage
									alt="Dell PowerEdge XE9680"
									className="h-40 w-full object-contain"
									fetchPriority="high"
									height={316}
									modalHeight={723}
									modalSrc="/assets/compute/hero.webp"
									modalWidth={1243}
									src="/assets/compute/hero-compact.webp"
									width={544}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									XE9680 / 8x MI300X
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Dell PowerEdge XE9680.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								Eight AMD MI300X GPUs, high-bandwidth networking, and the automation
								to provision isolated compute without infrastructure handoffs.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<AppLink
									className="border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
									href="/quick-start"
								>
									Start now
								</AppLink>
								<AppLink
									className="border border-border px-5 py-3 font-medium text-foreground transition-colors hover:bg-muted"
									href="#specifications"
								>
									View specifications
								</AppLink>
							</div>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16" id="specifications">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Hardware profile</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Built for large inference workloads.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								A balanced system from GPU memory through storage, network fabric,
								and power delivery.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border">
						{SPECS.map((spec) => (
							<article
								className="grid gap-8 bg-background p-8 md:grid-cols-[0.55fr_1.45fr_0.7fr] md:items-start"
								key={spec.name}
							>
								<div>
									<h3 className="font-bold text-2xl text-foreground">
										{spec.name}
									</h3>
									<p className="mt-3 max-w-xs text-muted-foreground text-sm leading-relaxed">
										{spec.summary}
									</p>
								</div>
								<div className="md:border-border md:border-l md:pl-8">
									<p className="font-medium text-foreground text-lg leading-relaxed">
										{spec.description}
									</p>
									<ul className="mt-5 space-y-3">
										{spec.details.map((detail) => (
											<li
												className="text-muted-foreground leading-relaxed"
												key={detail}
											>
												{detail}
											</li>
										))}
									</ul>
								</div>
								<div className="md:border-border md:border-l md:pl-8">
									<p className="font-mono text-muted-foreground text-xs uppercase">
										Total capacity
									</p>
									<p className="mt-3 font-bold text-2xl text-hot-orange-contrast">
										{spec.capacity}
									</p>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Operational continuity</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Uptime matters to both of us.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Every server is covered by Dell ProSupport Next Business Day
								warranty, with parts held on site to minimize downtime.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border lg:grid-cols-[0.65fr_1.35fr]">
						<figure className="bg-background p-4">
							<ClickableImage
								alt="Hot Aisle server racks, network fabric, and cabling"
								className="h-full min-h-136 w-full object-cover"
								height={836}
								src="/assets/compute/racks-compact.webp"
								width={600}
							/>
						</figure>
						<div className="grid gap-px bg-border md:grid-cols-2">
							{OPERATIONS.map((operation) => (
								<div className="min-h-56 bg-background p-8" key={operation.title}>
									<h3 className="font-bold text-2xl text-foreground">
										{operation.title}
									</h3>
									<p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
										{operation.description}
									</p>
								</div>
							))}
							<div className="bg-background p-8 md:col-span-2">
								<p className="ha-briefing-label">Custom design</p>
								<h3 className="mt-4 font-black text-3xl text-foreground">
									Need a specific configuration?
								</h3>
								<p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
									Work with our team on a cluster that matches your workload,
									location, and operational requirements.
								</p>
								<AppLink
									className="mt-6 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
									href="/cluster"
								>
									Cluster design services
								</AppLink>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
