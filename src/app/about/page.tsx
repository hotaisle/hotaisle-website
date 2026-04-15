import { Lightbulb, Users } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Meet the Hot Aisle founders and learn how the company was built around transparent, high-performance AMD infrastructure.',
		image: '/assets/og/hot-aisle-share.png',
		imageAlt: 'Hot Aisle branded share image',
		path: '/about',
		title: 'About Hot Aisle',
	});
}

export default function AboutPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Section */}
			<div className="relative border-border border-b bg-muted/20">
				<div className="container mx-auto max-w-5xl px-6 py-20 text-center">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-bold text-foreground text-xs uppercase tracking-wider shadow-sm">
						<Users className="text-hot-orange" size={14} />
						Our Story
					</div>

					<h1 className="mb-8 font-black text-4xl text-foreground tracking-tighter md:text-6xl">
						Thanks for stopping by.
					</h1>
					<h1 className="text-3xl text-hot-orange">Nice to meet you.</h1>
				</div>
			</div>

			{/* Founders Grid */}
			<div className="border-border border-y bg-muted/30 px-6 py-24">
				<div className="container mx-auto max-w-5xl">
					<h2 className="mb-6 text-center font-black text-3xl">The Founders</h2>

					<p className="mx-auto mb-10 max-w-3xl text-center font-light text-muted-foreground text-xl leading-relaxed">
						Hot Aisle Inc. was founded by Jon Stevens and Clint Armstrong in October
						2023.
						<br />
						We prioritize ethics, transparency, and honesty in everything we do.
					</p>

					<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
						{/* Jon */}
						<div className="group rounded-2xl border border-border bg-background p-8 text-center shadow-sm transition-all hover:shadow-lg">
							<div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-inner transition-transform duration-500 group-hover:scale-105">
								<OptimizedImage
									alt="Jon Stevens"
									className="h-full w-full object-cover"
									height={128}
									src="/assets/about/jon.png"
									width={128}
								/>
							</div>
							<h3 className="mb-2 font-bold text-2xl text-foreground">Jon Stevens</h3>
							<div className="mb-6 font-bold text-hot-orange-contrast text-sm uppercase tracking-wider">
								Founder / CEO
							</div>

							<a
								className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground hover:underline"
								href="https://www.linkedin.com/in/jon-s-stevens/"
								rel="noopener noreferrer"
								target="_blank"
							>
								<LinkedinIcon size={18} />
								Connect on LinkedIn
							</a>
						</div>

						{/* Clint */}
						<div className="group rounded-2xl border border-border bg-background p-8 text-center shadow-sm transition-all hover:shadow-lg">
							<div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-inner transition-transform duration-500 group-hover:scale-105">
								<OptimizedImage
									alt="Clint Armstrong"
									className="h-full w-full object-cover"
									height={128}
									src="/assets/about/clint.png"
									width={128}
								/>
							</div>
							<h3 className="mb-2 font-bold text-2xl text-foreground">
								Clint Armstrong
							</h3>
							<div className="mb-6 font-bold text-hot-orange-contrast text-sm uppercase tracking-wider">
								Founder / Head of Engineering
							</div>

							<a
								className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground hover:underline"
								href="https://www.linkedin.com/in/clint-armstrong/"
								rel="noopener noreferrer"
								target="_blank"
							>
								<LinkedinIcon size={18} />
								Connect on LinkedIn
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* The Origin Story */}
			<div className="container mx-auto max-w-5xl px-6 py-24">
				<div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-lg md:p-16">
					<div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-hot-orange/5 blur-[100px]" />

					<div className="relative z-10">
						<div className="mb-6 flex items-center gap-3 text-hot-orange">
							<Lightbulb size={24} />
							<h2 className="font-bold text-2xl uppercase tracking-widest">
								The Origin
							</h2>
						</div>

						<h3 className="mb-8 font-black text-3xl text-foreground md:text-4xl">
							Why "Hot Aisle"?
						</h3>

						<div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
							<p>
								Both of us are hands-on technical experts with decades of
								experience. We have been working together for over 5 years,
								successfully deploying large-scale compute across 9 data centers
								(and counting).
							</p>
							<p>
								After months of considering names for the company, Jon thought about
								common terms in a data center and "Hot Aisle" dawned on him as a
								fantastic name.
							</p>
							<blockquote className="my-8 border-hot-orange border-l-4 py-2 pl-6 font-medium text-foreground text-xl italic">
								"While 'Cold Aisle' was another obvious choice, we felt that 'Hot
								Aisle' better represents the high-performance, high-heat compute
								services we offer."
							</blockquote>
							<p>
								We come from open-source backgrounds and that ethos drives our
								commitment to transparency in our business dealings.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Backers Section */}
			<div className="mx-auto border-border border-y bg-muted/20 px-6 py-24 text-center">
				<div className="container mx-auto max-w-5xl">
					<h2 className="mb-12 font-black text-3xl text-foreground md:text-5xl">
						Gratefully Backed By
					</h2>

					<div className="grid grid-cols-1 items-center justify-center gap-8 md:grid-cols-2">
						<a
							className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
							href="https://consensys.io/about/joseph-lubin-founder-of-consensys"
							rel="noopener noreferrer"
							target="_blank"
						>
							{/* Hover Effect Background */}
							<div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

							<div className="relative z-10 flex flex-col items-center">
								{/* Animated Icon */}
								<div className="relative mb-6 h-16 w-16">
									<div className="absolute inset-0 rounded-full bg-blue-100 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:bg-blue-900/30" />
									<svg
										className="h-full w-full text-foreground transition-colors duration-500 group-hover:text-blue-500"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										viewBox="0 0 24 24"
									>
										{/* Abstract Ethereum/Diamond Shape */}
										<path
											className="group-hover:animate-[spin_3s_linear_infinite]"
											d="M12 2L2 12l10 10 10-10L12 2z"
											style={{ transformOrigin: 'center' }}
										/>
										<path
											className="opacity-30 transition-opacity group-hover:opacity-100"
											d="M12 2v20M2 12h20"
										/>
									</svg>
								</div>

								<h3 className="mb-2 font-bold text-2xl text-foreground transition-colors group-hover:text-blue-500">
									Joseph Lubin
								</h3>
								<p className="text-muted-foreground text-sm transition-colors group-hover:text-foreground/80">
									Founder of ConsenSys & Co-Founder of Ethereum
								</p>
							</div>
						</a>

						{/* Mesh - The Network Effect */}
						<a
							className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
							href="https://mesh.xyz/"
							rel="noopener noreferrer"
							target="_blank"
						>
							{/* Hover Effect Background */}
							<div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

							<div className="relative z-10 flex flex-col items-center">
								{/* Animated Icon */}
								<div className="perspective-distant relative mb-6 h-16 w-16">
									<div className="absolute inset-0 rounded-full bg-indigo-100 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:bg-indigo-900/30" />
									<svg
										className="h-full w-full text-foreground transition-colors duration-500 group-hover:text-indigo-500"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										viewBox="0 0 24 24"
									>
										<circle
											className="group-hover:animate-pulse"
											cx="12"
											cy="12"
											r="3"
										/>
										<circle
											className="opacity-30 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
											cx="12"
											cy="12"
											r="8"
											strokeDasharray="4 4"
										/>
										<path
											className="opacity-0 transition-all delay-100 duration-500 group-hover:opacity-100"
											d="M12 4v4m0 8v4m8-8h-4M8 12H4"
										/>
									</svg>
								</div>

								<h3 className="mb-2 font-bold text-2xl text-foreground transition-colors group-hover:text-indigo-500">
									Mesh
								</h3>
								<p className="text-muted-foreground text-sm transition-colors group-hover:text-foreground/80">
									Web3 Incubator & Investment Firm
								</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
