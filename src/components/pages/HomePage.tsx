import { AppLink } from '@/components/AppLink.tsx';
import { HomeCrawler } from '@/components/home/HomeCrawler.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const PLATFORM_LAYERS = [
	{
		description:
			'NetBox-backed source of truth with our own custom integrations that turn inventory into usable capacity.',
		label: 'Foundation',
		title: 'Infrastructure intelligence',
	},
	{
		description:
			'Automated SONiC networking, PXE boot, host setup, operating systems, and current ROCm drivers.',
		label: 'Physical layer',
		title: 'Hardware brought online',
	},
	{
		description:
			'NUMA-balanced KVM virtual machines with direct GPU access, designed for performance without noisy neighbors.',
		label: 'Compute layer',
		title: 'Isolation by default',
	},
	{
		description:
			'One platform, exposed through our terminal UI (TUI), API, and CLI that your AI already knows how to use.',
		label: 'Developer layer',
		title: 'Capacity on command',
	},
	{
		description:
			'Your team builds and deploys products and solutions here, using Hot Aisle as the underlying infrastructure. Our own additional tooling and support for this layer are coming soon.',
		label: 'Application layer',
		title: 'Build and deploy',
	},
] as const;

const PARTNERS = [
	{ href: 'https://www.dell.com/', name: 'Dell' },
	{ href: 'https://www.amd.com/', name: 'AMD' },
	{ href: 'https://www.advizex.com/', name: 'Advizex' },
	{ href: 'https://www.broadcom.com/', name: 'Broadcom' },
] as const;

const OPERATING_POINTS = [
	{
		description: 'Credit card to running compute in under a minute',
		label: 'Provision',
	},
	{
		description: 'Usage-based billing through Stripe, down to the minute',
		label: 'Meter',
	},
	{
		description: 'One GPU VM, a dedicated node, or a complete bare-metal cluster',
		label: 'Grow',
	},
	{
		description: 'Direct support from the people who operate the platform',
		label: 'Support',
	},
] as const;

const LEADERSHIP_POINTS = [
	{
		description:
			'No large reservation, procurement cycle, or cloud minimum before you can prove the workload.',
		title: 'Control the spend',
	},
	{
		description:
			'Run inference on isolated virtual machines or take control of dedicated bare metal when the stakes rise.',
		title: 'Control the boundary',
	},
	{
		description:
			'Automation replaces handoffs and ticket queues, so capacity changes can follow the business.',
		title: 'Control the timeline',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Automated AMD inference cloud. Launch isolated GPU compute in under a minute through the Hot Aisle terminal UI, API, or CLI.',
		image: '/assets/og/hot-aisle-inference-cloud.png',
		imageAlt: 'Hot Aisle automated inference cloud',
		path: '/',
		title: 'Hot Aisle | Automated Inference Cloud',
	});
}

export default function Home() {
	return (
		<div className="ha-home bg-background text-foreground overflow-x-hidden">
			<section className="border-border border-b">
				<div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
					<div className="relative z-10 max-w-2xl">
						<h1 className="max-w-2xl text-6xl leading-[1.02] font-semibold sm:text-7xl lg:text-8xl">
							Compute that keeps pace with the work
						</h1>
						<p className="text-muted-foreground mt-8 max-w-2xl text-xl leading-9 sm:text-2xl">
							Hot Aisle is novel developer-first cloud infrastructure for production
							sovereign inference workloads. We automate the layers beneath Kubernetes
							so your team can provision isolated AMD GPU compute in under a minute,
							without contacting sales first.
						</p>
						<div className="mt-9 flex flex-wrap gap-3">
							<AppLink
								className="bg-foreground text-background inline-flex min-h-12 items-center gap-2 px-6 py-3 text-base font-medium transition-opacity hover:opacity-80"
								href="/quick-start"
							>
								Launch compute
							</AppLink>
							<AppLink
								className="border-border hover:bg-muted inline-flex min-h-12 items-center gap-2 border px-6 py-3 text-base font-medium transition-colors"
								href="/contact"
							>
								Talk to an engineer
							</AppLink>
						</div>
						<div className="ha-inset-dividers ha-inset-dividers-cols-3 border-border mt-8 grid max-w-2xl grid-cols-3 border-y py-6 lg:w-[calc(100%+5rem)]">
							<div>
								<p className="font-mono text-2xl">&lt; 60 sec</p>
								<p className="text-muted-foreground mt-1 text-sm sm:text-base">
									to a running VM
								</p>
							</div>
							<div className="px-4">
								<p className="font-mono text-2xl">700+</p>
								<p className="text-muted-foreground mt-1 text-sm sm:text-base">
									customers served
								</p>
							</div>
							<div className="pl-4">
								<p className="font-mono text-2xl">3 years</p>
								<p className="text-muted-foreground mt-1 text-sm sm:text-base">
									operating in production
								</p>
							</div>
						</div>
					</div>

					<figure className="relative order-first mx-auto w-full max-w-3xl lg:order-0 lg:mr-0">
						<div className="border-hot-orange/20 pointer-events-none absolute inset-3 border" />
						<OptimizedImage
							alt="3D pixel-art visualization of an automated GPU cloud platform"
							className="relative aspect-16/10 w-full object-cover dark:hidden"
							fetchPriority="high"
							height={900}
							loading="eager"
							responsiveWidths={[480, 672, 800]}
							sizes="(max-width: 1024px) 100vw, 45vw"
							src="/assets/home/automated-inference-platform.png"
							width={1600}
						/>
						<OptimizedImage
							alt=""
							aria-hidden="true"
							className="relative hidden aspect-16/10 w-full object-cover dark:block"
							fetchPriority="high"
							height={900}
							loading="eager"
							responsiveWidths={[480, 672, 800]}
							sizes="(max-width: 1024px) 100vw, 45vw"
							src="/assets/home/automated-inference-platform-dark.png"
							width={1600}
						/>
						<HomeCrawler />
					</figure>
				</div>
			</section>

			<section className="border-border bg-muted/35 border-b">
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-center lg:px-8">
					<p className="text-muted-foreground max-w-3xl text-lg leading-8 sm:text-xl">
						Built and operated by a team that believes infrastructure should feel
						responsive. Trusted by customers worldwide and partners.
					</p>
					<div className="text-foreground flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm tracking-widest uppercase">
						{PARTNERS.map((partner) => (
							<a
								aria-label={`${partner.name} website (opens in a new tab)`}
								className="text-foreground focus-visible:outline-hot-orange-contrast no-underline focus-visible:outline-2 focus-visible:outline-offset-4"
								href={partner.href}
								key={partner.name}
								rel="noopener noreferrer"
								target="_blank"
							>
								{partner.name}
							</a>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="max-w-xl text-5xl font-semibold sm:text-6xl">
							Kubernetes is not the first layer
						</h2>
						<p className="text-muted-foreground max-w-3xl text-xl leading-9">
							Most providers stop at orchestration. We made the physical and virtual
							layers programmable too, so the request that reaches Kubernetes already
							has a network, an operating system, drivers, and a secure place to run.
						</p>
					</div>
					<div className="border-border mt-8 border-t">
						{PLATFORM_LAYERS.map((layer) => (
							<article
								className="border-border grid gap-4 border-b py-6 sm:grid-cols-[12rem_1fr] sm:items-start"
								key={layer.title}
							>
								<div>
									<p className="text-hot-orange-contrast font-mono text-xs tracking-[0.12em] whitespace-nowrap uppercase">
										{layer.label}
									</p>
									<h3 className="mt-2 text-xl font-medium">{layer.title}</h3>
								</div>
								<p className="text-muted-foreground text-lg leading-8">
									{layer.description}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border bg-muted/70 border-b">
				<div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="max-w-2xl text-5xl font-semibold sm:text-6xl">
							One platform. No artificial ceiling
						</h2>
						<p className="text-muted-foreground max-w-3xl text-xl leading-9">
							Start with one GPU for one minute. Scale to a group of isolated compute.
							When the work needs it, move to a complete bare-metal cluster without
							moving to another vendor.
						</p>
					</div>
					<div className="border-border mt-8 border-t">
						{OPERATING_POINTS.map((point) => (
							<div
								className="border-border grid gap-3 border-b py-6 text-lg sm:grid-cols-[8rem_1fr] sm:items-baseline"
								key={point.label}
							>
								<p className="text-hot-orange-contrast font-mono text-xs tracking-[0.12em] uppercase">
									{point.label}
								</p>
								<p>{point.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
						<div>
							<h2 className="max-w-xl text-5xl font-semibold sm:text-6xl">
								Infrastructure developers can use. Terms leadership can defend
							</h2>
						</div>
						<p className="text-muted-foreground max-w-3xl text-xl leading-9">
							Your team gets a fast, composable interface to compute. Your business
							gets clear pricing, hard isolation, and an operator accountable for the
							entire path from hardware to workload.
						</p>
					</div>
					<div className="ha-inset-dividers ha-inset-dividers-md-3 border-border mt-8 grid border-t md:grid-cols-3">
						{LEADERSHIP_POINTS.map((point, index) => (
							<article
								className={`border-border border-b py-7 ${index ? 'md:pl-7' : 'md:pr-7'}`}
								key={point.title}
							>
								<h3 className="text-xl font-medium">{point.title}</h3>
								<p className="text-muted-foreground mt-3 max-w-sm text-lg leading-8">
									{point.description}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border bg-muted/35 border-b">
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:px-8">
					<h2 className="text-3xl font-medium">Private workload, visible operations</h2>
					<div>
						<p className="text-muted-foreground max-w-3xl text-lg leading-8 sm:text-xl">
							We monitor platform health and account usage, not the contents of your
							work. Bare-metal customers control the whole machine. We keep the
							environment secure, well-run, and backed by a support team that answers
							like owners, because we are the owners.
						</p>
						<AppLink
							className="border-border hover:bg-background mt-6 inline-flex min-h-12 items-center gap-2 border px-6 py-3 text-base font-medium transition-colors"
							href="/policies/security-and-compliance"
						>
							Security and compliance
						</AppLink>
					</div>
				</div>
			</section>

			<section className="bg-background">
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:py-20">
					<div>
						<h2 className="max-w-4xl text-5xl font-semibold sm:text-7xl">
							Start with an inference request, not a sales process
						</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						<AppLink
							className="bg-hot-orange inline-flex min-h-12 items-center gap-2 px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-85"
							href="/quick-start"
						>
							Launch compute
						</AppLink>
						<AppLink
							className="border-border hover:bg-muted inline-flex min-h-12 items-center gap-2 border px-6 py-3 text-base font-medium transition-colors"
							href="/docs/api"
						>
							Explore the API
						</AppLink>
					</div>
				</div>
			</section>
		</div>
	);
}
