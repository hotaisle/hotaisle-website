import {
	ArrowRight,
	Cpu,
	CreditCard,
	Layers,
	Lock,
	Network,
	Server,
	ShieldCheck,
	Thermometer,
	Zap,
} from 'lucide-react';
import { ClickableImage } from '@/components/ClickableImage.tsx';

export default function MI355XContent() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Section */}
			<div className="main-hero-section relative overflow-hidden border-border border-b bg-background px-6 pt-32 pb-20">
				<div className="pointer-events-none absolute top-0 right-0 h-200 w-200 rounded-full bg-hot-orange/10 opacity-40 blur-[100px]" />
				<div className="pointer-events-none absolute bottom-0 left-0 h-150 w-150 rounded-full bg-red-600/10 opacity-30 blur-[100px]" />

				<div className="container relative z-10 mx-auto max-w-6xl text-center">
					<div className="mb-8 inline-flex animate-pulse items-center gap-2 rounded-full bg-hot-orange px-4 py-1.5 font-bold text-sm text-white uppercase tracking-widest shadow-hot-orange/30 shadow-lg">
						<Zap className="fill-current" size={14} /> Coming Soon
					</div>
					<h1 className="mb-8 font-black text-6xl leading-tight tracking-tighter md:text-9xl">
						MI355X
					</h1>
					<p className="mx-auto mb-12 max-w-4xl font-light text-muted-foreground text-xl leading-normal md:text-3xl">
						<strong className="text-foreground">ULTIMATE AI & HPC PERFORMANCE.</strong>
						<br />
						Built on the cutting-edge 4th Gen AMD CDNA™ architecture to drive the next
						era of innovation.
					</p>

					<a
						className="scroll-to-reserve-btn inline-flex items-center rounded-full bg-foreground px-8 py-4 font-bold text-background transition-transform hover:scale-105"
						href="#reserve"
					>
						Reserve Now <ArrowRight className="ml-2" size={20} />
					</a>
					<p className="mt-4 font-bold text-hot-orange-contrast text-xs uppercase tracking-widest">
						🔥 Scroll to the bottom to reserve 🔥
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto max-w-7xl space-y-32 px-6 py-24">
				{/* Direct Liquid Cooling */}
				<section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
					<div className="order-2 lg:order-1">
						<ClickableImage
							alt="Direct Liquid Cooled Design"
							className="group relative w-full overflow-hidden rounded-3xl border border-border text-left shadow-2xl"
							height={600}
							imgClassName="w-full object-cover transition-transform duration-700 group-hover:scale-105"
							src="/assets/mi355x/mi355ximage.png"
							width={800}
						/>
					</div>
					<div className="order-1 lg:order-2">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-hot-orange">
								<Thermometer size={24} />
							</div>
							<h2 className="font-black text-4xl">DIRECT LIQUID COOLED DESIGN</h2>
						</div>
						<div className="prose prose-lg dark:prose-invert text-muted-foreground">
							<p>
								The global adoption of AI technology demands ever greater amounts of
								processing capacity. The direct liquid cooling option enables AMD
								<span> Instinct MI355X GPUs to consume up to </span>
								<strong className="text-foreground">1400W</strong>.
							</p>
							<p>
								Liquid cooling helps reduce GPU die temperatures, expanding the
								accelerator’s power envelope, facilitating higher clock speeds and
								delivered performance. The use of cold plates enables the UBB to be
								integrated into standard and open compute servers, helping customers
								achieve higher densities.
							</p>
						</div>
					</div>
				</section>

				{/* Specs */}
				<section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
					<div>
						<div className="mb-6 flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-hot-orange">
								<Server size={24} />
							</div>
							<h2 className="font-black text-4xl">INDUSTRY-STANDARD FORM FACTOR</h2>
						</div>
						<div className="prose prose-lg dark:prose-invert text-muted-foreground">
							<p>
								The platform combines the power of eight accelerators on an
								industry-standard universal baseboard (UBB 2.0).
							</p>
							<ul className="space-y-2 font-medium text-foreground">
								<li>8 OAMs connected with AMD Infinity Fabric™ mesh</li>
								<li>153.6 GB/s bidirectional links</li>
								<li>
									<strong>288 GB of HBM3E memory</strong> per accelerator
								</li>
								<li>
									<strong>8 TB/s</strong> of memory bandwidth
								</li>
								<li>
									Massive <strong>2.3 TB of coherent, shared memory</strong> per
									platform
								</li>
							</ul>
						</div>
					</div>
					<div>
						<ClickableImage
							alt="MI355X Specs"
							className="relative w-full overflow-hidden rounded-3xl border border-border text-left shadow-2xl transition-transform hover:scale-[1.02]"
							height={600}
							imgClassName="w-full bg-white object-contain dark:bg-black/50"
							src="/assets/mi355x/techstats.png"
							width={800}
						/>
					</div>
				</section>

				{/* Platform Architecture */}
				<section className="space-y-12 rounded-[40px] border border-border bg-card p-8 text-center shadow-2xl md:p-16">
					<div className="mx-auto max-w-4xl">
						<h2 className="mb-6 font-black text-4xl">
							AMD MI355x Platform Architecture
						</h2>
						<p className="text-muted-foreground text-xl">
							Seven links per MI355X plus one PCIe® Gen 5 x16 connection per OAM
							device for upstream server and/or I/O connectivity.
						</p>
					</div>
					<ClickableImage
						alt="Platform Architecture"
						className="relative inline-block overflow-hidden rounded-2xl bg-white p-4 text-left"
						height={600}
						imgClassName="w-full"
						src="/assets/mi355x/platformarchitecture.png"
						width={1000}
					/>
				</section>

				{/* Multi-Chip Architecture */}
				<section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
					<div className="order-2 lg:order-1">
						<ClickableImage
							alt="Multi-Chip Architecture"
							className="relative mx-auto block w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-white p-4 text-left shadow-2xl md:p-6"
							height={776}
							imgClassName="h-auto w-full object-contain"
							src="/assets/mi355x/mutlishiparchitecture.png"
							width={1920}
						/>
					</div>
					<div className="order-1 lg:order-2">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-hot-orange">
								<Layers size={24} />
							</div>
							<h2 className="font-black text-4xl leading-tight">
								Multi-Chip Architecture
							</h2>
						</div>
						<div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
							<p>
								The MI355X uses the 4th Gen AMD CDNA™ multi-chip architecture based
								<span> on </span>
								<strong className="text-foreground">3nm process technology</strong>.
							</p>
							<h4 className="font-bold text-foreground">
								Breakthrough AI Acceleration
							</h4>
							<p>
								<span>With new expanded </span>
								<strong className="text-foreground">
									FP6 and FP4 datatype support
								</strong>
								<span>
									, MI355X maximizes computational throughput and energy
									efficiency. Enhanced FP16 and FP8 processing positions the MI350
									Series to deliver exceptional performance for advanced
									generative AI models.
								</span>
							</p>
						</div>
					</div>
				</section>

				{/* Additional Features Grid */}
				<section className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-hot-orange/50">
						<UploadIcon className="mb-6 h-12 w-12 text-hot-orange" />
						<h3 className="mb-3 font-bold text-xl">K8s Integration</h3>
						<p className="text-muted-foreground">
							AMD GPU Operator simplifies deployment in Kubernetes. Day-0 support
							enables optimized models upon release.
						</p>
					</div>
					<div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-hot-orange/50">
						<ShieldCheck className="mb-6 h-12 w-12 text-hot-orange" />
						<h3 className="mb-3 font-bold text-xl">Advanced Security</h3>
						<p className="text-muted-foreground">
							Verify hardware authenticity, secure multitenant GPU sharing, and
							encrypted high-speed communication.
						</p>
					</div>
					<div className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-hot-orange/50">
						<Network className="mb-6 h-12 w-12 text-hot-orange" />
						<h3 className="mb-3 font-bold text-xl">Scalable Networking</h3>
						<p className="text-muted-foreground">
							Ethernet-based AI and HPC networking enables massive hyperclass
							scalability and low TCO.
						</p>
					</div>
				</section>

				{/* Software Integration */}
				<section className="rounded-[40px] bg-neutral-900 p-8 text-center text-white md:p-16">
					<div className="mx-auto max-w-4xl">
						<div className="mx-auto mb-6 flex items-center justify-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
								<Cpu size={24} />
							</div>
							<h2 className="font-black text-4xl md:text-5xl">
								Optimized Software & Framework Integration
							</h2>
						</div>
						<p className="mb-10 text-neutral-300 text-xl leading-relaxed">
							<span>The foundation of AMD accelerated computing, </span>
							<strong className="mr-1">AMD ROCm™ software</strong>
							<span>
								empowers AI developers to fully leverage AMD Instinct GPUs. With
								Day-0 support for PyTorch, TensorFlow, JAX, and ONNX Runtime.
							</span>
						</p>
						<div className="grid grid-cols-2 gap-6 font-bold text-sm opacity-80 md:grid-cols-4">
							<div className="rounded-xl bg-white/5 p-4">OpenAI</div>
							<div className="rounded-xl bg-white/5 p-4">PyTorch</div>
							<div className="rounded-xl bg-white/5 p-4">Hugging Face</div>
							<div className="rounded-xl bg-white/5 p-4">Databricks</div>
						</div>
					</div>
				</section>

				{/* Reservation Section */}
				<section className="scroll-mt-32" id="reserve">
					<div className="mx-auto max-w-6xl space-y-8">
						<div className="space-y-6 text-center">
							<h2 className="font-black text-4xl">Reserve Your Compute</h2>
							<p className="mx-auto max-w-3xl text-lg text-muted-foreground">
								Demand for next-generation accelerators is at an all-time high. By
								placing a reservation today, you secure your priority spot in the
								deployment queue.
							</p>
							<div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
								<div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-hot-orange/10 text-hot-orange dark:bg-hot-orange/20">
										<Lock size={20} />
									</div>
									<span className="font-medium">Priority Allocation</span>
								</div>
								<div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-hot-orange/10 text-hot-orange dark:bg-hot-orange/20">
										<Zap size={20} />
									</div>
									<span className="font-medium">Exclusive Hardware Updates</span>
								</div>
								<div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-hot-orange/10 text-hot-orange dark:bg-hot-orange/20">
										<CreditCard size={20} />
									</div>
									<span className="font-medium">$100 Deposit</span>
								</div>
							</div>
						</div>

						{/* Tally Form */}
						<div className="relative overflow-hidden rounded-3xl border-2 border-hot-orange/20 bg-card p-2 shadow-2xl">
							<div className="rounded-[20px] bg-background p-4 text-slate-900 md:p-8 dark:text-slate-100">
								<iframe
									className="min-h-screen w-full rounded-xl border border-border"
									src="https://tally.so/embed/wAZ1AB?alignLeft=1&hideTitle=1&transparentBackground=0&dynamicHeight=1"
									title="Reserve your AMD MI355X Compute at Hot Aisle"
								/>
								<p className="mt-4 text-center text-muted-foreground text-xs">
									By reserving, you agree to our Terms.
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="mt-10 border-border border-t pt-20 text-center">
					<p className="text-muted-foreground text-sm">
						Footnote explanations are available at:
						<a
							className="underline hover:text-foreground"
							href="https://www.amd.com/en/legal/claims/instinct.html"
							rel="noopener"
							target="_blank"
						>
							AMD Legal Claims
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

function UploadIcon(props: { className: string }) {
	return (
		<svg
			{...props}
			fill="none"
			height="24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="17 8 12 3 7 8" />
			<line x1="12" x2="12" y1="3" y2="15" />
		</svg>
	);
}
