import { AppLink } from '@/components/AppLink.tsx';

const FOOTER_COLUMNS = [
	{
		heading: 'Get Started',
		links: [
			{ href: '/quick-start', label: 'Quick Start' },
			{ href: '/pricing', label: 'Pricing' },
			{ href: '/contact', label: 'Contact Sales' },
		],
	},
	{
		heading: 'Infrastructure',
		links: [
			{ href: '/compute', label: 'Supercomputer' },
			{ href: '/datacenter', label: 'Datacenter' },
			{ href: '/networking', label: 'Networking' },
			{ href: '/cluster', label: 'Cluster Design' },
		],
	},
	{
		heading: 'GPUs',
		links: [
			{ href: '/mi300x', label: 'MI300X' },
			{ href: '/mi355x', label: 'MI355X' },
			{ href: '/benchmarks-and-analysis', label: 'Benchmarks' },
		],
	},
	{
		heading: 'Company',
		links: [
			{ href: '/about', label: 'About Us' },
			{ href: '/partners', label: 'Partners' },
			{ href: '/blog', label: 'Blog' },
			{ href: '/policies', label: 'Policies' },
		],
	},
];

export function Footer() {
	return (
		<footer className="border-border/60 border-t bg-card">
			{/* Top accent line */}
			<div className="h-px w-full bg-linear-to-r from-transparent via-hot-orange/40 to-transparent" />

			{/* Main footer content */}
			<div className="mx-auto max-w-7xl px-6">
				{/* Link columns grid */}
				<div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
					{FOOTER_COLUMNS.map((column) => (
						<div key={column.heading}>
							<h3 className="mb-4 font-semibold text-foreground text-xs uppercase tracking-widest">
								{column.heading}
							</h3>
							<ul className="space-y-3">
								{column.links.map((link) => (
									<li key={link.href}>
										<AppLink
											className="text-muted-foreground text-sm transition-colors hover:text-foreground"
											href={link.href}
										>
											{link.label}
										</AppLink>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Divider */}
				<div className="border-border/60 border-t" />

				{/* Bottom row */}
				<div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
					<AppLink aria-label="Home" className="shrink-0" href="/">
						<img
							alt="Hot Aisle"
							className="h-7 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
							height={28}
							src="/hotaisle-logo.svg"
							width={110}
						/>
					</AppLink>

					<p className="text-center text-muted-foreground text-xs">
						© 2026 Hot Aisle, Inc. AMD Exclusive AI Cloud.
					</p>

					<div className="flex items-center gap-4">
						<AppLink
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/policies/privacy-policy"
						>
							Privacy
						</AppLink>
						<AppLink
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/policies/terms-of-service"
						>
							Terms
						</AppLink>
						<AppLink
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/contact"
						>
							Contact
						</AppLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
