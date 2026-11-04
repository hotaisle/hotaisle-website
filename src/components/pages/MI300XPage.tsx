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
		<div className="animation-fade-in bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-12 md:py-14">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<figure className="border-border max-w-sm overflow-hidden border bg-white p-3 dark:bg-black">
								<OptimizedImage
									alt="AMD Instinct MI300X accelerator package and board"
									className="aspect-video w-full object-cover"
									fetchPriority="high"
									height={675}
									loading="eager"
									pictureClassName="hidden dark:block"
									responsiveWidths={[480, 672, 800]}
									sizes="(max-width: 640px) calc(100vw - 3rem), 384px"
									src="/assets/mi300x/mi300x-amd-press.jpg"
									width={1200}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-video w-full object-contain"
									fetchPriority="high"
									height={1200}
									loading="eager"
									pictureClassName="dark:hidden"
									responsiveWidths={[480, 672, 800]}
									sizes="(max-width: 640px) calc(100vw - 3rem), 384px"
									src="/assets/mi300x/mi300x-amd-product.jpg"
									width={1200}
								/>
								<figcaption className="border-border text-muted-foreground mt-3 border-t pt-3 font-mono text-xs">
									MI300X / 192 GB HBM3
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="text-foreground max-w-3xl text-5xl font-black tracking-tighter md:text-7xl">
								AMD Instinct MI300X
							</h1>
							<p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
								A high-memory AMD accelerator for production inference. Start with
								one isolated GPU VM or scale to an eight-GPU server without changing
								the operational model.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<AppLink
									className="border-foreground bg-foreground text-background border px-5 py-3 font-medium transition-colors hover:opacity-85"
									href="/quick-start"
								>
									Start now
								</AppLink>
								<AppLink
									className="border-border text-foreground hover:bg-muted border px-5 py-3 font-medium transition-colors"
									href="/benchmarks-and-analysis"
								>
									View benchmarks
								</AppLink>
							</div>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Built for memory-intensive serving
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							MI300X pairs a large HBM3 footprint with the bandwidth needed to serve
							open-source models reliably, without turning deployment into a hardware
							project for your team.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-sm-2 ha-inset-dividers-xl-4 bg-border mt-8 grid gap-y-px sm:grid-cols-2 xl:grid-cols-4">
						{MI300X_METRICS.map((metric) => (
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
							Capacity that does not get in the way
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							The accelerator is only part of the offering. Hot Aisle automates the
							networking, PXE, operating system, ROCm, virtualization, and billing
							layers required to make this capacity usable.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-md-3 bg-border mt-8 grid gap-y-px md:grid-cols-3">
						{INFERENCE_CHARACTERISTICS.map((characteristic) => (
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
							The accelerator, in a complete platform
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							Infrastructure is more useful when the physical system, virtualization
							model, and control surface are designed together.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-md-2 bg-border mt-8 grid gap-y-px md:grid-cols-2">
						{ARCHITECTURE_DETAILS.map((detail) => (
							<article className="bg-background p-6" key={detail.title}>
								<h3 className="text-foreground text-2xl font-bold">
									{detail.title}
								</h3>
								<p className="text-muted-foreground mt-4 max-w-md leading-relaxed">
									{detail.description}
								</p>
							</article>
						))}
					</div>

					<div className="border-border mt-8 grid gap-8 border-t pt-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h3 className="text-foreground text-3xl font-black">
							Ready when the workload is
						</h3>
						<div>
							<p className="text-muted-foreground max-w-xl leading-relaxed">
								Create a team, add credit, and provision isolated AMD GPU compute
								from the terminal UI, API, or CLI. No sales handoff is required.
							</p>
							<AppLink
								className="border-foreground bg-foreground text-background mt-6 inline-flex border px-5 py-3 font-medium transition-colors hover:opacity-85"
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
