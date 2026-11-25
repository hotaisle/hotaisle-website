interface SocialCard {
	description: string;
	lines: readonly string[];
	slug: string;
}

export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;
export const SOCIAL_IMAGE_VERSION = 'v1';
export const DEFAULT_SOCIAL_CARD: SocialCard = {
	slug: 'home',
	lines: ['Your GPUs can take', 'the night shift.'],
	description: 'Isolated AMD GPU compute. Powered by hotOS.',
};
export const SOCIAL_CARDS: Readonly<Record<string, SocialCard>> = {
	'/': DEFAULT_SOCIAL_CARD,
	'/about': {
		slug: 'about',
		lines: ['Built by operators.', 'Built for developers.'],
		description: 'Meet the people behind Hot Aisle.',
	},
	'/docs/api': {
		slug: 'api',
		lines: ['Infrastructure,', 'on command.'],
		description: 'The Hot Aisle API. Put GPU compute into your workflow.',
	},
	'/benchmarks-and-analysis': {
		slug: 'benchmarks',
		lines: ['Real workloads.', 'Measured performance.'],
		description: 'AMD GPU benchmarks, analysis, and community results.',
	},
	'/blog': {
		slug: 'blog',
		lines: ['From the people', 'running the platform.'],
		description: 'Engineering, infrastructure, and updates from Hot Aisle.',
	},
	'/cluster': {
		slug: 'cluster',
		lines: ['Your workload.', 'Your whole cluster.'],
		description: 'Dedicated GPU infrastructure, from design to deployment.',
	},
	'/compute': {
		slug: 'compute',
		lines: ['Serious hardware.', 'Usable infrastructure.'],
		description: 'Explore the compute behind the Hot Aisle platform.',
	},
	'/contact': {
		slug: 'contact',
		lines: ['Talk to the people', 'who run the platform.'],
		description: 'Compute, deployment, partnerships, and direct human support.',
	},
	'/datacenter': {
		slug: 'datacenter',
		lines: ['Where your', 'compute lives.'],
		description: 'Inside the infrastructure that keeps Hot Aisle running.',
	},
	'/investors': {
		slug: 'investors',
		lines: ['Build the next', 'layer of compute.'],
		description: 'Developer-first AMD GPU infrastructure. The Hot Aisle opportunity.',
	},
	'/mi300x': {
		slug: 'mi300x',
		lines: ['AMD Instinct MI300X.', 'Ready for your model.'],
		description: '192 GB of HBM3 memory per GPU. Isolated compute for inference.',
	},
	'/mi355x': {
		slug: 'mi355x',
		lines: ['AMD Instinct MI355X.', 'More room to scale.'],
		description: 'Explore the next generation of AMD GPU infrastructure.',
	},
	'/networking': {
		slug: 'networking',
		lines: ['Fast compute needs', 'a fast fabric.'],
		description: 'Explore the networking behind the Hot Aisle platform.',
	},
	'/partners': {
		slug: 'partners',
		lines: ['Better infrastructure.', 'Built together.'],
		description: 'The partners helping us turn hardware into usable capacity.',
	},
	'/policies': {
		slug: 'policies',
		lines: ['Clear terms.', 'Shared responsibility.'],
		description: 'Policies for using and operating Hot Aisle infrastructure.',
	},
	'/pricing': {
		slug: 'pricing',
		lines: ['GPU compute.', 'Straightforward pricing.'],
		description: 'Usage-based billing. No cloud minimum before you prove the workload.',
	},
	'/quick-start': {
		slug: 'quick-start',
		lines: ['From sign-up', 'to running compute.'],
		description: 'Your first GPU workload with the Hot Aisle console or SSH.',
	},
};

export function getSocialImage(path: string) {
	const card = SOCIAL_CARDS[path] ?? DEFAULT_SOCIAL_CARD;
	return {
		alt: `Hot Aisle — ${card.lines.join(' ')} ${card.description}`,
		height: SOCIAL_IMAGE_HEIGHT,
		type: 'image/png',
		url: `/assets/og/hotaisle-${card.slug}-${SOCIAL_IMAGE_VERSION}.png`,
		width: SOCIAL_IMAGE_WIDTH,
	};
}
