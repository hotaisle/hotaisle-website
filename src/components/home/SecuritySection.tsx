import { OptimizedImage } from '@/components/OptimizedImage.tsx';

interface SecurityLogo {
	alt: string;
	className: string;
	imageClassName?: string;
	height: number;
	href?: string;
	logoSurfaceClassName?: string;
	src: string;
	width: number;
}

const SECURITY_LOGOS: readonly SecurityLogo[] = [
	{
		alt: 'Dell Technologies Authorized Partner',
		className: 'h-20 w-auto md:h-22',
		height: 96,
		logoSurfaceClassName:
			'rounded-md px-4 py-3 dark:bg-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]',
		src: '/assets/home/dellauthpartner.png',
		width: 331,
	},
	{
		alt: 'SOC 2 and HIPAA compliant',
		className: 'h-24 w-auto',
		height: 137,
		href: '/blog/soc2-is-broken',
		logoSurfaceClassName:
			'rounded-md bg-white px-8 py-2 shadow-sm ring-1 ring-slate-200/80 dark:bg-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]',
		src: '/assets/home/so2andhipaa-composite.png',
		width: 220,
	},
	{
		alt: 'AMD Partner',
		className: 'h-16 w-auto md:h-18',
		height: 96,
		imageClassName: 'dark:invert',
		src: '/assets/home/AMDpartner.png',
		width: 337,
	},
];

export function SecuritySection() {
	return (
		<section className="border-border/60 border-t bg-muted/30 py-14">
			<div className="mx-auto max-w-7xl px-6">
				<p className="mb-10 text-center font-medium text-muted-foreground text-xs uppercase tracking-widest">
					Trusted by Industry Leaders & Secure by Design
				</p>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{SECURITY_LOGOS.map((logo) => {
						const imageClassName = [
							logo.className,
							logo.imageClassName,
							'object-contain',
						]
							.filter(Boolean)
							.join(' ');

						const content = (
							<div className={logo.logoSurfaceClassName}>
								<OptimizedImage
									alt={logo.alt}
									className={imageClassName}
									decoding="async"
									height={logo.height}
									src={logo.src}
									width={logo.width}
								/>
							</div>
						);

						if (logo.href) {
							return (
								<a
									key={logo.src}
									className="flex min-h-28 items-center justify-center rounded-xl border border-border/60 bg-background/40 px-6 py-5 transition-colors hover:border-border hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-white/8 dark:bg-white/2 dark:hover:border-white/14 dark:hover:bg-white/4"
									href={logo.href}
								>
									{content}
								</a>
							);
						}

						return (
							<div
								key={logo.src}
								className="flex min-h-28 items-center justify-center rounded-xl border border-border/60 bg-background/40 px-6 py-5 dark:border-white/8 dark:bg-white/2"
							>
								{content}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
