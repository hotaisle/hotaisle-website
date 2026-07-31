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
import { ThemeToggle } from '@/components/ThemeToggle.tsx';

const NAV_ITEMS = [
	{ href: '/quick-start', icon: Zap, label: 'Quick Start' },
	{ href: '/pricing', icon: DollarSign, label: 'Pricing' },
	{ href: '/compute', icon: Cpu, label: 'Supercomputer' },
	{ href: '/datacenter', icon: Building, label: 'Datacenter' },
	{ href: '/networking', icon: Network, label: 'Networking' },
	{ href: '/cluster', icon: Server, label: 'Cluster Design' },
	{ href: '/partners', icon: Handshake, label: 'Partners' },
	{ href: '/benchmarks-and-analysis', icon: BarChart3, label: 'Benchmarks' },
	{ href: '/mi300x', icon: Cpu, label: 'MI300X' },
	{ href: '/mi355x', icon: Zap, label: 'MI355X' },
	{ href: '/blog', icon: BookOpen, label: 'Blog' },
	{ href: '/about', icon: Info, label: 'About Us' },
	{ href: '/policies', icon: Scale, label: 'Policies' },
];

export function Sidebar() {
	return (
		<>
			<div className="border-b bg-card/95 backdrop-blur lg:hidden">
				<div className="flex h-16 items-center justify-between px-4">
					<AppLink
						aria-label="Home"
						className="flex items-center justify-center"
						data-mobile-nav-close
						href="/"
					>
						<div className="h-9 w-32">
							<img
								alt="Hot Aisle"
								className="h-full w-full object-contain"
								height={36}
								src="/hotaisle-logo.svg"
								width={160}
							/>
						</div>
					</AppLink>
					<div className="flex items-center gap-2">
						<ThemeToggle className="hover:bg-hot-orange/10 hover:text-hot-orange" />
						<button
							aria-controls="mobile-sidebar-nav"
							aria-expanded="false"
							aria-label="Toggle navigation menu"
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-hot-orange/10 hover:text-hot-orange"
							data-mobile-nav-toggle
							type="button"
						>
							<Menu className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
			<div
				className="fixed inset-0 z-50 lg:hidden"
				data-mobile-nav-panel
				hidden
				id="mobile-sidebar-nav"
			>
				<button
					aria-label="Close navigation menu"
					className="absolute inset-0 bg-black/45"
					data-mobile-nav-close
					type="button"
				/>
				<div className="relative flex h-full w-full flex-col bg-card shadow-2xl">
					<div className="flex h-16 items-center justify-between border-b px-4">
						<div className="h-9 w-32">
							<img
								alt="Hot Aisle"
								className="h-full w-full object-contain"
								height={36}
								src="/hotaisle-logo.svg"
								width={160}
							/>
						</div>
						<button
							aria-label="Close navigation menu"
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-hot-orange/10 hover:text-hot-orange"
							data-mobile-nav-close
							type="button"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
					<nav className="flex-1 overflow-y-auto px-3 py-3">
						<div className="space-y-1">
							{NAV_ITEMS.map((item) => {
								const Icon = item.icon;

								return (
									<AppLink
										className="group relative flex items-center rounded-md px-3 py-2 font-medium text-base text-muted-foreground transition-colors hover:bg-hot-orange/10 hover:text-hot-orange"
										data-mobile-nav-close
										href={item.href}
										key={item.href}
									>
										<Icon className="mr-3 h-5 w-5 shrink-0" />
										<span className="whitespace-nowrap">{item.label}</span>
									</AppLink>
								);
							})}
						</div>
					</nav>
					<div className="flex items-center justify-between border-t p-4">
						<AppLink
							className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-hot-orange/10 hover:text-hot-orange"
							data-mobile-nav-close
							href="/contact"
						>
							<Mail size={20} />
						</AppLink>
						<span className="font-medium text-muted-foreground text-sm opacity-70">
							© 2026 Hot Aisle
						</span>
					</div>
				</div>
			</div>

			<aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
				<div className="relative flex h-16 w-full items-center justify-center border-b px-4">
					<AppLink
						aria-label="Home"
						className="flex h-full items-center justify-center"
						href="/"
					>
						<div className="h-10 w-40">
							<img
								alt="Hot Aisle"
								className="h-full w-full object-contain"
								height={40}
								src="/hotaisle-logo.svg"
								width={200}
							/>
						</div>
					</AppLink>
				</div>
				<nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 py-4">
					{NAV_ITEMS.map((item) => {
						const Icon = item.icon;

						return (
							<AppLink
								className="group relative flex items-center rounded-md px-3 py-2 font-medium text-base text-muted-foreground transition-colors hover:bg-hot-orange/10 hover:text-hot-orange"
								href={item.href}
								key={item.href}
							>
								<Icon className="mr-3 h-5 w-5 shrink-0" />
								<span className="whitespace-nowrap">{item.label}</span>
							</AppLink>
						);
					})}
				</nav>
				<div className="shrink-0 border-t bg-card/50 p-4 backdrop-blur-sm">
					<div className="flex items-center justify-between gap-3">
						<div className="flex gap-2">
							<AppLink
								className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-hot-orange/10 hover:text-hot-orange"
								href="/contact"
							>
								<Mail size={20} />
							</AppLink>
							<ThemeToggle className="hover:bg-hot-orange/10 hover:text-hot-orange" />
						</div>
						<div className="min-w-0 flex-1 text-right">
							<span className="font-medium text-muted-foreground text-sm opacity-70">
								© 2026 Hot Aisle
							</span>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
}
