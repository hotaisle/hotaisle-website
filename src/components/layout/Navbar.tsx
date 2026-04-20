'use client';

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
import { usePathname } from 'vinext/shims/navigation';
import { AppLink } from '@/components/AppLink.tsx';
import { HEADER_CONTACT_LINK, HEADER_CTA_LINK, PRIMARY_NAV_LINKS } from '@/lib/navigation.ts';

type NavMatchMode = 'exact' | 'section';

const ARIA_CURRENT_PAGE = 'page';
const LOGO_ALT = 'Hot Aisle';
const LOGO_HEIGHT = 32;
const LOGO_SRC = '/hotaisle-logo.svg';
const LOGO_WIDTH = 104;
const NAV_LINK_CLASS_NAME =
	'ha-nav-link rounded-md px-3 py-2 font-medium text-[0.95rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const MOBILE_NAV_LINK_CLASS_NAME =
	'ha-nav-link flex items-center gap-3 rounded-md px-3 py-2 font-medium text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const CONTACT_LINK_CLASS_NAME =
	'ha-nav-link hidden min-h-10 min-w-10 items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex';
const ICON_BUTTON_CLASS_NAME =
	'min-h-10 min-w-10 rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const INDEX_FILE_SUFFIX = '/index.html';
const SECTION_MATCH_MODE: NavMatchMode = 'section';

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

export function Navbar() {
	const pathname = usePathname();
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
			<header className="sticky top-0 z-40 w-full border-border/60 border-b bg-background/95 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
					{/* Left: Logo + Primary Nav */}
					<div className="flex items-center gap-8">
						<AppLink aria-label="Home" href="/">
							<img
								alt={LOGO_ALT}
								className="h-8 w-auto object-contain"
								fetchPriority="high"
								height={LOGO_HEIGHT}
								src={LOGO_SRC}
								width={LOGO_WIDTH}
							/>
						</AppLink>

						<nav className="hidden items-center gap-1 lg:flex">
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
						<AppLink
							className={CONTACT_LINK_CLASS_NAME}
							href={HEADER_CONTACT_LINK.href}
							title="Contact"
							{...getNavLinkProps(HEADER_CONTACT_LINK.href, 'exact')}
						>
							<Mail className="h-[1.125rem] w-[1.125rem]" />
						</AppLink>

						<button
							aria-label="Switch to dark mode"
							className={ICON_BUTTON_CLASS_NAME}
							data-theme-toggle
							title="Switch to dark mode"
							type="button"
						>
							<span aria-hidden="true" className="text-3xl leading-none">
								◐
							</span>
						</button>

						<AppLink
							className="ha-header-cta hidden bg-hot-orange px-4 py-2 font-medium text-sm text-white shadow-sm transition hover:opacity-90 lg:inline-flex"
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
							className="flex w-full items-center justify-center rounded-lg bg-hot-orange px-4 py-3 font-semibold text-white transition hover:opacity-90"
							data-mobile-nav-close
							href="/quick-start"
						>
							Start Now
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
