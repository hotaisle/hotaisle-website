import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const FABRIC_LAYERS = [
	{
		description:
			'Dell XE9680 chassis with eight Broadcom 57608 dual-port 200G Q112 adapters and Dell PowerSwitch Z9864F switching.',
		links: [
			{
				label: 'Broadcom 57608',
				url: 'https://docs.broadcom.com/doc/NetXtreme-E-PCIENIC-SG',
			},
			{
				label: 'Dell PowerSwitch Z9864F',
				url: 'https://www.dell.com/en-us/shop/ipovw/networking-z-series',
			},
			{
				label: 'RoCEv2',
				url: 'https://en.wikipedia.org/wiki/RDMA_over_Converged_Ethernet',
			},
		],
		speed: '3.2 Tbps',
		summary: 'RoCEv2 / compute traffic',
		title: 'Compute fabric',
	},
	{
		description:
			'Broadcom 57504 quad-port 10/25GbE adapters with Dell PowerSwitch Z9664F switching for cluster-internal traffic and storage.',
		links: [
			{ label: 'Broadcom 57504', url: 'https://docs.broadcom.com/doc/957504-N425G-DS' },
			{
				label: 'Dell PowerSwitch Z9664F',
				url: 'https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-powerswitch-z9664f-on-spec-sheet.pdf',
			},
		],
		speed: '100 Gbps',
		summary: 'East-west / storage',
		title: 'Cluster services',
	},
	{
		description:
			'Broadcom 5720 dual-port 1GbE adapters with Dell PowerSwitch Z9432F switching for out-of-band hardware management.',
		links: [
			{
				label: 'Broadcom 5720',
				url: 'https://www.broadcom.com/products/ethernet-connectivity/network-adapters/bcm5720-2p',
			},
			{
				label: 'Dell PowerSwitch Z9432F',
				url: 'https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-emc-powerswitch-z9432f-spec-sheet.pdf',
			},
		],
		speed: '1 Gbps',
		summary: 'Out-of-band management',
		title: 'Management plane',
	},
] as const;

const OPERATING_FOUNDATIONS = [
	{
		description:
			'100G connectivity through Switch Connect and Megaport. Public IPv4 and IPv6 addresses are included with every bare-metal server and VM.',
		title: 'Internet and address space',
	},
	{
		description:
			'Dell ProSupport Next Business Day covers every switch. The Z9864F has additional four-hour mission-critical coverage, backed by on-site replacement parts.',
		title: 'Serviceability built in',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Hot Aisle’s custom networking fabric for GPU infrastructure, including compute, storage, and management network layers.',
		path: '/networking',
		title: 'Networking Fabric',
	});
}

export default function NetworkingPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Networking / AS 21566</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-muted/20 p-3">
								<OptimizedImage
									alt="3D pixel-art GPU networking fabric with server racks and connected switches"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/networking/fabric-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/networking/fabric-pixel-art-light.png"
									width={1448}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									Compute, storage, and management planes
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								A fabric built for GPU clusters.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								We automate SONiC networking beneath the compute layer, providing
								fast, isolated paths for inference, storage, and operational
								control.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<AppLink
									className="border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
									href="/quick-start"
								>
									Start now
								</AppLink>
							</div>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Fabric layers</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Separate paths for every job.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								The network is designed as distinct planes, so high-throughput
								inference traffic, storage activity, and hardware management remain
								predictable.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border">
						{FABRIC_LAYERS.map((layer) => (
							<article
								className="grid gap-8 bg-background p-8 md:grid-cols-[0.55fr_1.45fr_0.7fr] md:items-start"
								key={layer.title}
							>
								<div>
									<h3 className="font-bold text-2xl text-foreground">
										{layer.title}
									</h3>
									<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
										{layer.summary}
									</p>
								</div>
								<div className="md:border-border md:border-l md:pl-8">
									<p className="text-foreground text-lg leading-relaxed">
										{layer.description}
									</p>
									<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
										{layer.links.map((link) => (
											<a
												className="font-medium text-hot-orange-contrast text-sm hover:text-foreground"
												href={link.url}
												key={link.url}
												rel="noopener"
												target="_blank"
											>
												{link.label}
											</a>
										))}
									</div>
								</div>
								<div className="md:border-border md:border-l md:pl-8">
									<p className="font-mono text-muted-foreground text-xs uppercase">
										Capacity
									</p>
									<p className="mt-3 font-bold text-2xl text-hot-orange-contrast">
										{layer.speed}
									</p>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Operational network</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Connectivity that can be operated.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								IPv6-first addressing, VRF isolation, and serviceable switching are
								built into the environment from the start.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{OPERATING_FOUNDATIONS.map((foundation, index) => (
							<article className="min-h-60 bg-background p-8" key={foundation.title}>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{String(index + 1).padStart(2, '0')}
								</p>
								<h3 className="mt-10 font-bold text-2xl text-foreground">
									{foundation.title}
								</h3>
								<p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
									{foundation.description}
								</p>
							</article>
						))}
					</div>

					<div className="mt-12 grid gap-8 border-border border-t pt-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Network design</p>
						<div>
							<h3 className="font-black text-3xl text-foreground">
								Need a topology for a specific workload?
							</h3>
							<p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
								We can design the compute, storage, management, and public network
								paths around the constraints of your deployment.
							</p>
							<AppLink
								className="mt-6 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/cluster"
							>
								Cluster design services
							</AppLink>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
