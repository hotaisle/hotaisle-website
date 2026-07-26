import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const RELATIONSHIP_OUTCOMES = [
	{
		description:
			'Hardware, networking, facility, and support decisions are coordinated before a deployment is exposed to a customer workload.',
		title: 'Fewer handoffs',
	},
	{
		description:
			'Direct relationships help us validate the systems underneath the platform, from accelerator configuration through networking and serviceability.',
		title: 'Better operating context',
	},
	{
		description:
			'We can bring hardware, networking, deployment, and optimization conversations together early, reducing avoidable cost and time.',
		title: 'A shorter path to capacity',
	},
] as const;

const PARTNER_GROUPS = [
	{
		description:
			'The hardware, networking, orchestration, distribution, and facility relationships behind a deployable GPU environment.',
		partners: [
			{
				name: 'Dell Technologies',
				role: 'Hardware systems and support',
				url: 'https://www.dell.com',
			},
			{ name: 'AMD', role: 'Accelerator platform', url: 'https://www.amd.com' },
			{
				name: 'Broadcom',
				role: 'Networking and connectivity',
				url: 'https://www.broadcom.com',
			},
			{
				name: 'Advizex',
				role: 'Deployment and lifecycle services',
				url: 'https://www.advizex.com',
			},
			{ name: 'Switch', role: 'Data center operations', url: 'https://www.switch.com' },
			{ name: 'dstack', role: 'GPU-native orchestration', url: 'https://dstack.ai' },
		],
		title: 'Infrastructure delivery',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Hot Aisle works with infrastructure, networking, orchestration, and deployment partners to bring AMD inference capacity online reliably.',
		image: '/assets/partners/deployment-coordination-pixel-art.png',
		imageAlt: '3D pixel-art coordinated data center deployment',
		path: '/partners',
		title: 'Partners',
	});
}

export default function PartnersPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Ecosystem</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-muted/20 p-3">
								<OptimizedImage
									alt="3D pixel-art coordinated data center deployment with a server rack, network switch, cable spool, and installation arm"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/partners/deployment-coordination-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/partners/deployment-coordination-pixel-art-light.png"
									width={1448}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									Hardware, network, and delivery coordination
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Partnerships that move capacity.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								Reliable infrastructure is built through close working
								relationships. We bring the hardware, networking, facility,
								deployment, and orchestration conversations together before capacity
								is put in front of customers.
							</p>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Why it matters</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								The work starts well before a server comes online.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Our partners are part of how we turn AMD GPU hardware into usable,
								serviceable inference capacity. The outcome should be simple for the
								customer, even when the work underneath is not.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{RELATIONSHIP_OUTCOMES.map((outcome) => (
							<article className="min-h-64 bg-background p-8" key={outcome.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{outcome.title}
								</h3>
								<p className="mt-4 text-muted-foreground leading-relaxed">
									{outcome.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">The network</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Relationships at every layer of delivery.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We work with specialists in the layers we operate, rather than
								treating the infrastructure supply chain as a black box.
							</p>
						</div>
					</div>

					<div className="mt-12 border-border border-t">
						{PARTNER_GROUPS.map((group) => (
							<section
								className="grid gap-8 py-10 lg:grid-cols-[0.75fr_1.25fr]"
								key={group.title}
							>
								<div>
									<h3 className="font-bold text-2xl text-foreground">
										{group.title}
									</h3>
									<p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
										{group.description}
									</p>
								</div>
								<div className="grid gap-px border border-border bg-border sm:grid-cols-2">
									{group.partners.map((partner) => (
										<a
											className="group min-h-36 bg-background p-6 transition-colors hover:bg-muted/35"
											href={partner.url}
											key={partner.url}
											rel="noopener"
											target="_blank"
										>
											<p className="font-bold text-foreground text-xl transition-colors group-hover:text-hot-orange-contrast">
												{partner.name}
											</p>
											<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
												{partner.role}
											</p>
										</a>
									))}
								</div>
							</section>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Work with us</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Bring us a deployment with real constraints.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We are interested in relationships that make sovereign inference
								infrastructure faster to deploy, easier to operate, and more useful
								to developers and the businesses they support.
							</p>
							<AppLink
								className="mt-8 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/contact"
							>
								Start a conversation
							</AppLink>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
