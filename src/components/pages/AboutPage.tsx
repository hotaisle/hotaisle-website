import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const FOUNDERS = [
	{
		image: '/assets/about/jon.png',
		linkedIn: 'https://www.linkedin.com/in/jon-s-stevens/',
		name: 'Jon Stevens',
		role: 'Platform, customer, and infrastructure',
		summary:
			'Leads Hot Aisle across customer deployments, socials, partnerships, and the operating decisions that turn infrastructure into a dependable service.',
	},
	{
		image: '/assets/about/clint.png',
		linkedIn: 'https://www.linkedin.com/in/clint-armstrong/',
		name: 'Clint Armstrong',
		role: 'Operations, systems, and reliability',
		summary:
			'Leads the engineering and automation work behind the platform, from the control plane through the systems that provision and operate compute.',
	},
] as const;

const OPERATING_PRINCIPLES = [
	{
		description:
			'Hardware, provisioning, support, and the customer experience remain tightly connected. The people building the platform also operate the systems underneath it.',
		title: 'Close to the metal',
	},
	{
		description:
			'We build around the access and usage patterns customers actually expect, then continuously refine the platform from what production workloads teach us.',
		title: 'Customer-led',
	},
	{
		description:
			'In infrastructure, credibility compounds when reputations grow. We make measured commitments, communicate clearly, and let operating results do the selling.',
		title: 'Under-promise, over-deliver',
	},
] as const;

const EARLY_BACKERS = [
	{
		description: 'Founder of ConsenSys and co-founder of Ethereum.',
		name: 'Joseph Lubin',
		url: 'https://consensys.io/about/joseph-lubin-founder-of-consensys',
	},
	{
		description: 'Web3 incubator and investment firm.',
		name: 'Mesh',
		url: 'https://mesh.xyz',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Meet the Hot Aisle founders and learn how the company builds and operates developer-first AMD inference infrastructure.',
		image: '/assets/about/operator-workspace-pixel-art.png',
		imageAlt: '3D pixel-art cloud infrastructure engineering workspace',
		path: '/about',
		title: 'About Hot Aisle',
	});
}

export default function AboutPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">About Hot Aisle</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-muted/20 p-3">
								<OptimizedImage
									alt="3D pixel-art cloud infrastructure engineering workspace with a server rack, terminal, network switch, and storage"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/about/operator-workspace-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/about/operator-workspace-pixel-art-light.png"
									width={1448}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									The systems we build and run
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Pragmatic infrastructure execution.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								Hot Aisle was founded to make high-performance AMD compute practical
								to acquire and operate. We stay close to the details that make
								infrastructure useful, from the physical systems to the customer
								workflow.
							</p>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">The founders</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								The people accountable for the platform.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Jon Stevens and Clint Armstrong founded Hot Aisle in October 2023
								after years of working together on large-scale compute deployments.
								They remain close to the systems, the customers, and the decisions
								that keep capacity productive.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{FOUNDERS.map((founder) => (
							<article className="bg-background p-8" key={founder.name}>
								<div className="grid gap-6 sm:grid-cols-[12rem_1fr] sm:items-start">
									<OptimizedImage
										alt={founder.name}
										className="aspect-2/3 w-full border border-border object-cover"
										height={256}
										src={founder.image}
										width={256}
									/>
									<div>
										<h3 className="font-bold text-2xl text-foreground">
											{founder.name}
										</h3>
										<p className="mt-2 font-mono text-hot-orange-contrast text-xs uppercase">
											{founder.role}
										</p>
										<p className="mt-5 text-muted-foreground leading-relaxed">
											{founder.summary}
										</p>
										<a
											className="mt-5 inline-flex font-medium text-hot-orange-contrast text-sm hover:text-foreground"
											href={founder.linkedIn}
											rel="noopener"
											target="_blank"
										>
											LinkedIn profile
										</a>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">The operating ethos</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								How we earn the right to operate your infrastructure.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								A developer-first experience only works when the layers behind it
								are designed with the same care. These are the standards behind our
								product, our support, and our customer relationships.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{OPERATING_PRINCIPLES.map((principle) => (
							<article className="min-h-64 bg-background p-8" key={principle.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{principle.title}
								</h3>
								<p className="mt-4 text-muted-foreground leading-relaxed">
									{principle.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Why Hot Aisle</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								A name for the work we do.
							</h2>
							<div className="mt-5 max-w-2xl space-y-5 text-lg text-muted-foreground leading-relaxed">
								<p>
									A hot aisle is where a data center’s heat is deliberately
									contained and managed. It is an unglamorous detail with real
									consequences for the systems around it.
								</p>
								<p>
									That is a useful description of our work: stay close to the
									physical constraints, design for the actual operating
									environment, and make the result straightforward for the people
									using the platform.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Early backing</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Backed by people who understand infrastructure.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We are grateful for the support that let us build patiently, learn
								from real workloads, and keep improving the platform before pursuing
								scale. After nearly three years in production, the foundation is
								ready for its next stage. We are now looking for additional
								investors to help expand developer-first sovereign inference
								capacity.{' '}
								<AppLink
									className="font-medium text-foreground underline decoration-hot-orange underline-offset-4 transition-colors hover:text-hot-orange-contrast"
									href="/investors"
								>
									Learn more about investing in Hot Aisle.
								</AppLink>
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2">
						{EARLY_BACKERS.map((backer) => (
							<a
								className="min-h-44 bg-background p-7 transition-colors hover:bg-muted/35"
								href={backer.url}
								key={backer.name}
								rel="noopener"
								target="_blank"
							>
								<p className="font-bold text-2xl text-foreground">{backer.name}</p>
								<p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
									{backer.description}
								</p>
							</a>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
