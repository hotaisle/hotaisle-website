export function SecuritySection() {
	return (
		<section className="border-border/60 border-t bg-muted/30 py-14">
			<div className="mx-auto max-w-7xl px-6">
				<p className="mb-10 text-center font-medium text-muted-foreground text-xs uppercase tracking-widest">
					Trusted by Industry Leaders & Secure by Design
				</p>
				<div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
					<div className="flex h-32 items-center justify-center rounded-xl bg-white px-8 py-4 shadow-sm ring-1 ring-border/40 transition-shadow hover:shadow-md">
						<img
							alt="Dell Technologies Authorized Partner"
							className="h-24 w-auto object-contain"
							height={96}
							src="/assets/home/dellauthpartner.png"
							width={192}
						/>
					</div>
					<a
						className="flex h-32 items-center justify-center rounded-xl bg-white px-8 py-4 shadow-sm ring-1 ring-border/40 transition-shadow hover:shadow-md"
						href="/blog/soc2-is-broken"
					>
						<img
							alt="SOC2 Type 2 & HIPAA Compliant"
							className="h-24 w-auto object-contain"
							height={96}
							src="/assets/home/so2andhipaa.png"
							width={192}
						/>
					</a>
					<div className="flex h-32 items-center justify-center rounded-xl bg-white px-8 py-4 shadow-sm ring-1 ring-border/40 transition-shadow hover:shadow-md">
						<img
							alt="AMD Partner"
							className="h-24 w-auto object-contain"
							height={96}
							src="/assets/home/AMDpartner.png"
							width={192}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
