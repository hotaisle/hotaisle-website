import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const MI300X_METRICS = [
	{ label: 'HBM3 memory', value: '192 GB' },
	{ label: 'Memory bandwidth', value: '5.3 TB/s' },
	{ label: 'Compute units', value: '304' },
	{ label: 'Accelerators per server', value: '8x' },
] as const;

const INFERENCE_CHARACTERISTICS = [
	{
		description:
			'192 GB of local HBM3 gives serving teams room for larger models, longer context, and higher-concurrency deployments without treating memory as an afterthought.',
		title: 'Memory for the model you actually want to run',
	},
	{
		description:
			'5.3 TB/s of bandwidth keeps the accelerator supplied as requests move through the model, supporting responsive token generation at production scale.',
		title: 'Bandwidth for sustained generation',
	},
	{
		description:
			'Provision a NUMA-balanced KVM virtual machine for a single GPU, or take a complete eight-GPU server when the workload calls for it.',
		title: 'Isolation that matches the workload',
	},
] as const;

const ARCHITECTURE_DETAILS = [
	{
		description:
			'CDNA 3 combines eight XCDs, 304 compute units, and 256 MB of AMD Infinity Cache in a dense accelerator designed for model serving.',
		title: 'CDNA 3 architecture',
	},
	{
		description:
			'Eight MI300X accelerators are available in each Dell PowerEdge XE9680, with a high-bandwidth fabric and full-system automation already in place.',
		title: 'Eight-GPU system density',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'AMD Instinct MI300X compute for isolated production inference, available through the Hot Aisle terminal UI, API, and CLI.',
		image: '/assets/mi300x/mi300x-inference-pixel-art.png',
		imageAlt: '3D pixel-art AMD Instinct MI300X accelerator',
		path: '/mi300x',
		title: 'AMD MI300X',
	});
}

export default function MI300XPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">AMD Instinct accelerator</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-white p-3 dark:bg-black">
								<OptimizedImage
									alt="AMD Instinct MI300X accelerator package and board"
									className="aspect-video w-full object-cover"
									height={675}
									pictureClassName="hidden dark:block"
									src="/assets/mi300x/mi300x-amd-press.jpg"
									width={1200}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-video w-full object-contain"
									height={1200}
									pictureClassName="dark:hidden"
									src="/assets/mi300x/mi300x-amd-product.jpg"
									width={1200}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									MI300X / 192 GB HBM3
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								AMD Instinct MI300X.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								A high-memory AMD accelerator for production inference. Start with
								one isolated GPU VM or scale to an eight-GPU server without changing
								the operational model.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<AppLink
									className="border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
									href="/quick-start"
								>
									Start now
								</AppLink>
								<AppLink
									className="border border-border px-5 py-3 font-medium text-foreground transition-colors hover:bg-muted"
									href="/benchmarks-and-analysis"
								>
									View benchmarks
								</AppLink>
							</div>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">At a glance</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Built for memory-intensive serving.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								MI300X pairs a large HBM3 footprint with the bandwidth needed to
								serve open-source models reliably, without turning deployment into a
								hardware project for your team.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
						{MI300X_METRICS.map((metric) => (
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
						<p className="ha-briefing-label">Inference fit</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Capacity that does not get in the way.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								The accelerator is only part of the offering. Hot Aisle automates
								the networking, PXE, operating system, ROCm, virtualization, and
								billing layers required to make this capacity usable.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{INFERENCE_CHARACTERISTICS.map((characteristic) => (
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
						<p className="ha-briefing-label">System profile</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								The accelerator, in a complete platform.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Infrastructure is more useful when the physical system,
								virtualization model, and control surface are designed together.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{ARCHITECTURE_DETAILS.map((detail) => (
							<article className="min-h-60 bg-background p-8" key={detail.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{detail.title}
								</h3>
								<p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
									{detail.description}
								</p>
							</article>
						))}
					</div>

					<div className="mt-12 grid gap-8 border-border border-t pt-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Deploy MI300X</p>
						<div>
							<h3 className="font-black text-3xl text-foreground">
								Ready when the workload is.
							</h3>
							<p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
								Create a team, add credit, and provision isolated AMD GPU compute
								from the terminal UI, API, or CLI. No sales handoff is required.
							</p>
							<AppLink
								className="mt-6 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/quick-start"
							>
								Quick start
							</AppLink>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
