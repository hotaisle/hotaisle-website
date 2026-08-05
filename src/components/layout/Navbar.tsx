import {
	BarChart3,
	BookOpen,
	Building,
	Cpu,
	DollarSign,
	ExternalLink,
	Handshake,
	Info,
	Landmark,
	Mail,
	Menu,
	Network,
	Scale,
	Server,
	X,
	Zap,
} from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { SearchControl } from '@/components/layout/SearchControl.tsx';
import { ThemeToggle } from '@/components/ThemeToggle.tsx';
import {
	HEADER_CONTACT_LINK,
	HEADER_CTA_LINK,
	HEADER_RESERVE_ID_LINK,
	PRIMARY_NAV_LINKS,
} from '@/lib/navigation.ts';

type NavMatchMode = 'exact' | 'section';

const ARIA_CURRENT_PAGE = 'page';
const LOGO_ALT = 'Hot Aisle';
const LOGO_HEIGHT = 32;
const LOGO_SRC = '/hotaisle-logo.svg';
const LOGO_WIDTH = 104;
const NAV_LINK_CLASS_NAME =
	'ha-nav-link px-3 py-2 font-mono text-muted-foreground text-sm transition-colors hover:text-foreground';
const MOBILE_NAV_LINK_CLASS_NAME =
	'ha-nav-link flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const CONTACT_LINK_CLASS_NAME =
	'ha-nav-link hidden min-h-10 min-w-10 items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex';
const INDEX_FILE_SUFFIX = '/index.html';
const SECTION_MATCH_MODE: NavMatchMode = 'section';

interface NavbarProps {
	pathname: string;
}

const ALL_NAV_ITEMS = [
	{ href: '/quick-start', icon: Zap, label: 'Quick Start' },
	{ href: '/pricing', icon: DollarSign, label: 'Pricing' },
	{ href: '/compute', icon: Cpu, label: 'Supercomputer' },
	{ href: '/datacenter', icon: Building, label: 'Datacenter' },
	{ href: '/networking', icon: Network, label: 'Networking' },
	{ href: '/cluster', icon: Server, label: 'Cluster Design' },
	{ href: '/partners', icon: Handshake, label: 'Partners' },
	{ href: '/investors', icon: Landmark, label: 'Investors' },
	{ href: '/benchmarks-and-analysis', icon: BarChart3, label: 'Benchmarks' },
	{ href: '/mi300x', icon: Cpu, label: 'MI300X' },
	{ href: '/mi355x', icon: Zap, label: 'MI355X' },
	{ href: '/blog', icon: BookOpen, label: 'Blog' },
	{ href: '/about', icon: Info, label: 'About Us' },
	{ href: '/policies', icon: Scale, label: 'Policies' },
];

function normalizePathname(pathname: string): string {
	if (pathname === '/') {
		return pathname;
	}

	if (pathname.endsWith(INDEX_FILE_SUFFIX)) {
		return pathname.slice(0, -INDEX_FILE_SUFFIX.length) || '/';
	}

	return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isNavItemActive(currentPath: string, href: string, matchMode: NavMatchMode): boolean {
	const targetPath = normalizePathname(href);

	if (matchMode === 'exact') {
		return currentPath === targetPath;
	}

	return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

export function Navbar({ pathname }: NavbarProps) {
	const currentPath = normalizePathname(pathname);
	const getNavLinkProps = (href: string, matchMode: NavMatchMode = SECTION_MATCH_MODE) => {
		const isActive = isNavItemActive(currentPath, href, matchMode);

		return {
			'aria-current': isActive ? ARIA_CURRENT_PAGE : undefined,
			'data-active': isActive ? 'true' : undefined,
		} as const;
	};

	return (
		<>
			{/* Top Navbar */}
			<header className="sticky top-0 z-40 w-full border-border border-b bg-background/95 backdrop-blur-md">
				<div className="mx-auto flex h-18 max-w-360 items-center justify-between px-5 lg:px-8">
					{/* Left: Logo + Primary Nav */}
					<div className="flex items-center gap-6">
						<AppLink
							aria-label="Home"
							className="border-border pr-6 lg:border-r"
							href="/"
						>
							<img
								alt={LOGO_ALT}
								className="h-8 w-auto object-contain"
								fetchPriority="high"
								height={LOGO_HEIGHT}
								src={LOGO_SRC}
								width={LOGO_WIDTH}
							/>
						</AppLink>

						<nav className="hidden items-center lg:flex">
							{PRIMARY_NAV_LINKS.map((item) => (
								<AppLink
									className={NAV_LINK_CLASS_NAME}
									href={item.href}
									key={item.href}
									{...getNavLinkProps(item.href)}
								>
									{item.label}
								</AppLink>
							))}
						</nav>
					</div>

					{/* Right: Actions */}
					<div className="flex items-center gap-2">
						<SearchControl />

						<AppLink
							className={CONTACT_LINK_CLASS_NAME}
							href={HEADER_CONTACT_LINK.href}
							title="Contact"
							{...getNavLinkProps(HEADER_CONTACT_LINK.href, 'exact')}
						>
							<Mail className="h-4.5 w-4.5" />
						</AppLink>

						<ThemeToggle />

						<AppLink
							className="hidden min-h-9 items-center gap-1.5 border border-hot-orange/55 bg-hot-orange/8 px-3 py-2 font-mono text-hot-orange-contrast text-xs transition-colors hover:border-hot-orange hover:bg-hot-orange/15 lg:inline-flex"
							href={HEADER_RESERVE_ID_LINK.href}
							rel="noopener"
							target="_blank"
						>
							{HEADER_RESERVE_ID_LINK.label}
							<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
						</AppLink>

						<AppLink
							className="ha-header-cta hidden border border-hot-orange bg-hot-orange px-4 py-2 font-mono text-white text-xs transition hover:opacity-85 lg:inline-flex"
							href={HEADER_CTA_LINK.href}
						>
							{HEADER_CTA_LINK.label}
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
							alt={LOGO_ALT}
							className="h-8 w-auto object-contain"
							height={LOGO_HEIGHT}
							src={LOGO_SRC}
							width={LOGO_WIDTH}
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
										className={MOBILE_NAV_LINK_CLASS_NAME}
										data-mobile-nav-close
										href={item.href}
										key={item.href}
										{...getNavLinkProps(item.href)}
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
							className="mb-3 flex w-full items-center justify-center gap-2 border border-hot-orange/55 bg-hot-orange/8 px-4 py-3 font-semibold text-hot-orange-contrast transition-colors hover:border-hot-orange hover:bg-hot-orange/15"
							data-mobile-nav-close
							href={HEADER_RESERVE_ID_LINK.href}
							rel="noopener"
							target="_blank"
						>
							{HEADER_RESERVE_ID_LINK.label}
							<ExternalLink aria-hidden="true" className="h-4 w-4" />
						</AppLink>
						<AppLink
							className="flex w-full items-center justify-center rounded-lg bg-hot-orange px-4 py-3 font-semibold text-white transition hover:opacity-90"
							data-mobile-nav-close
							href="/quick-start"
						>
							Quick Start
						</AppLink>
						<div className="mt-3 flex items-center justify-between">
							<AppLink
								className="ha-nav-link flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
								data-mobile-nav-close
								href="/contact"
								{...getNavLinkProps('/contact', 'exact')}
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
