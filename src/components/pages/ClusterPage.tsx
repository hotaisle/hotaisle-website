import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const CLUSTER_CAPABILITIES = [
	{
		description:
			'From a compact high-density deployment to a full-scale multi-node environment, we size compute, storage, and networking around the workload.',
		title: 'Scale with the workload',
	},
	{
		description:
			'Our deep industry relationships and partnerships help coordinate hardware, facilities, and support earlier, so deployments move faster and with a lower total cost.',
		title: 'Deploy faster, spend less',
	},
] as const;

const DELIVERY_FOUNDATIONS = [
	{
		description:
			'Years of operating production GPU infrastructure inform the hardware, network, and support decisions behind every design.',
		title: 'Experienced operators',
	},
	{
		description:
			'Our Dell and AMD relationships support current hardware selection, delivery planning, and lifecycle support.',
		title: 'Supply chain relationships',
	},
	{
		description:
			'We scope capacity and ongoing operations clearly, so the commercial model matches the work you need to run.',
		title: 'Clear commercial model',
	},
	{
		description:
			'Deploy into one of our facilities or bring your own data center, connectivity, and operating constraints.',
		title: 'Flexible deployment location',
	},
] as const;

const SERVICES = [
	{
		description: 'Match cluster topology, GPU density, and storage to the workload and budget.',
		title: 'Architecture and sizing',
	},
	{
		description:
			'Plan hardware delivery, network fabric, power, cooling, and installation as one system.',
		title: 'Deployment coordination',
	},
	{
		description:
			'Tune infrastructure choices for utilization, model serving, and production reliability.',
		title: 'Workload optimization',
	},
	{
		description:
			'Keep the environment maintainable with documented operations and direct access to the people who designed it.',
		title: 'Operational support',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Design and deploy AMD GPU clusters with Hot Aisle, from compact builds to large multi-node AI and HPC environments.',
		path: '/cluster',
		title: 'Cluster Design',
	});
}

export default function ClusterPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Cluster design services</p>
							<figure className="mt-10 max-w-sm border border-border bg-muted/20 p-3">
								<OptimizedImage
									alt="3D pixel-art data center construction site with server racks, crane, and construction equipment"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/cluster/data-center-construction-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/cluster/data-center-construction-pixel-art-light.png"
									width={1448}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									Data center construction plan
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Clusters designed for the work ahead.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								Design, deploy, and operate AMD GPU infrastructure with an
								experienced team accountable for the compute, storage, networking,
								and software layers beneath the workload.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<AppLink
									className="border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
									href="/contact"
								>
									Start a design conversation
								</AppLink>
							</div>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Engagement scope</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								A cluster is more than a GPU count.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We start with the workload, then make the hardware, facility,
								network, and operating model work together.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{CLUSTER_CAPABILITIES.map((capability) => (
							<article className="min-h-60 bg-background p-8" key={capability.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{capability.title}
								</h3>
								<p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
									{capability.description}
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
								A delivery partner that operates infrastructure.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								The decisions that matter most happen before hardware arrives. We
								bring operating experience to those decisions from the first design
								review.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{DELIVERY_FOUNDATIONS.map((foundation) => (
							<article className="min-h-56 bg-background p-8" key={foundation.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{foundation.title}
								</h3>
								<p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
									{foundation.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Services</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								From architecture through operations.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Bring us in for a focused design engagement or carry the work
								through deployment and ongoing operation.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
						{SERVICES.map((service) => (
							<article className="min-h-56 bg-background p-8" key={service.title}>
								<h3 className="font-bold text-foreground text-xl">
									{service.title}
								</h3>
								<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
									{service.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Start here</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Bring us the workload and constraints.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We will help map the compute, facility, network, and operating
								decisions into a deployable plan.
							</p>
							<AppLink
								className="mt-8 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/contact"
							>
								Start a design conversation
							</AppLink>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
