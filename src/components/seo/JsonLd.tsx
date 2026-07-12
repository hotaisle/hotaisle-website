const SITE_URL = 'https://hotaisle.xyz';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#service`;
const LOGO_URL = `${SITE_URL}/hotaislelogofull.png`;
const DESCRIPTION =
	'Developer-first cloud infrastructure for production sovereign inference. Provision isolated AMD GPU compute through the Hot Aisle terminal UI, API, or CLI without a sales handoff.';

const schema = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@id': ORGANIZATION_ID,
			'@type': 'Organization',
			alternateName: 'Hot Aisle',
			contactPoint: [
				{
					'@type': 'ContactPoint',
					availableLanguage: ['English'],
					contactType: 'sales',
					email: 'hello@hotaisle.ai',
				},
				{
					'@type': 'ContactPoint',
					availableLanguage: ['English'],
					contactType: 'customer support',
					email: 'hello@hotaisle.ai',
				},
			],
			description: DESCRIPTION,
			email: 'hello@hotaisle.ai',
			founders: [
				{
					'@type': 'Person',
					jobTitle: 'Founder / CEO',
					name: 'Jon Stevens',
					sameAs: 'https://www.linkedin.com/in/jon-s-stevens/',
				},
				{
					'@type': 'Person',
					jobTitle: 'Founder / Head of Engineering',
					name: 'Clint Armstrong',
					sameAs: 'https://www.linkedin.com/in/clint-armstrong/',
				},
			],
			foundingDate: '2023-10',
			image: LOGO_URL,
			knowsAbout: [
				'AMD MI300X GPUs',
				'AMD MI355X GPUs',
				'Automated cloud infrastructure',
				'Developer-first cloud infrastructure',
				'GPU Compute',
				'Inference serving',
				'Isolated GPU virtual machines',
				'Sovereign inference',
				'Bare Metal Clusters',
				'SOC 2 Type 2 Compliance',
			],
			legalName: 'Hot Aisle Inc.',
			logo: {
				'@id': `${SITE_URL}/#logo`,
				'@type': 'ImageObject',
				url: LOGO_URL,
			},
			name: 'Hot Aisle',
			sameAs: ['https://www.linkedin.com/company/hotaisle', 'https://github.com/hotaisle'],
			slogan: 'Developer-first cloud infrastructure for production inference',
			url: SITE_URL,
		},
		{
			'@id': WEBSITE_ID,
			'@type': 'WebSite',
			description: DESCRIPTION,
			inLanguage: 'en-US',
			name: 'Hot Aisle',
			publisher: {
				'@id': ORGANIZATION_ID,
			},
			url: SITE_URL,
		},
		{
			'@id': SERVICE_ID,
			'@type': 'Service',
			description:
				'On-demand AMD MI300X and MI355X GPU infrastructure for isolated production inference workloads.',
			hasOfferCatalog: {
				'@type': 'OfferCatalog',
				itemListElement: [
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'AMD MI300X Compute',
						},
					},
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'AMD MI355X Compute',
						},
					},
					{
						'@type': 'Offer',
						itemOffered: {
							'@type': 'Service',
							name: 'AMD MI300X Bare Metal AI Clusters',
						},
					},
				],
				name: 'Hot Aisle Compute Services',
			},
			name: 'AMD GPU Cloud Infrastructure for Production Inference',
			provider: {
				'@id': ORGANIZATION_ID,
			},
			serviceType: 'GPU Cloud Infrastructure',
		},
	],
} as const;

export default function JsonLd() {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be embedded as raw script content
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			type="application/ld+json"
		/>
	);
}
