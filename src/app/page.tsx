import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const PLATFORM_LAYERS = [
	{
		description:
			'NetBox-backed source of truth with our own custom integrations that turn inventory into usable capacity.',
		label: '01 / Foundation',
		title: 'Infrastructure intelligence',
	},
	{
		description:
			'Automated SONiC networking, PXE boot, host setup, operating systems, and current ROCm drivers.',
		label: '02 / Physical layer',
		title: 'Hardware brought online',
	},
	{
		description:
			'NUMA-balanced KVM virtual machines with direct GPU access, designed for performance without noisy neighbors.',
		label: '03 / Compute layer',
		title: 'Isolation by default',
	},
	{
		description:
			'One platform, exposed through our terminal UI (TUI), API, and CLI that your AI already knows how to use.',
		label: '04 / Developer layer',
		title: 'Capacity on command',
	},
] as const;

const OPERATING_POINTS = [
	'Credit card to running compute in under a minute',
	'Usage-based billing through Stripe, down to the minute',
	'One GPU VM, a dedicated node, or a complete bare-metal cluster',
	'Direct support from the people who operate the platform',
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
		image: '/assets/og/hot-aisle-share.png',
		imageAlt: 'Hot Aisle automated inference cloud',
		path: '/',
		title: 'Hot Aisle | Automated Inference Cloud',
	});
}

export default function Home() {
	return (
		<div className="ha-home overflow-x-hidden bg-background text-foreground">
			<section className="border-border border-b">
				<div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
					<div className="relative z-10 max-w-2xl">
						<p className="mb-7 font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
							Automated inference cloud
						</p>
						<h1 className="max-w-2xl font-semibold text-6xl leading-[1.02] sm:text-7xl lg:text-8xl">
							Compute that keeps pace with the work.
						</h1>
						<p className="mt-8 max-w-2xl text-muted-foreground text-xl leading-9 sm:text-2xl">
							Hot Aisle is novel developer-first cloud infrastructure for production
							sovereign inference workloads. We automate the layers beneath Kubernetes
							so your team can provision isolated AMD GPU compute in under a minute,
							without contacting sales first.
						</p>
						<div className="mt-9 flex flex-wrap gap-3">
							<AppLink
								className="inline-flex min-h-12 items-center gap-2 bg-foreground px-6 py-3 font-medium text-background text-base transition-opacity hover:opacity-80"
								href="/quick-start"
							>
								Launch compute
							</AppLink>
							<AppLink
								className="inline-flex min-h-12 items-center gap-2 border border-border px-6 py-3 font-medium text-base transition-colors hover:bg-muted"
								href="/contact"
							>
								Talk to an engineer
							</AppLink>
						</div>
						<div className="mt-12 grid max-w-2xl grid-cols-3 border-border border-y py-6 lg:w-[calc(100%+5rem)]">
							<div>
								<p className="font-mono text-2xl">&lt; 60 sec</p>
								<p className="mt-1 text-muted-foreground text-sm sm:text-base">
									to a running VM
								</p>
							</div>
							<div className="border-border border-x px-4">
								<p className="font-mono text-2xl">700+</p>
								<p className="mt-1 text-muted-foreground text-sm sm:text-base">
									customers served
								</p>
							</div>
							<div className="pl-4">
								<p className="font-mono text-2xl">3 years</p>
								<p className="mt-1 text-muted-foreground text-sm sm:text-base">
									operating in production
								</p>
							</div>
						</div>
					</div>

					<figure className="relative order-first mx-auto w-full max-w-3xl lg:order-0 lg:mr-0">
						<div className="pointer-events-none absolute inset-3 border border-hot-orange/20" />
						<OptimizedImage
							alt="3D pixel-art visualization of an automated GPU cloud platform"
							className="relative aspect-16/10 w-full object-cover dark:hidden"
							height={900}
							sizes="(max-width: 1024px) 100vw, 56vw"
							src="/assets/home/automated-inference-platform.png"
							width={1600}
						/>
						<OptimizedImage
							alt=""
							aria-hidden="true"
							className="relative hidden aspect-16/10 w-full object-cover dark:block"
							height={900}
							sizes="(max-width: 1024px) 100vw, 56vw"
							src="/assets/home/automated-inference-platform-dark.png"
							width={1600}
						/>
					</figure>
				</div>
			</section>

			<section className="border-border border-b bg-muted/35">
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-center lg:px-8">
					<p className="max-w-3xl text-lg text-muted-foreground leading-8 sm:text-xl">
						Built and operated by a team that believes infrastructure should feel
						responsive. Trusted by customers worldwide and partners including Dell, AMD,
						Advizex, and Broadcom.
					</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-foreground text-sm uppercase tracking-widest">
						<span>Dell</span>
						<span>AMD</span>
						<span>Advizex</span>
						<span>Broadcom</span>
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-28">
					<div>
						<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
							The work underneath
						</p>
						<h2 className="mt-5 max-w-xl font-semibold text-5xl sm:text-6xl">
							Kubernetes is not the first layer.
						</h2>
						<p className="mt-6 max-w-xl text-muted-foreground text-xl leading-9">
							Most providers stop at orchestration. We made the physical and virtual
							layers programmable too, so the request that reaches Kubernetes already
							has a network, an operating system, drivers, and a secure place to run.
						</p>
					</div>
					<div className="border-border border-t">
						{PLATFORM_LAYERS.map((layer) => (
							<article
								className="grid gap-4 border-border border-b py-6 sm:grid-cols-[10rem_1fr] sm:items-start"
								key={layer.title}
							>
								<div>
									<p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.12em]">
										{layer.label}
									</p>
									<h3 className="mt-2 font-medium text-xl">{layer.title}</h3>
								</div>
								<p className="text-lg text-muted-foreground leading-8">
									{layer.description}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b bg-foreground text-background">
				<div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
					<div>
						<p className="font-mono text-hot-orange text-xs uppercase tracking-[0.16em]">
							Run it your way
						</p>
						<h2 className="mt-5 max-w-2xl font-semibold text-5xl sm:text-6xl">
							One platform. No artificial ceiling.
						</h2>
						<p className="mt-6 max-w-2xl text-background/65 text-xl leading-9">
							Start with one GPU for one minute. Scale to a group of isolated compute.
							When the work needs it, move to a complete bare-metal cluster without
							moving to another vendor.
						</p>
					</div>
					<div className="border-background/20 border-t">
						{OPERATING_POINTS.map((point, index) => (
							<div className="border-background/20 border-b py-6 text-lg" key={point}>
								<p className="font-mono text-hot-orange text-xs">{`0${index + 1}`}</p>
								<p className="mt-3">{point}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
						<div>
							<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
								Built for the decision
							</p>
							<h2 className="mt-5 max-w-xl font-semibold text-5xl sm:text-6xl">
								Infrastructure developers can use. Terms leadership can defend.
							</h2>
						</div>
						<p className="max-w-3xl text-muted-foreground text-xl leading-9">
							Your team gets a fast, composable interface to compute. Your business
							gets clear pricing, hard isolation, and an operator accountable for the
							entire path from hardware to workload.
						</p>
					</div>
					<div className="mt-12 grid border-border border-t md:grid-cols-3">
						{LEADERSHIP_POINTS.map((point, index) => (
							<article
								className={`border-border border-b py-7 ${index ? 'md:border-l md:pl-7' : 'md:pr-7'}`}
								key={point.title}
							>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{String(index + 1).padStart(2, '0')}
								</p>
								<h3 className="mt-5 font-medium text-xl">{point.title}</h3>
								<p className="mt-3 max-w-sm text-lg text-muted-foreground leading-8">
									{point.description}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b bg-muted/35">
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
					<div>
						<h2 className="font-medium text-3xl">
							Private workload, visible operations.
						</h2>
						<p className="mt-4 max-w-3xl text-lg text-muted-foreground leading-8 sm:text-xl">
							We monitor platform health and account usage, not the contents of your
							work. Bare-metal customers control the whole machine. We keep the
							environment secure, well-run, and backed by a support team that answers
							like owners, because we are the owners.
						</p>
					</div>
					<AppLink
						className="inline-flex min-h-12 items-center gap-2 border border-border px-6 py-3 font-medium text-base transition-colors hover:bg-background"
						href="/policies/security-and-compliance"
					>
						Security and compliance
					</AppLink>
				</div>
			</section>

			<section className="bg-background">
				<div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:py-28">
					<div>
						<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
							Compute is ready when you are
						</p>
						<h2 className="mt-5 max-w-4xl font-semibold text-5xl sm:text-7xl">
							Start with an inference request, not a sales process.
						</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						<AppLink
							className="inline-flex min-h-12 items-center gap-2 bg-hot-orange px-6 py-3 font-medium text-base text-white transition-opacity hover:opacity-85"
							href="/quick-start"
						>
							Launch compute
						</AppLink>
						<AppLink
							className="inline-flex min-h-12 items-center gap-2 border border-border px-6 py-3 font-medium text-base transition-colors hover:bg-muted"
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
