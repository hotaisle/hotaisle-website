import { Activity, ArrowRight, Cpu, Globe, Network, ShieldCheck, Zap } from 'lucide-react';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Hot Aisle’s custom networking fabric for GPU infrastructure, including compute, storage, and management network layers.',
		image: '/assets/compute/racks.png',
		imageAlt: 'Hot Aisle networking fabric',
		path: '/networking',
		title: 'Networking Fabric',
	});
}

const fabric = [
	{
		tier: 'Compute Fabric',
		speed: '3200 Gbps',
		desc: 'Dell XE9680 chassis with 8x Broadcom 57608 Dual Port 200G Q112 Adapters with Dell PowerSwitch Z9864F at 400G. (RoCEv2)',
		icon: Zap,
		color: 'text-amber-500',
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
				label: 'RoCEv2 (Wikipedia)',
				url: 'https://en.wikipedia.org/wiki/RDMA_over_Converged_Ethernet',
			},
		],
	},
	{
		tier: 'East-West & Storage',
		speed: '100 Gbps',
		desc: 'Broadcom 57504 Quad Port 10/25GbE Adapters with Dell PowerSwitch Z9664F at 100G.',
		icon: Activity,
		color: 'text-hot-orange',
		links: [
			{ label: 'Broadcom 57504', url: 'https://docs.broadcom.com/doc/957504-N425G-DS' },
			{
				label: 'Dell PowerSwitch Z9664F',
				url: 'https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-powerswitch-z9664f-on-spec-sheet.pdf',
			},
		],
	},
	{
		tier: 'OOB / Management',
		speed: '1 GbE',
		desc: 'Broadcom 5720 Dual Port 1GbE with Dell PowerSwitch Z9432F at 1GbE.',
		icon: Cpu,
		color: 'text-green-500',
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
	},
];

export default function NetworkingPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Header */}
			<div className="relative w-full overflow-hidden border-border border-b bg-background px-6 py-24">
				<div className="pointer-events-none absolute top-0 right-0 h-200 w-200 rounded-full bg-hot-orange/5 blur-[120px]" />
				<div className="container relative z-10 mx-auto max-w-6xl">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-bold text-foreground text-xs tracking-wider">
						<Network className="text-hot-orange" size={14} />
						HOT AISLE BGP AS: 21566
					</div>

					<h1 className="mb-8 font-black text-5xl text-foreground tracking-tighter md:text-7xl">
						Custom <span className="text-hot-orange">Networking Fabric</span>
					</h1>

					<p className="mb-6 max-w-4xl font-light text-muted-foreground text-xl leading-relaxed md:text-2xl">
						Hot Aisle offers flexible networking configuration that we customize for
						each customer to provide the fastest ethernet standards based cross node
						communication fabric available today.
					</p>

					<div className="flex flex-wrap gap-x-8 gap-y-2 font-bold text-foreground/80 text-sm">
						<span className="flex items-center gap-2">
							<CheckCircle /> IPv6 First
						</span>
						<a
							className="flex items-center gap-2 underline decoration-dotted underline-offset-4 transition-colors hover:text-hot-orange"
							href="https://www.techtarget.com/searchnetworking/definition/virtual-routing-and-forwarding-VRF"
							rel="noopener"
							target="_blank"
						>
							<CheckCircle /> VRF Networking
						</a>
						<a
							className="flex items-center gap-2 underline decoration-dotted underline-offset-4 transition-colors hover:text-hot-orange"
							href="https://en.wikipedia.org/wiki/RDMA_over_Converged_Ethernet"
							rel="noopener"
							target="_blank"
						>
							<CheckCircle /> RoCEv2
						</a>
					</div>
				</div>
			</div>

			{/* Fabric Tiers */}
			<div className="container mx-auto mt-20 max-w-6xl px-6">
				<div className="grid grid-cols-1 gap-8">
					{fabric.map((item) => (
						<div
							className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:border-hot-orange/40"
							key={item.desc}
						>
							<div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
								<div
									className={`rounded-2xl bg-muted p-4 transition-colors group-hover:bg-hot-orange/10 ${item.color}`}
								>
									<item.icon size={48} strokeWidth={1.5} />
								</div>
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-3">
										<h3 className="font-bold text-2xl text-foreground">
											{item.tier}
										</h3>
										<span
											className={
												'rounded border border-border bg-muted px-2 py-1 font-mono text-foreground text-xs'
											}
										>
											{item.speed}
										</span>
									</div>
									<p className="mb-4 text-lg text-muted-foreground leading-relaxed">
										{item.desc}
									</p>
									<div className="flex flex-wrap gap-4">
										{item.links.map((link) => (
											<a
												className="flex items-center gap-1 font-bold text-hot-orange-contrast text-sm transition-colors hover:text-foreground"
												href={link.url}
												key={link.url}
												rel="noopener noreferrer"
												target="_blank"
											>
												{link.label} <ArrowRight size={12} />
											</a>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Internet & Security Grid */}
			<div className="container mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
				{/* Connector */}
				<div className="rounded-3xl border border-border bg-muted/30 p-8">
					<div className="mb-4 flex items-center gap-3">
						<Globe className="text-indigo-400" size={32} />
						<h3 className="font-bold text-2xl">100G Internet</h3>
					</div>
					<p className="mb-6 text-muted-foreground">
						{'Provided by '}
						<a
							className="font-bold text-foreground hover:underline"
							href="https://www.switch.com/switch-connect/"
						>
							Switch Connect
						</a>
						{' and '}
						<a
							className="font-bold text-foreground hover:underline"
							href="https://www.megaport.com/"
						>
							Megaport
						</a>
						.
					</p>
					<div className="rounded-xl border border-border bg-background p-4 text-muted-foreground text-sm">
						<span className="inline-label-group">
							<strong className="text-foreground">Note:</strong>
							<span>
								Public IPv4/v6 address is included on all baremetal and VM servers.
								<span> You may need to edit </span>
								<code className="rounded bg-muted px-1 py-0.5 text-hot-orange">
									ufw config
								</code>
								<span> to open ports, which we can help with.</span>
							</span>
						</span>
					</div>
				</div>

				{/* Warranty */}
				<div className="rounded-3xl border border-border bg-muted/30 p-8">
					<div className="mb-4 flex items-center gap-3">
						<ShieldCheck className="text-green-500" size={32} />
						<h3 className="font-bold text-2xl">Mission Critical Uptime</h3>
					</div>
					<p className="mb-6 text-muted-foreground">
						<span>
							Uptime is critical for you, and for us. All of our switches are backed
							by a
						</span>
						<strong className="ml-1">Dell ProSupport Next Business Day warranty</strong>
						.
					</p>
					<ul className="space-y-3">
						<li className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-foreground text-sm">
							<span className="h-2 w-2 rounded-full bg-green-500" />
							Z9864F features additional 4-hour mission critical warranty
						</li>
						<li className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-foreground text-sm">
							<span className="h-2 w-2 rounded-full bg-hot-orange" />
							On-site parts locker for instant replacements
						</li>
					</ul>
				</div>
			</div>

			{/* CTA */}
			<div className="container mx-auto mt-24 max-w-4xl px-6 text-center">
				<div className="rounded-3xl border border-border bg-card p-12 shadow-xl">
					<h2 className="mb-6 font-black text-3xl text-foreground">
						Need a specific network design?
					</h2>
					<p className="mb-8 text-muted-foreground text-xl">
						We specialize in custom topology for high-performance computing clusters.
						Contact us and we will create it for you.
					</p>
					<a
						className="inline-block rounded-full bg-foreground px-10 py-4 font-bold text-background text-lg transition-transform hover:scale-105 hover:opacity-90"
						href="mailto:hello@hotaisle.ai"
					>
						Contact Network Team
					</a>
				</div>
			</div>
		</div>
	);
}

function CheckCircle() {
	return (
		<div className="flex h-4 w-4 items-center justify-center rounded-full border border-hot-orange/50 bg-hot-orange/20">
			<div className="h-1.5 w-1.5 rounded-full bg-hot-orange" />
		</div>
	);
}
