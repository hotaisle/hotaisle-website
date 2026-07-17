import { Camera, ExternalLink, Shield, Video } from 'lucide-react';
import { ClickableImage } from '@/components/ClickableImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Explore Hot Aisle’s Tier 5 Platinum data center footprint, security model, sustainability profile, and operational advantages.',
		image: '/assets/datacenter/inside.png',
		imageAlt: 'Hot Aisle data center interior',
		path: '/datacenter',
		title: 'Datacenter Infrastructure',
	});
}

const advantages = [
	{
		desc: 'State-of-the-art Tier 5 Platinum exascale facilities ensuring optimal performance, cooling, reliability, and security.',
		title: 'Advanced Infrastructure',
	},
	{
		desc: 'One of the most secure data centers on the planet. Armed guards, multiple layers of physical and biometric access controls.',
		title: 'Security',
	},
	{
		desc: '100% renewable energy, low PUE (patented T-SCIF design). Aligning with our core values for environmentally responsible operations.',
		title: 'Sustainability',
	},
	{
		desc: 'Extensive space and resources available to seamlessly scale operations to meet increasing demands.',
		title: 'Scalability',
	},
	{
		desc: 'Located in Grand Rapids, Michigan. Strategic proximity to major industrial and technological hubs ensuring connectivity.',
		title: 'Geographical Advantage',
	},
	{
		desc: 'Tax optimization allows us to pass significant capital cost savings onto our partners.',
		title: 'Fiscal',
	},
];

export default function DatacenterPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Section */}
			<div className="relative border-border border-b bg-muted/30">
				<div className="container mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-24 md:flex-row">
					<div className="flex-1 space-y-8">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-bold text-foreground text-xs uppercase tracking-wider shadow-sm">
							<span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
							Switch Pyramid • Grand Rapids, MI
						</div>

						<h1 className="font-black text-5xl text-foreground leading-tight tracking-tighter md:text-7xl">
							Tier 5 <span className="text-hot-orange">Platinum</span>
							<br />
							Infrastructure
						</h1>

						<p className="max-w-xl text-muted-foreground text-xl leading-relaxed">
							Our mission is to de-risk our best-in-class business operations, provide
							top-tier computational resources, and deliver robust infrastructure for
							our partners.
						</p>

						<div className="flex flex-wrap gap-4">
							<a
								className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-bold text-background transition-transform hover:scale-105 hover:opacity-90"
								href="https://www.switch.com/grand-rapids/"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Video size={20} />
								Watch Video
							</a>
							<a
								className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-bold text-foreground transition-colors hover:bg-muted"
								href="https://www.switch.com/photos/"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Camera size={20} />
								View Photos
							</a>
						</div>
					</div>

					{/* Hero Image - Inside View */}
					<div className="relative w-full flex-1">
						<div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-background shadow-2xl">
							<ClickableImage
								alt="Switch Datacenter Interior"
								className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
								height={1080}
								src="/assets/datacenter/inside.png"
								width={1920}
							/>
						</div>
						<div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-lg">
							<Shield className="h-8 w-8 text-green-500" />
							<div>
								<div className="font-bold text-foreground text-lg">100% Secure</div>
								<div className="text-muted-foreground text-xs uppercase tracking-wider">
									Armed Guards & Biometrics
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Strategic Advantages */}
			<div className="container mx-auto max-w-7xl px-6 py-24">
				<div className="grid gap-8 border-border border-b pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
					<p className="ha-briefing-label">Site conditions</p>
					<div>
						<h2 className="max-w-2xl font-black text-4xl text-foreground md:text-6xl">
							Strategic advantages
						</h2>
						<p className="mt-5 max-w-2xl text-muted-foreground text-xl leading-relaxed">
							Located at the Switch Pyramid data center in Grand Rapids, Michigan. A
							facility our partners can brag about.
						</p>
					</div>
				</div>

				<div className="mt-10 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
					{advantages.map((item) => (
						<div className="min-h-64 bg-background p-8" key={item.title}>
							<h3 className="font-bold text-2xl text-foreground">{item.title}</h3>
							<p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* External Details & CTA */}
			<div className="border-border border-t bg-muted px-6 py-24">
				<div className="container mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
					{/* Outside Image */}
					<div className="order-2 w-full flex-1 lg:order-1">
						<div
							className="relative overflow-hidden rounded-2xl border-4 border-background shadow-2xl"
							style={{ aspectRatio: '4/3' }}
						>
							<ClickableImage
								alt="Switch Pyramid Datacenter Exterior"
								className="h-full w-full object-cover"
								height={1080}
								src="/assets/datacenter/outside.png"
								width={1920}
							/>
							<div className="pointer-events-none absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-8">
								<div className="text-white">
									<div className="font-bold text-2xl">The Pyramid</div>
									<div className="text-sm opacity-80">Grand Rapids, Michigan</div>
								</div>
							</div>
						</div>
					</div>

					<div className="order-1 flex-1 space-y-8 lg:order-2">
						<h2 className="font-black text-4xl text-foreground leading-tight">
							Unparalleled Professionalism & Security
						</h2>
						<p className="text-muted-foreground text-xl leading-relaxed">
							Take a moment to explore the full facility. The level of detail in
							security, sustainability, and infrastructure is unmatched in the
							industry.
						</p>

						<div className="rounded-xl border border-border bg-background p-6">
							<h4 className="mb-2 flex items-center gap-2 font-bold text-foreground">
								<ExternalLink className="text-hot-orange" size={18} />
								switch.com
							</h4>
							<p className="mb-4 text-muted-foreground text-sm">
								"The Grand Rapids facility is one of the most secure data centers on
								the planet."
							</p>
							<a
								className="font-medium text-hot-orange underline underline-offset-4 transition-colors hover:text-foreground"
								href="https://www.switch.com/grand-rapids/"
								rel="noopener noreferrer"
								target="_blank"
							>
								Visit Official Website &rarr;
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
