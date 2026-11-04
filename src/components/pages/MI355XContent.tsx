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
		<div className="animation-fade-in bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-12 md:py-14">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<figure className="border-border max-w-sm overflow-hidden border bg-white p-3 dark:bg-black">
								<OptimizedImage
									alt="AMD Instinct MI355X liquid-cooled accelerator platform"
									className="aspect-25/18 w-full object-contain"
									height={1166}
									src="/assets/mi355x/mi355ximage.png"
									width={1632}
								/>
								<figcaption className="border-border text-muted-foreground mt-3 border-t pt-3 font-mono text-xs">
									MI355X / 288 GB HBM3E
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="text-foreground max-w-3xl text-5xl font-black tracking-tighter md:text-7xl">
								AMD Instinct MI355X
							</h1>
							<p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
								The next step in high-memory AMD inference capacity. MI355X brings
								liquid-cooled density and a larger memory envelope to full-scale,
								sovereign serving deployments.
							</p>
							<a
								className="border-foreground bg-foreground text-background mt-8 inline-flex border px-5 py-3 font-medium transition-colors hover:opacity-85"
								href="#reserve"
							>
								Read the MI355X update
							</a>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							More memory per accelerator. More room to operate
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							MI355X is designed for teams preparing to serve larger models, more
							concurrent users, and regional workloads without compromising on
							isolation or control.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-sm-2 ha-inset-dividers-xl-4 bg-border mt-8 grid gap-y-px sm:grid-cols-2 xl:grid-cols-4">
						{MI355X_METRICS.map((metric) => (
							<div className="bg-background p-6" key={metric.label}>
								<p className="text-muted-foreground font-mono text-xs uppercase">
									{metric.label}
								</p>
								<p className="text-hot-orange-contrast mt-8 text-3xl font-black md:text-4xl">
									{metric.value}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Density without a new operating burden
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							The hardware advances, while the operating experience stays direct: a
							platform that turns capacity into isolated compute through the terminal
							UI, API, and CLI.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-md-3 bg-border mt-8 grid gap-y-px md:grid-cols-3">
						{PLATFORM_CHARACTERISTICS.map((characteristic) => (
							<article className="bg-background p-6" key={characteristic.title}>
								<h3 className="text-foreground text-2xl font-bold">
									{characteristic.title}
								</h3>
								<p className="text-muted-foreground mt-4 leading-relaxed">
									{characteristic.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Built to expand deliberately
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							Our approach is smaller, well-operated deployments in more data centers,
							not a single oversized buildout. MI355X capacity fits that plan.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-md-2 bg-border mt-8 grid gap-y-px md:grid-cols-2">
						{DEPLOYMENT_FOUNDATIONS.map((foundation) => (
							<article className="bg-background p-6" key={foundation.title}>
								<h3 className="text-foreground text-2xl font-bold">
									{foundation.title}
								</h3>
								<p className="text-muted-foreground mt-4 max-w-md leading-relaxed">
									{foundation.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border scroll-mt-24 border-b py-12" id="reserve">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							The signup form is gone. The signal is not
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							We ran an experiment to see whether anyone would put real money behind
							future MI355X capacity. The response was much stronger than we expected.
						</p>
					</div>

					<div className="border-border bg-muted/20 mt-8 border">
						<div className="ha-inset-dividers ha-inset-dividers-sm-2 border-border bg-border grid gap-y-px border-b sm:grid-cols-2">
							<div className="bg-muted/20 p-7">
								<p className="text-hot-orange-contrast text-5xl font-black">$100</p>
								<p className="text-muted-foreground mt-3 font-mono text-xs uppercase">
									pledged by each person
								</p>
							</div>
							<div className="bg-muted/20 p-7">
								<p className="text-hot-orange-contrast text-5xl font-black">17×</p>
								<p className="text-muted-foreground mt-3 font-mono text-xs uppercase">
									our expected response
								</p>
							</div>
						</div>

						<div className="grid gap-8 p-7 md:grid-cols-[0.65fr_1.35fr] md:p-10">
							<p className="text-foreground max-w-xs text-2xl leading-tight font-black md:text-3xl">
								Our little experiment returned a very loud answer.
							</p>
							<div className="text-muted-foreground max-w-2xl space-y-5 text-lg leading-relaxed">
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
										className="border-foreground bg-foreground text-background inline-flex border px-5 py-3 font-medium transition-opacity hover:opacity-85"
										href="/investors"
									>
										Read the investor story
									</AppLink>
									<a
										className="border-border bg-background text-foreground hover:border-foreground inline-flex border px-5 py-3 font-medium transition-colors"
										href="mailto:hello@hotaisle.ai?subject=MI355X%20investment%20introduction"
									>
										hello@hotaisle.ai
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-3xl font-black">
							Need inference compute today?
						</h2>
						<div>
							<p className="text-muted-foreground max-w-xl leading-relaxed">
								MI300X capacity is available through the same platform, with
								isolated VMs and bare metal provisioned without a sales process.
							</p>
							<AppLink
								className="border-foreground bg-foreground text-background mt-6 inline-flex border px-5 py-3 font-medium transition-colors hover:opacity-85"
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
