import { Cpu, Database, ExternalLink, Globe, Handshake, Server } from 'lucide-react';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'The Hot Aisle ecosystem across hardware, orchestration, networking, and performance engineering partners.',
		path: '/partners',
		title: 'Partners',
	});
}

const introText = [
	'Our partners are one of our most valuable assets, and our ecosystem reflects how we operate today: tight collaboration across hardware, orchestration, networking, and performance engineering.',
	'We work directly with these teams to validate integrations, improve deployment workflows, and keep production environments reliable at scale.',
	'The result is a stronger platform and faster execution for customers deploying serious GPU workloads.',
];

const partners = [
	{
		category: 'Hardware, Deployment & Data Centers',
		icon: Server,
		list: [
			{ desc: 'Global Hardware Partner', name: 'Dell Technologies', url: 'https://dell.com' },
			{ desc: 'Together We Advance', name: 'AMD', url: 'https://www.amd.com' },
			{ desc: 'Networking & Connectivity', name: 'Broadcom', url: 'https://broadcom.com/' },
			{ desc: 'Customers for Life.', name: 'Advizex', url: 'https://advizex.com' },
			{ desc: 'World-Class Data Centers', name: 'Switch', url: 'https://switch.com' },
		],
	},
	{
		category: 'Orchestration',
		icon: Database,
		list: [
			{
				desc: 'Open-source GPU-native orchestration',
				name: 'dstack',
				url: 'https://dstack.ai',
			},
		],
	},
	{
		category: 'Software Engineering & Optimization',
		icon: Cpu,
		list: [
			{
				desc: 'Write CUDA code. Run everywhere.',
				name: 'Spectral Compute',
				url: 'https://spectralcompute.co.uk/',
			},
			{
				desc: 'HPC & Scientific Computing',
				name: 'Fluid Numerics',
				url: 'https://fluidnumerics.com',
			},
		],
	},
	{
		category: 'GPU Cloud Marketplace',
		icon: Globe,
		list: [
			{ desc: 'Unified Cloud Controls', name: 'shadeform.ai', url: 'https://shadeform.ai' },
		],
	},
];

export default function PartnersPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Section */}
			<div className="relative border-border border-b bg-muted/20">
				<div className="container mx-auto max-w-5xl px-6 py-24">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-bold text-foreground text-xs uppercase tracking-wider shadow-sm">
						<Handshake className="text-hot-orange" size={14} />
						Ecosystem
					</div>

					<h1 className="mb-8 text-center font-black text-5xl text-foreground tracking-tighter md:text-left md:text-7xl">
						Our <span className="text-hot-orange">Partners</span>
					</h1>

					<div className="space-y-6 font-light text-lg text-muted-foreground leading-relaxed md:text-xl">
						{introText.map((text) => (
							<p key={text}>{text}</p>
						))}
					</div>
				</div>
			</div>

			{/* Partners Grid */}
			<div className="container mx-auto max-w-6xl px-6 py-24">
				<div className="grid grid-cols-1 gap-16">
					{partners.map((section) => (
						<div className="" key={section.category}>
							<div className="mb-8 flex items-center gap-3 border-border border-b pb-4">
								<div className="rounded-lg border border-border bg-muted p-2">
									<section.icon className="h-6 w-6 text-foreground" />
								</div>
								<h2 className="font-bold text-2xl text-foreground">
									{section.category}
								</h2>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{section.list.map((p) => (
									<a
										className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-hot-orange/50 hover:shadow-lg"
										href={p.url}
										key={p.url}
										rel="noopener noreferrer"
										target="_blank"
									>
										<div>
											<div className="mb-2 flex items-center justify-between">
												<h3 className="font-bold text-foreground text-xl transition-colors group-hover:text-hot-orange">
													{p.name}
												</h3>
												<ExternalLink
													className="text-muted-foreground opacity-0 transition-all group-hover:text-hot-orange group-hover:opacity-100"
													size={16}
												/>
											</div>
											<p className="text-muted-foreground text-sm">
												{p.desc}
											</p>
										</div>
									</a>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Highlight Section */}
				<div className="mt-32 text-center">
					<div className="relative inline-flex max-w-full flex-col items-center overflow-hidden rounded-3xl border border-border bg-linear-to-br from-blue-900/10 to-indigo-900/10 p-10 shadow-2xl backdrop-blur-sm md:p-16">
						<div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-hot-orange/10 blur-[100px]" />

						<div className="relative z-10 text-center">
							<img
								alt="Michael Dell Comment"
								className="mx-auto mb-8 max-w-full rounded-xl border-4 border-background shadow-2xl md:max-w-xl"
								height={768}
								src="https://imagedelivery.net/IEMzXmjRvW0g933AN5ejrA/wwwnotionso-image-prod-files-secures3us-west-2amazonawscom-286393f4-e9f7-4ee1-936a-dd08d5e664fb-4fae8885-06af-4b9a-b017-33b61c675ccb-2024-08-13_at_084357pngpng/public"
								width={432}
							/>
							<div className="mb-4 font-serif text-2xl text-foreground italic md:text-3xl">
								"Great partnership"
							</div>
							<div className="font-black text-hot-orange uppercase tracking-wider">
								— Michael Dell
							</div>
						</div>
					</div>
				</div>

				{/* Footer CTA */}
				<div className="mt-24 border-border border-t pt-12 text-center">
					<p className="mb-4 text-muted-foreground">
						Would you like to be added to the list?
					</p>
					<a
						className="inline-block rounded-lg bg-muted px-8 py-3 font-bold text-foreground transition-colors hover:bg-foreground hover:text-background"
						href="mailto:hello@hotaisle.ai"
					>
						Contact Partner Team
					</a>
				</div>
			</div>
		</div>
	);
}
