export const SITE_BASE_URL = 'https://hotaisle.xyz' as const;
export const LIGHTHOUSE_INDEX_URL = '/lighthouse' as const;
const ABSOLUTE_URL_REGEX = /^https?:\/\//;

export interface FooterLink {
	href: string;
	label: string;
}

export interface FooterColumn {
	heading: string;
	links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		heading: 'Get Started',
		links: [
			{ href: '/quick-start', label: 'Quick Start' },
			{ href: '/docs/api', label: 'API Docs' },
			{ href: '/pricing', label: 'Pricing' },
			{ href: '/contact', label: 'Contact Us' },
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
			{ href: '/investors', label: 'Investors' },
			{ href: '/partners', label: 'Partners' },
			{ href: 'https://www.linkedin.com/company/hotaisle/', label: 'LinkedIn' },
			{ href: '/blog', label: 'Blog' },
			{ href: '/policies', label: 'Policies' },
		],
	},
];

export const FOOTER_META_LINKS: FooterLink[] = [
	{ href: '/policies/privacy-policy', label: 'Privacy' },
	{ href: '/policies/terms-of-service', label: 'Terms' },
	{ href: LIGHTHOUSE_INDEX_URL, label: 'Lighthouse' },
	{ href: '/contact', label: 'Contact' },
];

export function getFooterCopyright(): string {
	return `© ${new Date().getFullYear()} Hot Aisle, Inc. AMD Exclusive AI Cloud.`;
}

export function resolveFooterHref(href: string, baseUrl: string = SITE_BASE_URL): string {
	if (ABSOLUTE_URL_REGEX.test(href)) {
		return href;
	}

	return new URL(href, `${baseUrl}/`).toString();
}
