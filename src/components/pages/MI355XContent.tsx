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
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-white p-3 dark:bg-black">
								<OptimizedImage
									alt="AMD Instinct MI355X liquid-cooled accelerator platform"
									className="aspect-25/18 w-full object-contain"
									height={1166}
									src="/assets/mi355x/mi355ximage.png"
									width={1632}
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
								Read the MI355X update
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
						{PLATFORM_CHARACTERISTICS.map((characteristic) => (
							<article
								className="min-h-64 bg-background p-8"
								key={characteristic.title}
							>
								<h3 className="font-bold text-2xl text-foreground">
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
						{DEPLOYMENT_FOUNDATIONS.map((foundation) => (
							<article className="min-h-60 bg-background p-8" key={foundation.title}>
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

				<section className="scroll-mt-24 border-border border-b py-16" id="reserve">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Experiment complete</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								The signup form is gone. The signal is not.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We ran an experiment to see whether anyone would put real money
								behind future MI355X capacity. The response was much stronger than
								we expected.
							</p>
						</div>
					</div>

					<div className="mt-12 border border-border bg-muted/20">
						<div className="grid divide-y divide-border border-border border-b sm:grid-cols-2 sm:divide-x sm:divide-y-0">
							<div className="p-7">
								<p className="font-black text-5xl text-hot-orange-contrast">$100</p>
								<p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
									pledged by each person
								</p>
							</div>
							<div className="p-7">
								<p className="font-black text-5xl text-hot-orange-contrast">17×</p>
								<p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
									our expected response
								</p>
							</div>
						</div>

						<div className="grid gap-8 p-7 md:grid-cols-[0.65fr_1.35fr] md:p-10">
							<p className="max-w-xs font-black text-2xl text-foreground leading-tight md:text-3xl">
								Our little experiment returned a very loud answer.
							</p>
							<div className="max-w-2xl space-y-5 text-lg text-muted-foreground leading-relaxed">
								<p>
									That signup form was an experiment. It is over now, and we
									learned a lot from it. We asked people to pledge $100 toward
									future MI355X capacity.
								</p>
								<p>
									We are still raising the capital required to buy and deploy the
									hardware. Hot Aisle is a three-year-old business with more than
									$50 million in requests for MI355X capacity and a product built
									around what developers and businesses actually need.
								</p>
								<p>
									We are already in active conversations, but the right
									introduction could make a real difference. If you know someone
									who should hear our story, put us on a call together. We will
									make time immediately.
								</p>

								<div className="flex flex-wrap gap-3 pt-2">
									<AppLink
										className="inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-opacity hover:opacity-85"
										href="/investors"
									>
										Read the investor story
									</AppLink>
									<a
										className="inline-flex border border-border bg-background px-5 py-3 font-medium text-foreground transition-colors hover:border-foreground"
										href="mailto:hello@hotaisle.ai?subject=MI355X%20investment%20introduction"
									>
										hello@hotaisle.ai
									</a>
								</div>
							</div>
						</div>
					</div>
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
								isolated VMs and bare metal provisioned without a sales process.
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
