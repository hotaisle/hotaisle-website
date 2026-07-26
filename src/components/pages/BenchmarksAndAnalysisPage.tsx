import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const REFERENCES = [
	{
		source: 'Reddit',
		title: 'MI300X community and current discussion',
		url: 'https://www.reddit.com/r/AMD_MI300/',
	},
	{
		source: 'Hugging Face',
		title: 'Magnum 72B, trained on AMD MI300X',
		url: 'https://huggingface.co/AlpinDale/Magnum-72B-v1',
	},
	{
		source: 'Reddit',
		title: 'AMD MI300X vs. Nvidia H100 FFT benchmark',
		url: 'https://www.reddit.com/r/AMD_MI300/comments/1djex3j/amd_mi300x_and_nvidia_h100_benchmarking_in_fft/',
	},
	{
		source: 'Reddit',
		title: 'Single MI300X vLLM benchmark',
		url: 'https://www.reddit.com/r/AMD_MI300/comments/1dgimxt/benchmarking_brilliance_single_amd_mi300x_vllm/',
	},
	{
		source: 'Reddit',
		title: 'MI300X Geekbench OpenCL performance',
		url: 'https://www.reddit.com/r/AMD_MI300/comments/1dfr0qx/amd_instinct_mi300x_now_the_fastest_gpu_in/',
	},
	{
		source: 'Chips and Cheese',
		title: 'Testing AMD’s Bergamo',
		url: 'https://chipsandcheese.com/2023/08/11/testing-amds-bergamo-zen-4c-spam/',
	},
	{
		source: 'Oracle Cloud',
		title: 'Early LLM serving experience with MI300X',
		url: 'https://blogs.oracle.com/cloud-infrastructure/post/llm-performance-results-amd-instinct-mi300x-gpus',
	},
	{
		source: 'Chips and Cheese',
		title: 'Testing AMD’s Giant MI300X',
		url: 'https://chipsandcheese.com/2024/06/25/testing-amds-giant-mi300x/',
	},
	{
		source: 'Nscale',
		title: 'MI300X GEMM tuning and throughput',
		url: 'https://nscale.com/blog',
	},
	{
		source: 'RunPod',
		title: 'MI300X vs. Nvidia H100 SXM for Mixtral 8x7B',
		url: 'https://blog.runpod.io/amd-mi300x-vs-nvidia-h100-sxm-performance-comparison-on-mixtral-8x7b-inference/',
	},
	{
		source: 'AMD Community',
		title: 'MLPerf results on MI300X',
		url: 'https://community.amd.com/t5/instinct-accelerators/engineering-insights-unveiling-mlperf-results-on-amd-instinct/ba-p/697968',
	},
	{
		source: 'GitHub',
		title: 'Updated MI300X GEMM tuning with Gradlib',
		url: 'https://github.com/ROCm/TextPrompt',
	},
	{
		source: 'dstack',
		title: 'Llama 3.1 405B on 8x MI300X',
		url: 'https://dstack.ai/blog/amd-mi300x-inference-benchmark/',
	},
	{
		source: 'Fireworks.ai',
		title: 'FireAttention V3 and AMD inference',
		url: 'https://fireworks.ai/blog/fireattention-v3',
	},
	{
		source: 'AMD Community',
		title: 'Tuning vLLM for efficient inferencing',
		url: 'https://community.amd.com/t5/instinct-accelerators/tuning-for-efficient-inferencing-with-vllm-on-amd-instinct/ba-p/701889',
	},
	{
		source: 'AMD Community',
		title: 'vLLM serving best practices on MI300X',
		url: 'https://community.amd.com/t5/instinct-accelerators/vllm-serving-llms-on-amd-instinct/ba-p/698717',
	},
	{
		source: 'LinkedIn Engineering',
		title: 'Liger Kernels and the CUDA moat',
		url: 'https://engineering.linkedin.com/blog/2024/liger-kernels-leap-the-cuda-moat',
	},
	{
		source: 'Medium',
		title: 'Anton Lokhmotov’s MLPerf CPU benchmarks',
		url: 'https://medium.com/@anton_lokhmotov',
	},
	{
		source: 'LinkedIn',
		title: 'Hot Aisle 8x MI300X speed test',
		url: 'https://www.linkedin.com/feed/update/urn:li:activity:7242250100055105536/',
	},
	{
		source: 'SemiAnalysis',
		title: 'Faster tokens for fewer dollars',
		url: 'https://www.semianalysis.com/p/cranking-out-faster-tokens-for-fewer',
	},
] as const;

const EVALUATION_CONTEXT = [
	{
		description:
			'Compare the model, quantization, context length, batch size, and serving runtime before comparing throughput figures.',
		title: 'Match the workload',
	},
	{
		description:
			'Performance is a system result. GPU, CPU, memory, network, storage, drivers, and runtime configuration all contribute.',
		title: 'Read the full system',
	},
	{
		description:
			'Use third-party data as a starting point, then validate the configuration and operating conditions that matter to your deployment.',
		title: 'Validate in context',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Independent benchmarks, performance analysis, and third-party references for AMD MI300X workloads and infrastructure.',
		path: '/benchmarks-and-analysis',
		title: 'Benchmarks and Analysis',
	});
}

export default function BenchmarksPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Benchmarks and analysis</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-muted/20 p-3">
								<OptimizedImage
									alt="3D pixel-art GPU performance lab with server racks and benchmark displays"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/benchmarks/performance-lab-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/benchmarks/performance-lab-pixel-art-light.png"
									width={1448}
								/>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs">
									Measured workload, not marketing shorthand
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Evidence, not assertions.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								A curated index of third-party benchmarks, engineering analysis, and
								operational references for AMD MI300X infrastructure and inference
								workloads.
							</p>
							<AppLink
								className="mt-8 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/quick-start"
							>
								Start now
							</AppLink>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">How to read results</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Benchmark context is part of the result.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Useful benchmarks document what was tested and how. These references
								are intended to help you frame the right questions before running
								your own.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{EVALUATION_CONTEXT.map((context) => (
							<article className="min-h-56 bg-background p-8" key={context.title}>
								<h3 className="font-bold text-2xl text-foreground">
									{context.title}
								</h3>
								<p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
									{context.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Reference index</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Research, benchmarks, and field reports.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								External sources from engineering teams, cloud providers,
								researchers, and the AMD community.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-2">
						{REFERENCES.map((reference) => (
							<a
								className="group flex min-h-48 flex-col bg-background p-8 transition-colors hover:bg-muted"
								href={reference.url}
								key={reference.url}
								rel="noopener"
								target="_blank"
							>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{reference.source}
								</p>
								<h3 className="mt-8 max-w-xl font-bold text-2xl text-foreground group-hover:text-hot-orange-contrast">
									{reference.title}
								</h3>
								<span className="mt-auto pt-6 font-medium text-hot-orange-contrast text-sm">
									Open source
								</span>
							</a>
						))}
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Your workload</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Run the test that matters to you.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Bring your model, runtime, and request profile to an isolated AMD
								GPU VM, then validate performance against your own operating
								requirements.
							</p>
							<AppLink
								className="mt-8 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="/quick-start"
							>
								Launch compute
							</AppLink>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
