import { ArrowRight, BarChart2, Check, Cpu, Layers, Server, Share2, Zap } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'AMD Instinct MI300X specifications, deployment options, and performance characteristics for large-model inference and training.',
		image: '/assets/mi300x/mi300x-hero.png',
		imageAlt: 'AMD MI300X',
		path: '/mi300x',
		title: 'AMD MI300X',
	});
}

export default function MI300XPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* MI355x Announcement Banner */}
			<div className="animate-pulse bg-linear-to-r from-emerald-900 to-green-800 px-4 py-3 text-center font-bold text-sm text-white md:text-base">
				🔥 We are accepting MI355x reservations!
				<AppLink className="ml-2 underline hover:text-white/90" href="/mi355x">
					Reserve now
				</AppLink>
			</div>

			{/* Product Hero */}
			<div className="relative overflow-hidden border-border border-b bg-background px-6 py-24">
				<div className="absolute top-0 right-0 h-200 w-200 rounded-full bg-hot-orange/10 opacity-30 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-150 w-150 rounded-full bg-hot-orange/10 opacity-30 blur-3xl" />

				<div className="container relative z-10 mx-auto max-w-7xl">
					<div className="flex flex-col items-center gap-16 lg:flex-row">
						<div className="flex-1">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hot-orange/20 bg-hot-orange/10 px-3 py-1 font-bold text-hot-orange-contrast text-xs uppercase tracking-widest">
								<Zap className="fill-current" size={12} /> AMD Instinct™ Accelerator
							</div>
							<h1 className="mb-6 font-black text-5xl leading-tight tracking-tighter md:text-8xl">
								MI300X
							</h1>
							<h2 className="mb-8 max-w-2xl font-light text-2xl text-muted-foreground leading-snug md:text-3xl">
								<span>Leading-Edge, industry-standard accelerator module for </span>
								<span className="font-medium text-foreground">generative AI</span>
								<span>, training, and high-performance computing.</span>
							</h2>

							<div className="mb-10 grid max-w-lg grid-cols-2 gap-4">
								<div className="rounded-xl border border-border bg-card p-4">
									<div className="font-black text-3xl text-foreground">192GB</div>
									<div className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
										HBM3 Memory
									</div>
								</div>
								<div className="rounded-xl border border-border bg-card p-4">
									<div className="font-black text-3xl text-foreground">
										5.3 TB/s
									</div>
									<div className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
										Peak Bandwidth
									</div>
								</div>
								<div className="rounded-xl border border-border bg-card p-4">
									<div className="font-black text-3xl text-foreground">304</div>
									<div className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
										Compute Units
									</div>
								</div>
								<div className="rounded-xl border border-border bg-card p-4">
									<div className="font-black text-3xl text-foreground">8x</div>
									<div className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
										OAM Module Support
									</div>
								</div>
							</div>

							<div className="flex flex-wrap gap-4">
								<AppLink
									className="rounded-full bg-hot-orange px-8 py-4 font-bold text-lg text-white shadow-hot-orange/20 shadow-lg transition-all hover:scale-105 hover:opacity-90"
									href="/quick-start"
								>
									Deploy MI300X
								</AppLink>
								<AppLink
									className="flex items-center rounded-full border border-border bg-muted px-8 py-4 font-bold text-foreground text-lg transition-all hover:bg-muted/80"
									href="/benchmarks-and-analysis"
								>
									View Benchmarks <ArrowRight className="ml-2" size={18} />
								</AppLink>
							</div>
						</div>
						<div className="relative w-full flex-1">
							<div className="relative flex aspect-square items-center justify-center">
								<OptimizedImage
									alt="AMD Instinct MI300X"
									className="relative z-20 mx-auto w-full max-w-2xl drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
									height={745}
									src="/assets/compute/gpu.png"
									width={864}
								/>
								<div className="absolute inset-0 z-10 rounded-full bg-linear-to-tr from-hot-orange/20 to-transparent blur-[100px]" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Sections */}
			<div className="container mx-auto max-w-5xl space-y-32 px-6 py-24">
				{/* Leading-Edge Discrete GPU */}
				<section className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
					<div className="md:col-span-4">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-hot-orange">
							<Cpu size={32} />
						</div>
						<h3 className="mb-4 font-black text-3xl">
							Leading-Edge Discrete GPU for AI and HPC
						</h3>
					</div>
					<div className="prose prose-lg dark:prose-invert text-muted-foreground md:col-span-8">
						<p className="lead font-medium text-foreground">
							The AMD Instinct™ MI300X discrete GPU is based on next-generation AMD
							CDNA™ 3 architecture, delivering leadership efficiency and performance
							for the most demanding AI and HPC applications.
						</p>
						<p>
							It is designed with 304 high-throughput compute units, AI-specific
							functions including new data-type support, photo and video decoding,
							<span>plus an unprecedented </span>
							<strong className="mr-1 text-foreground">192 GB of HBM3 memory</strong>
							<span>
								on a GPU accelerator. Using state-of-the-art die stacking and
								chiplet
							</span>
							technology in a multi-chip package propels generative AI, machine
							learning, and inferencing, while extending AMD leadership in HPC
							acceleration.
						</p>
						<div className="not-prose my-8 rounded-xl border-hot-orange border-l-4 bg-muted/30 p-6">
							<h4 className="mb-2 flex items-center font-bold text-foreground">
								<BarChart2 className="mr-2 text-hot-orange" size={18} /> Performance
								Leap
							</h4>
							<p className="text-sm">
								The MI300X offers outstanding performance to our prior generation,
								<span> offering </span>
								<span className="mr-1 font-bold text-foreground">
									13.7x the peak AI/ML workload performance
								</span>
								<span>
									using FP8 with sparsity compared to prior AMD MI250X
									accelerators using FP16 and a
								</span>
								<span className="mx-1 font-bold text-foreground">
									3.4x peak advantage
								</span>
								<span>for HPC workloads on FP32 calculations.</span>
							</p>
						</div>
					</div>
				</section>

				{/* Designed to Accelerate */}
				<section className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
					<div className="md:col-span-4">
						<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-hot-orange">
							<Zap size={32} />
						</div>
						<h3 className="mb-4 font-black text-3xl">
							Designed to Accelerate Modern Workloads
						</h3>
					</div>
					<div className="prose prose-lg dark:prose-invert text-muted-foreground md:col-span-8">
						<p>
							The increasing demands of generative AI, large-language models, machine
							learning training, and inferencing puts next-level demands on GPU
							accelerators. The discrete AMD Instinct MI300X GPU delivers leadership
							performance with efficiency that can help organizations get more
							computation done within a similar power envelope compared to
							last-generation accelerators.
						</p>
						<p>
							For HPC workloads, efficiency is essential, and AMD Instinct GPUs have
							been deployed in some of the most efficient supercomputers on the
							Green500 supercomputer list. These types of systems—and yours—can take
							advantage of a broad range of math precisions to push high-performance
							computing (HPC) applications to new heights.
						</p>
					</div>
				</section>

				{/* Architecture Specs */}
				<section>
					<div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl md:p-12">
						<div className="pointer-events-none absolute top-0 right-0 h-125 w-125 rounded-full bg-linear-to-b from-hot-orange/10 to-transparent opacity-20 blur-3xl" />

						<div className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
							<div className="mb-6 inline-block rounded-full bg-muted p-3">
								<Layers className="text-hot-orange" size={32} />
							</div>
							<h2 className="mb-6 font-black text-4xl">
								Based on 4th Gen Infinity Architecture
							</h2>
							<p className="text-muted-foreground text-xl">
								The AMD Instinct MI300X is one of the first AMD CDNA 3 architecture
								based accelerators with high throughput based on improved AMD Matrix
								Core technology and highly streamlined compute units.
							</p>
						</div>

						<div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2">
							<div>
								<h3 className="mb-4 flex items-center gap-2 font-bold text-xl">
									<Share2 className="text-hot-orange" size={24} /> Multi-Chip
									Architecture
								</h3>
								<p className="mb-6 text-muted-foreground">
									The MI300X uses state-of-the-art die stacking and chiplet
									technology enabling dense compute and high-bandwidth memory
									integration. This helps reduce data-movement overhead while
									enhancing power efficiency.
								</p>
								<ul className="space-y-3">
									<li className="flex items-start">
										<Check
											className="mt-1 mr-3 shrink-0 text-green-500"
											size={18}
										/>
										<span className="text-sm">
											<strong>8 XCDs</strong> with 38 compute units each
										</span>
									</li>
									<li className="flex items-start">
										<Check
											className="mt-1 mr-3 shrink-0 text-green-500"
											size={18}
										/>
										<span className="text-sm">
											<strong>256 MB</strong> AMD Infinity Cache™
										</span>
									</li>
									<li className="flex items-start">
										<Check
											className="mt-1 mr-3 shrink-0 text-green-500"
											size={18}
										/>
										<span className="text-sm">
											<strong>4 Supported Decoders</strong> (HEVC/H.265, AV1,
											etc.)
										</span>
									</li>
								</ul>
							</div>

							<div>
								<h3 className="mb-4 flex items-center gap-2 font-bold text-xl">
									<Server className="text-hot-orange" size={24} /> Coherent Shared
									Memory
								</h3>
								<p className="mb-6 text-muted-foreground">
									Machine-learning and large-language models have become highly
									data intensive. AMD Instinct accelerators facilitate large
									models with shared memory and caches.
								</p>
								<ul className="space-y-3">
									<li className="flex items-start">
										<Check
											className="mt-1 mr-3 shrink-0 text-green-500"
											size={18}
										/>
										<span className="text-sm">
											<strong>192 GB HBM3</strong> shared coherently
										</span>
									</li>
									<li className="flex items-start">
										<Check
											className="mt-1 mr-3 shrink-0 text-green-500"
											size={18}
										/>
										<span className="text-sm">
											<strong>5.3 TB/s</strong> local bandwidth
										</span>
									</li>
									<li className="flex items-start">
										<Check
											className="mt-1 mr-3 shrink-0 text-green-500"
											size={18}
										/>
										<span className="text-sm">
											<strong>128 GB/s</strong> bidirectional bandwidth per
											GPU
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				<div className="border-border border-t pt-10 text-center">
					<p className="mb-6 text-muted-foreground">
						For more information about the AMD Instinct MI300X, the AMD Instinct MI300X
						Platform, and the AMD ROCm™ software platform, visit AMD.com/INSTINCT.
					</p>
					<AppLink
						className="inline-flex items-center font-bold text-hot-orange hover:underline hover:opacity-80"
						href="/quick-start"
					>
						Ready to deploy? Get started now <ArrowRight className="ml-2" size={16} />
					</AppLink>
				</div>
			</div>
		</div>
	);
}
