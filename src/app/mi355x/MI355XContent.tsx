import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';

const MI355X_METRICS = [
	{ label: 'HBM3E memory', value: '288 GB' },
	{ label: 'Memory bandwidth', value: '8 TB/s' },
	{ label: 'Accelerator power', value: '1,400 W' },
	{ label: 'Eight-GPU memory', value: '2.3 TB' },
] as const;

const PLATFORM_CHARACTERISTICS = [
	{
		description:
			'Direct liquid cooling allows the platform to sustain a larger power envelope while fitting an eight-accelerator UBB 2.0 system into a deployable rack design.',
		title: 'Liquid-cooled density',
	},
	{
		description:
			'Eight OAM accelerators connect across an AMD Infinity Fabric mesh, creating a coherent, high-memory system for large inference deployments.',
		title: 'A full-scale serving unit',
	},
	{
		description:
			'ROCm, hardened virtualization, and the automated layers beneath Kubernetes are part of the environment, not a follow-on integration project.',
		title: 'An operating platform, not just hardware',
	},
] as const;

const DEPLOYMENT_FOUNDATIONS = [
	{
		description:
			'Our relationships with AMD, Dell, Broadcom, and Advizex let us plan smaller regional deployments with realistic supply, networking, and service expectations.',
		title: 'A practical delivery path',
	},
	{
		description:
			'We are applying three years of automation and operator feedback to MI355X capacity, rather than building a new control plane around a new accelerator.',
		title: 'A platform that already operates',
	},
] as const;

export default function MI355XContent() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">
								AMD Instinct accelerator / capacity planning
							</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-muted/20 p-3">
								<OptimizedImage
									alt="3D pixel-art liquid-cooled AMD Instinct MI355X platform"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/mi355x/mi355x-inference-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/mi355x/mi355x-inference-pixel-art-light.png"
									width={1448}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									MI355X / 288 GB HBM3E
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								AMD Instinct MI355X.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								The next step in high-memory AMD inference capacity. MI355X brings
								liquid-cooled density and a larger memory envelope to full-scale,
								sovereign serving deployments.
							</p>
							<a
								className="mt-8 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="#reserve"
							>
								Request capacity
							</a>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">At a glance</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								More memory per accelerator. More room to operate.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								MI355X is designed for teams preparing to serve larger models, more
								concurrent users, and regional workloads without compromising on
								isolation or control.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
						{MI355X_METRICS.map((metric) => (
							<div className="min-h-44 bg-background p-7" key={metric.label}>
								<p className="font-mono text-muted-foreground text-xs uppercase">
									{metric.label}
								</p>
								<p className="mt-8 font-black text-3xl text-hot-orange-contrast md:text-4xl">
									{metric.value}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Platform profile</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Density without a new operating burden.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								The hardware advances, while the operating experience stays direct:
								a platform that turns capacity into isolated compute through the
								terminal UI, API, and CLI.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{PLATFORM_CHARACTERISTICS.map((characteristic, index) => (
							<article
								className="min-h-64 bg-background p-8"
								key={characteristic.title}
							>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{String(index + 1).padStart(2, '0')}
								</p>
								<h3 className="mt-10 font-bold text-2xl text-foreground">
									{characteristic.title}
								</h3>
								<p className="mt-4 text-muted-foreground leading-relaxed">
									{characteristic.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Deployment path</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Built to expand deliberately.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Our approach is smaller, well-operated deployments in more data
								centers, not a single oversized buildout. MI355X capacity fits that
								plan.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{DEPLOYMENT_FOUNDATIONS.map((foundation, index) => (
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
				</section>

				<section className="scroll-mt-24 border-border border-b py-16" id="reserve">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">MI355X capacity</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Plan the deployment before capacity arrives.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Share the deployment you are planning. We will use it to align
								hardware, networking, isolation requirements, and a realistic
								delivery path.
							</p>
						</div>
					</div>

					<div className="mt-12 border border-border bg-muted/20 p-3 md:p-5">
						<iframe
							className="min-h-200 w-full border-0 bg-background"
							src="https://tally.so/embed/wAZ1AB?alignLeft=1&hideTitle=1&transparentBackground=0&dynamicHeight=1"
							title="Request AMD MI355X capacity from Hot Aisle"
						/>
					</div>
					<p className="mt-5 text-muted-foreground text-sm">
						Capacity requests start a planning conversation; they are not a commitment
						to purchase.
					</p>
				</section>

				<section className="py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Available now</p>
						<div>
							<h2 className="font-black text-3xl text-foreground">
								Need inference compute today?
							</h2>
							<p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
								MI300X capacity is available through the same platform, with
								isolated VMs and bare metal provisioned without a sales handoff.
							</p>
							<AppLink
								className="mt-6 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/mi300x"
							>
								Explore MI300X
							</AppLink>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
