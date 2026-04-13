import {
	BarChart3,
	BookOpen,
	Building,
	Cpu,
	DollarSign,
	Handshake,
	Info,
	Mail,
	Menu,
	Network,
	Scale,
	Server,
	X,
	Zap,
} from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';

const PRIMARY_NAV = [
	{ href: '/quick-start', label: 'Quick Start' },
	{ href: '/pricing', label: 'Pricing' },
	{ href: '/compute', label: 'Compute' },
	{ href: '/mi300x', label: 'MI300X' },
	{ href: '/mi355x', label: 'MI355X' },
	{ href: '/blog', label: 'Blog' },
];

const ALL_NAV_ITEMS = [
	{ href: '/quick-start', label: 'Quick Start', icon: Zap },
	{ href: '/pricing', label: 'Pricing', icon: DollarSign },
	{ href: '/compute', label: 'Supercomputer', icon: Cpu },
	{ href: '/datacenter', label: 'Datacenter', icon: Building },
	{ href: '/networking', label: 'Networking', icon: Network },
	{ href: '/cluster', label: 'Cluster Design', icon: Server },
	{ href: '/partners', label: 'Partners', icon: Handshake },
	{ href: '/benchmarks-and-analysis', label: 'Benchmarks', icon: BarChart3 },
	{ href: '/mi300x', label: 'MI300X', icon: Cpu },
	{ href: '/mi355x', label: 'MI355X', icon: Zap },
	{ href: '/blog', label: 'Blog', icon: BookOpen },
	{ href: '/about', label: 'About Us', icon: Info },
	{ href: '/policies', label: 'Policies', icon: Scale },
];

export function Navbar() {
	return (
		<>
			{/* Top Navbar */}
			<header className="sticky top-0 z-40 w-full border-border/60 border-b bg-background/95 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
					{/* Left: Logo + Primary Nav */}
					<div className="flex items-center gap-8">
						<AppLink aria-label="Home" href="/">
							<img
								alt="Hot Aisle"
								className="h-8 w-auto object-contain"
								height={32}
								src="/hotaisle-logo.svg"
								width={104}
							/>
						</AppLink>

						<nav className="hidden items-center gap-1 lg:flex">
							{PRIMARY_NAV.map((item) => (
								<AppLink
									className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
									href={item.href}
									key={item.href}
								>
									{item.label}
								</AppLink>
							))}
						</nav>
					</div>

					{/* Right: Actions */}
					<div className="flex items-center gap-2">
						<AppLink
							className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
							href="/contact"
							title="Contact"
						>
							<Mail className="h-4 w-4" />
						</AppLink>

						<button
							aria-label="Switch to dark mode"
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							data-theme-toggle
							title="Switch to dark mode"
							type="button"
						>
							<span aria-hidden="true" className="text-sm">
								◐
							</span>
						</button>

						<AppLink
							className="hidden rounded-lg bg-hot-orange px-4 py-2 font-medium text-sm text-white shadow-sm transition hover:bg-orange-500 lg:inline-flex"
							href="/quick-start"
						>
							Start Now
						</AppLink>

						{/* Mobile hamburger */}
						<button
							aria-controls="mobile-nav-panel"
							aria-expanded="false"
							aria-label="Toggle navigation menu"
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
							data-mobile-nav-toggle
							type="button"
						>
							<Menu className="h-5 w-5" />
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Nav Panel */}
			<div
				className="fixed inset-0 z-50 lg:hidden"
				data-mobile-nav-panel
				hidden
				id="mobile-nav-panel"
			>
				<div className="flex h-full w-full flex-col bg-card">
					<div className="flex h-16 items-center justify-between border-b px-4">
						<img
							alt="Hot Aisle"
							className="h-8 w-auto object-contain"
							height={32}
							src="/hotaisle-logo.svg"
							width={104}
						/>
						<button
							aria-label="Close navigation menu"
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							data-mobile-nav-close
							type="button"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<nav className="flex-1 overflow-y-auto px-3 py-4">
						<div className="space-y-1">
							{ALL_NAV_ITEMS.map((item) => {
								const Icon = item.icon;
								return (
									<AppLink
										className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										data-mobile-nav-close
										href={item.href}
										key={item.href}
									>
										<Icon className="h-5 w-5 shrink-0" />
										<span>{item.label}</span>
									</AppLink>
								);
							})}
						</div>
					</nav>

					<div className="border-t p-4">
						<AppLink
							className="flex w-full items-center justify-center rounded-lg bg-hot-orange px-4 py-3 font-semibold text-white transition hover:bg-orange-500"
							data-mobile-nav-close
							href="/quick-start"
						>
							Start Now
						</AppLink>
						<div className="mt-3 flex items-center justify-between">
							<AppLink
								className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
								data-mobile-nav-close
								href="/contact"
							>
								<Mail className="h-4 w-4" />
								Contact
							</AppLink>
							<span className="text-muted-foreground text-sm opacity-60">
								© 2026 Hot Aisle
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
