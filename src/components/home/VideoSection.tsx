import { Play } from 'lucide-react';

export function VideoSection() {
	return (
		<section className="bg-background py-24">
			<div className="container mx-auto max-w-6xl px-6">
				<div className="flex flex-col items-center gap-16 md:flex-row">
					{/* Text Side */}
					<div className="flex-1 text-center md:text-left">
						<h2 className="mb-6 font-black text-4xl tracking-tight md:text-5xl">
							Just $1.99/hr. <br />
							<span className="text-hot-orange-contrast">Zero Commitment.</span>
						</h2>
						<p className="mb-8 text-muted-foreground text-xl leading-relaxed">
							Stop paying for idle GPUs. With Hot Aisle, you get instant access to raw
							HBM3 performance without the enterprise contracts.
						</p>
						<ul className="mx-auto max-w-md space-y-4 text-left md:mx-0">
							{[
								'No Upfront Costs',
								'Billed by the Minute',
								'Instant Provisioning',
								'High Performance',
							].map((item) => (
								<li className="flex items-center gap-3 font-medium" key={item}>
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-hot-orange/20 text-hot-orange">
										<Play fill="currentColor" size={10} />
									</div>
									{item}
								</li>
							))}
						</ul>
					</div>

					{/* Video Side */}
					<div className="group relative mx-auto w-full max-w-md flex-1">
						{/* Glow Effect */}
						<div className="absolute inset-0 rounded-full bg-hot-orange/20 opacity-50 blur-3xl transition-opacity group-hover:opacity-75" />

						<div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-black shadow-2xl transition-colors group-hover:border-hot-orange/50">
							<video
								autoPlay
								className="h-full w-full object-cover"
								loop
								muted
								playsInline
							>
								<source
									src="/assets/home/nocontractnocommitment1.99perhourvideo.mp4"
									type="video/mp4"
								/>
							</video>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
