import { ArrowRight } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const EXPANSION_STORY = '/blog/case-for-small-distributed-on-demand-ai-compute';
const OPERATING_PROOF = [
	{ label: 'Not just revenue', value: 'Profitable' },
	{ label: 'Customers served', value: '700+' },
	{ label: 'Building and operating', value: '3 years' },
	{ label: 'Backlog of compute requests', value: '2,000+ MI355X' },
] as const;

const STORY_CHAPTERS = [
	{
		id: 'customers',
		paragraphs: [
			'Our mission is to make powerful, reliable AI compute easy to access. We are obsessive about building what customers want to pay for. Their workloads, feedback, and willingness to come back guide what we build next.',
			'That means removing friction at every step. Customers can fund an account, provision compute, and get to work without a sales process or a long-term contract. Three years of listening and delivering have built a profitable business, a broad customer base, and a queue for MI355X capacity.',
		],
		title: 'Build what customers choose.',
	},
	{
		id: 'operations',
		paragraphs: [
			'Reliability is earned in daily operation. We run the infrastructure, support the people using it, and turn what production teaches us into a better service. Enterprise hardware, direct support, and SOC 2 Type 2 compliance are part of that discipline.',
			'We have spent three years automating the business: provisioning, networking, access, payments, usage tracking, billing, and returning capacity to inventory. Customers get a simpler experience, and a lean team can operate more infrastructure with fewer manual handoffs.',
		],
		title: 'Make reliability repeatable.',
	},
	{
		id: 'expansion',
		paragraphs: [
			'We have designed the business to limit risk. Prepaid usage and demand spread across hundreds of customers reduce dependence on a handful of large contracts. Smaller deployments limit the capital exposed at any one site, while trusted infrastructure partners help us bring capacity online.',
			'We operate from one location today. The next iteration adds MI355X capacity and expands through manageable clusters near available power and customer demand. Each deployment should prove its economics before we repeat it. Over time, that builds a distributed AI cloud with more choice in hardware, location, and control over where workloads run.',
		],
		title: 'Expand one proven deployment at a time.',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Back the next chapter of Hot Aisle: a profitable AI compute business with 700+ customers, three years of execution, and demand waiting for MI355X capacity.',
		image: '/assets/investors/global-inference-network.png',
		imageAlt: 'A vision of regional Hot Aisle compute deployments connected around the world',
		path: '/investors',
		title: 'Investors | Hot Aisle',
	});
}

export default function InvestorsPage() {
	return (
		<div className="bg-background text-foreground">
			<section aria-labelledby="investors-heading" className="border-border border-b">
				<div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-16">
					<div>
						<h1
							className="max-w-2xl font-semibold text-5xl leading-[1.04] sm:text-6xl lg:text-7xl"
							id="investors-heading"
						>
							Back the next chapter of Hot Aisle.
						</h1>
						<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">
							We have built a profitable business by making reliable AI compute easier
							to use. Now we are looking for people who share our mission and want to
							help us expand. Compute infrastructure requires substantial capital, and
							we need backing to secure leases supported by the earnings our business
							already generates.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
							<AppLink
								className="inline-flex min-h-12 items-center gap-2 bg-foreground px-6 py-3 font-medium text-background text-lg transition-opacity hover:opacity-80"
								href="/contact"
							>
								Start a conversation{' '}
								<ArrowRight aria-hidden="true" className="h-4 w-4" />
							</AppLink>
							<AppLink
								className="inline-flex min-h-12 items-center gap-2 font-medium text-lg underline decoration-current/35 underline-offset-4 hover:text-hot-orange-contrast"
								href={EXPANSION_STORY}
							>
								Read our approach{' '}
								<ArrowRight aria-hidden="true" className="h-4 w-4" />
							</AppLink>
						</div>
					</div>
					<figure className="mx-auto w-full max-w-3xl">
						<OptimizedImage
							alt="Pixel-art map illustrating a future network of regional Hot Aisle compute deployments"
							className="aspect-16/10 w-full object-cover"
							height={900}
							pictureClassName="dark:hidden"
							sizes="(max-width: 1024px) 100vw, 50vw"
							src="/assets/investors/global-inference-network.png"
							width={1600}
						/>
						<OptimizedImage
							alt="Pixel-art map illustrating a future network of regional Hot Aisle compute deployments"
							className="aspect-16/10 w-full object-cover"
							height={900}
							pictureClassName="hidden dark:block"
							sizes="(max-width: 1024px) 100vw, 50vw"
							src="/assets/investors/global-inference-network-dark.png"
							width={1600}
						/>
						<figcaption className="mt-3 border-border border-t pt-3 font-mono text-lg text-muted-foreground leading-7">
							The ambition: useful compute, in more places.
						</figcaption>
					</figure>
				</div>
			</section>

			<section
				aria-label="Our operating track record"
				className="border-border border-b bg-muted/35"
			>
				<dl className="ha-inset-dividers ha-inset-dividers-sm-2 ha-inset-dividers-xl-4 mx-auto grid max-w-7xl sm:grid-cols-2 xl:grid-cols-4">
					{OPERATING_PROOF.map(({ label, value }) => (
						<div className="flex flex-col gap-3 px-5 py-7 lg:px-8" key={label}>
							<dt className="whitespace-nowrap text-lg text-muted-foreground leading-7">
								{label}
							</dt>
							<dd className="order-first font-mono text-3xl">{value}</dd>
						</div>
					))}
				</dl>
			</section>

			<div className="mx-auto max-w-7xl px-5 lg:px-8">
				{STORY_CHAPTERS.map(({ id, title, paragraphs }) => (
					<section
						aria-labelledby={`${id}-heading`}
						className="grid gap-6 border-border border-b py-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-12"
						key={id}
					>
						<div>
							<h2
								className="max-w-lg font-semibold text-3xl sm:text-4xl"
								id={`${id}-heading`}
							>
								{title}
							</h2>
						</div>
						<div className="max-w-2xl space-y-5 text-lg text-muted-foreground leading-7">
							{paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					</section>
				))}

				<aside
					aria-labelledby="expansion-story-heading"
					className="my-10 border border-border bg-muted/35 p-6 sm:p-8"
				>
					<h2 className="font-medium text-2xl sm:text-3xl" id="expansion-story-heading">
						<AppLink
							className="underline decoration-current/25 underline-offset-4 hover:text-hot-orange-contrast"
							href={EXPANSION_STORY}
						>
							The Case for Small, Distributed, On-Demand AI Compute
						</AppLink>
					</h2>
					<p className="mt-3 max-w-3xl text-lg text-muted-foreground">
						Jon Stevens on the operating model, automation, and discipline behind the
						expansion.
					</p>
				</aside>
			</div>

			<section
				aria-labelledby="backing-heading"
				className="border-border border-t bg-muted/35"
			>
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8 lg:py-16">
					<h2
						className="max-w-lg font-semibold text-4xl sm:text-5xl"
						id="backing-heading"
					>
						Help us take the next step.
					</h2>
					<div className="max-w-2xl">
						<p className="text-lg text-muted-foreground leading-7">
							We are looking for backing that helps us keep building: aligned capital,
							equipment partnerships, and access to power and data-center space. We
							bring a profitable operation, an automated platform, and customers ready
							for more.
						</p>
						<p className="mt-5 text-lg text-muted-foreground leading-7">
							If you believe in accessible, reliable AI compute and want to back a
							team that has spent three years executing, let&apos;s talk about what we
							can build together.
						</p>
						<AppLink
							className="mt-7 inline-flex min-h-12 items-center gap-2 bg-foreground px-6 py-3 font-medium text-background text-lg transition-opacity hover:opacity-80"
							href="/contact"
						>
							Talk about the next chapter{' '}
							<ArrowRight aria-hidden="true" className="h-4 w-4" />
						</AppLink>
					</div>
				</div>
			</section>
		</div>
	);
}
