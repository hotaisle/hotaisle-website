export interface NavigationLink {
	href: string;
	label: string;
}

export const PRIMARY_NAV_LINKS: NavigationLink[] = [
	{ href: '/quick-start', label: 'Quick Start' },
	{ href: '/pricing', label: 'Pricing' },
	{ href: '/compute', label: 'Platform' },
	{ href: '/investors', label: 'Investors' },
	{ href: '/about', label: 'About' },
	{ href: '/blog', label: 'Blog' },
];

export const HEADER_CONTACT_LINK: NavigationLink = {
	href: '/contact',
	label: 'Contact',
};

export const HEADER_CTA_LINK: NavigationLink = {
	href: '/quick-start',
	label: 'Launch Compute',
};
