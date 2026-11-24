import { AppLink } from '@/components/AppLink.tsx';
import { VideoPreview } from '@/components/VideoPreview.tsx';
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
		label: 'Physical',
		title: 'Hardware brought online',
	},
	{
		description:
			'NUMA-balanced KVM virtual machines with direct GPU access, designed for performance without noisy neighbors.',
		label: 'Compute',
		title: 'Isolation by default',
	},
	{
		description:
			'One platform, exposed through our terminal UI (TUI), API, and CLI that your AI already knows how to use.',
		label: 'Developer',
		title: 'Capacity on command',
	},
	{
		description:
			'Your team builds and deploys products and solutions here, using Hot Aisle as the underlying infrastructure. Our own additional tooling and support for this layer are coming soon.',
		label: 'Application',
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
				<div className="mx-auto grid max-w-7xl items-start gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
					<div className="relative z-10 max-w-2xl">
						<h1 className="max-w-2xl text-6xl leading-[1.02] font-semibold sm:text-7xl lg:text-8xl">
							Your GPUs can take the night shift
						</h1>
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
					</div>

					<div className="mx-auto w-full max-w-3xl lg:mr-0">
						<figure>
							<VideoPreview
								className="ha-video-preview--corner border-border border"
								poster="/assets/home/the-night-shift-v3-poster.webp"
								src="/assets/home/the-night-shift-v3.mp4"
								title="The Night Shift"
							>
								<img
									alt="Hands typing at a keyboard in The Night Shift"
									className="block aspect-video w-full"
									fetchPriority="high"
									height={1080}
									loading="eager"
									src="/assets/home/the-night-shift-v3-poster.webp"
									width={1920}
								/>
							</VideoPreview>
						</figure>
						<p className="text-muted-foreground mt-8 max-w-2xl text-xl leading-9 sm:text-2xl">
							Hot Aisle is novel developer-first cloud infrastructure for production
							sovereign inference workloads. We automate the layers beneath Kubernetes
							so your team can provision isolated AMD GPU compute in under a minute,
							without contacting sales first.
						</p>
					</div>
					<div className="divide-border grid grid-cols-3 divide-x py-6 text-center lg:col-span-2">
						<div className="sm:px-6">
							<p className="font-mono text-base sm:text-2xl">&lt; 60 sec</p>
							<p className="text-muted-foreground mt-1 text-sm sm:text-base">
								to a running VM
							</p>
						</div>
						<div className="sm:px-6">
							<p className="font-mono text-base sm:text-2xl">490+</p>
							<p className="text-muted-foreground mt-1 text-sm sm:text-base">
								paying customers
							</p>
						</div>
						<div className="sm:px-6">
							<p className="font-mono text-base sm:text-2xl">3 years</p>
							<p className="text-muted-foreground mt-1 text-sm sm:text-base">
								operating in production
							</p>
						</div>
					</div>
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
					<div className="flex flex-col gap-6">
						<h2 className="text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl">
							Kubernetes is not the first layer
						</h2>
						<p className="text-muted-foreground max-w-4xl text-xl leading-9">
							Most providers stop at orchestration. We made the physical and virtual
							layers programmable too, so the request that reaches Kubernetes already
							has a network, an operating system, drivers, and a secure place to run.
						</p>
					</div>
					<div className="mt-8">
						{PLATFORM_LAYERS.map((layer) => (
							<article
								className="border-border grid gap-4 border-b py-6 last:border-b-0 sm:grid-cols-[18rem_1fr] sm:items-start"
								key={layer.title}
							>
								<div>
									<p className="text-hot-orange-contrast font-mono text-xs tracking-[0.12em] whitespace-nowrap uppercase">
										{layer.label}
									</p>
									<h3 className="mt-2 text-xl font-medium whitespace-nowrap">
										{layer.title}
									</h3>
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
					<div className="flex flex-col gap-6">
						<h2 className="text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl">
							One platform. No artificial ceiling
						</h2>
						<p className="text-muted-foreground max-w-4xl text-xl leading-9">
							Start with one GPU for one minute. Scale to a group of isolated compute.
							When the work needs it, move to a complete bare-metal cluster without
							moving to another vendor.
						</p>
					</div>
					<div className="mt-8">
						{OPERATING_POINTS.map((point) => (
							<div
								className="border-border grid gap-3 border-b py-6 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-6"
								key={point.label}
							>
								<p className="text-hot-orange-contrast text-2xl font-semibold">
									{point.label}
								</p>
								<p className="text-xl leading-relaxed lg:text-2xl">
									{point.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
					<div className="flex flex-col gap-6">
						<h2 className="text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl">
							Infrastructure developers can use. Terms leadership can defend
						</h2>
						<p className="text-muted-foreground max-w-4xl text-xl leading-9">
							Your team gets a fast, composable interface to compute. Your business
							gets clear pricing, hard isolation, and an operator accountable for the
							entire path from hardware to workload.
						</p>
					</div>
					<div className="ha-inset-dividers ha-inset-dividers-md-3 mt-8 grid md:grid-cols-3">
						{LEADERSHIP_POINTS.map((point, index) => (
							<article
								className={`py-7 ${index ? 'md:pl-7' : 'md:pr-7'}`}
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
