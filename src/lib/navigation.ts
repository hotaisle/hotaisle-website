export interface NavigationLink {
	href: string;
	label: string;
}

export const PRIMARY_NAV_LINKS: NavigationLink[] = [
	{ href: '/compute', label: 'Platform' },
	{ href: '/pricing', label: 'Pricing' },
	{ href: '/quick-start', label: 'Get Started' },
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
