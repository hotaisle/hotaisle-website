import { ArrowRight, BarChart2, Cpu, ExternalLink, FileText, Zap } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Independent benchmarks, performance analysis, and third-party references for AMD MI300X workloads and infrastructure.',
		path: '/benchmarks-and-analysis',
		title: 'Benchmarks and Analysis',
	});
}

const benchmarks = [
	{
		icon: FileText,
		source: 'Reddit',
		title: 'MI300x Subreddit contains up to date information',
		url: 'https://www.reddit.com/r/AMD_MI300/',
	},
	{
		icon: Cpu,
		source: 'Hugging Face',
		title: 'A language model trained on AMD MI300x',
		url: 'https://huggingface.co/AlpinDale/Magnum-72B-v1',
	},
	{
		icon: BarChart2,
		source: 'Reddit',
		title: 'AMD MI300X vs Nvidia H100 FFT Benchmark',
		url: 'https://www.reddit.com/r/AMD_MI300/comments/1djex3j/amd_mi300x_and_nvidia_h100_benchmarking_in_fft/',
	},
	{
		icon: Zap,
		source: 'Reddit',
		title: 'Benchmarking Brilliance: Single MI300x vLLM',
		url: 'https://www.reddit.com/r/AMD_MI300/comments/1dgimxt/benchmarking_brilliance_single_amd_mi300x_vllm/',
	},
	{
		icon: Zap,
		source: 'Reddit',
		title: 'MI300X Fastest GPU in Geekbench OpenCL',
		url: 'https://www.reddit.com/r/AMD_MI300/comments/1dfr0qx/amd_instinct_mi300x_now_the_fastest_gpu_in/',
	},
	{
		icon: Cpu,
		source: 'Chips and Cheese',
		title: 'Chips and Cheese: Testing AMD’s Bergamo',
		url: 'https://chipsandcheese.com/2023/08/11/testing-amds-bergamo-zen-4c-spam/',
	},
	{
		icon: FileText,
		source: 'Oracle Cloud',
		title: 'Oracle: Early LLM serving experience with MI300X',
		url: 'https://blogs.oracle.com/cloud-infrastructure/post/llm-performance-results-amd-instinct-mi300x-gpus',
	},
	{
		icon: Cpu,
		source: 'Chips and Cheese',
		title: 'Chips and Cheese: Testing AMD’s Giant MI300X',
		url: 'https://chipsandcheese.com/2024/06/25/testing-amds-giant-mi300x/',
	},
	{
		icon: BarChart2,
		source: 'Nscale',
		title: 'AMD MI300x GEMM tuning improves throughput',
		url: 'https://nscale.com/blog',
	},
	{
		icon: BarChart2,
		source: 'RunPod',
		title: 'AMD MI300X vs. Nvidia H100 SXM (Mixtral 8x7B)',
		url: 'https://blog.runpod.io/amd-mi300x-vs-nvidia-h100-sxm-performance-comparison-on-mixtral-8x7b-inference/',
	},
	{
		icon: FileText,
		source: 'AMD Community',
		title: 'Engineering Insights: MLPerf® Results on MI300X',
		url: 'https://community.amd.com/t5/instinct-accelerators/engineering-insights-unveiling-mlperf-results-on-amd-instinct/ba-p/697968',
	},
	{
		icon: Cpu,
		source: 'GitHub',
		title: 'Updated MI300X GEMM tuning with Gradlib',
		url: 'https://github.com/ROCm/TextPrompt',
	},
	{
		icon: BarChart2,
		source: 'dstack',
		title: 'Benchmarking Llama 3.1 405B on 8x MI300X',
		url: 'https://dstack.ai/blog/amd-mi300x-inference-benchmark/',
	},
	{
		icon: Zap,
		source: 'Fireworks.ai',
		title: 'FireAttention V3: AMD as Viable Alternative',
		url: 'https://fireworks.ai/blog/fireattention-v3',
	},
	{
		icon: Zap,
		source: 'AMD Community',
		title: 'Tuning for Efficient Inferencing with vLLM',
		url: 'https://community.amd.com/t5/instinct-accelerators/tuning-for-efficient-inferencing-with-vllm-on-amd-instinct/ba-p/701889',
	},
	{
		icon: FileText,
		source: 'AMD Community',
		title: 'vLLM: Serving LLMs on AMD MI300X Best Practices',
		url: 'https://community.amd.com/t5/instinct-accelerators/vllm-serving-llms-on-amd-instinct-mi300x-best-practices/ba-p/698717',
	},
	{
		icon: Cpu,
		source: 'LinkedIn Engineering',
		title: 'Liger Kernels Leap the CUDA Moat',
		url: 'https://engineering.linkedin.com/blog/2024/liger-kernels-leap-the-cuda-moat',
	},
	{
		icon: BarChart2,
		source: 'Medium',
		title: 'Anton Lokhmotov’s MLPerf CPU Benchmarks',
		url: 'https://medium.com/@anton_lokhmotov',
	},
	{
		icon: Zap,
		source: 'LinkedIn',
		title: 'Dr. Moritz Lehmann: Hot Aisle 8x MI300X Speed Test',
		url: 'https://www.linkedin.com/feed/update/urn:li:activity:7242250100055105536/',
	},
	{
		icon: BarChart2,
		source: 'SemiAnalysis',
		title: 'Cranking Out Faster Tokens for Fewer Dollars',
		url: 'https://www.semianalysis.com/p/cranking-out-faster-tokens-for-fewer',
	},
];

export default function BenchmarksPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-24 text-foreground">
			{/* Hero Section */}
			<div className="relative w-full overflow-hidden border-border border-b bg-background px-6 pt-32 pb-20">
				<div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-neutral-100 via-background to-background dark:from-neutral-900 dark:via-background dark:to-background" />

				<div className="container relative z-10 mx-auto max-w-4xl text-center">
					<h1 className="mb-8 bg-linear-to-r from-foreground to-foreground bg-clip-text font-black text-5xl text-transparent tracking-tighter md:text-7xl">
						Benchmarks & <span className="text-hot-orange">Analysis</span>
					</h1>

					<div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl text-muted-foreground leading-relaxed">
						<p className="mb-6">
							<span>Welcome to the </span>
							<strong className="mr-1 text-foreground">Benchmarks & Analysis</strong>
							<span>
								section of Hot Aisle Inc.'s website. As a leader in deploying
							</span>
							cutting-edge AMD hardware and other advanced technologies, we are
							committed to providing transparent, reliable, and comprehensive
							performance metrics. The links shared here are meticulously selected to
							ensure you have the most accurate and up-to-date information on our
							supercomputing solutions.
						</p>
						<p>
							Here, you'll find detailed analyses of our latest deployments, including
							performance comparisons, efficiency metrics, and cost-benefit analyses.
							We strive to give you a clear understanding of how our hardware and
							services stack up against industry standards and competitors. Our goal
							is to empower you with the data needed to make informed decisions about
							your computational needs.
						</p>
					</div>
				</div>
			</div>

			{/* Content List */}
			<div className="container relative z-20 mx-auto -mt-10 max-w-6xl px-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{benchmarks.map((b) => (
						<a
							className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-hot-orange/50 hover:shadow-xl"
							href={b.url}
							key={b.url}
							rel="noopener noreferrer"
							target="_blank"
						>
							<div className="mb-4 flex items-start justify-between">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors duration-300 group-hover:bg-hot-orange/10 group-hover:text-hot-orange">
									<b.icon size={24} />
								</div>
								<ExternalLink
									className="text-muted-foreground transition-colors group-hover:text-hot-orange"
									size={18}
								/>
							</div>

							<h3 className="mb-3 font-bold text-foreground text-xl leading-tight transition-colors group-hover:text-hot-orange">
								{b.title}
							</h3>

							<div className="mt-auto flex items-center border-border/50 border-t pt-4 font-medium text-muted-foreground text-sm">
								<span className="text-xs uppercase tracking-wider">{b.source}</span>
								<ArrowRight
									className="ml-2 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
									size={14}
								/>
							</div>
						</a>
					))}
				</div>

				<div className="mt-20 text-center">
					<p className="mb-6 text-muted-foreground">
						Whether you're a potential customer, a current client, or an industry
						enthusiast, this section is designed to provide valuable insights into the
						capabilities of our infrastructure. We invite you to explore the findings
						and see firsthand how AMD is competitive in the world of high-performance
						computing.
					</p>
					<AppLink
						className="inline-flex rounded-full bg-hot-orange px-8 py-3 font-bold text-white transition-all hover:scale-105 hover:opacity-90"
						href="/quick-start"
					>
						Start Benchmarking Today
					</AppLink>
				</div>
			</div>
		</div>
	);
}
