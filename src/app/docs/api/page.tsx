import { ArrowUpRight } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const ADMIN_API_DOCS_URL = 'https://admin.hotaisle.app/api/docs/' as const;

const PRIMARY_RESOURCES = [
	{
		action: 'Visit docs',
		description: 'Browse endpoints, schemas, and example payloads in the live reference.',
		href: ADMIN_API_DOCS_URL,
		isExternal: true,
		label: 'API reference',
	},
	{
		action: 'Open quick start',
		description: 'Create your team, connect to the terminal UI, and launch compute.',
		href: '/quick-start',
		isExternal: false,
		label: 'Quick start',
	},
	{
		action: 'Contact Hot Aisle',
		description:
			'Ask about account access, API integration, or an environment you are planning.',
		href: '/contact',
		isExternal: false,
		label: 'Direct support',
	},
] as const;

const GETTING_STARTED_STEPS = [
	'Create or access your Hot Aisle account.',
	'Review the quick start flow for login, SSH, and environment setup.',
	'Use the API reference to inspect operations and request shapes.',
	'Automate the requests your workflow needs, then contact us for support when needed.',
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Documentation and discovery links for the Hot Aisle API, including access guidance and the live API reference.',
		image: '/assets/docs/api-documentation-pixel-art.png',
		imageAlt: '3D pixel-art API documentation workstation',
		path: '/docs/api',
		title: 'API Documentation',
	});
}

function ResourceLink({
	action,
	description,
	href,
	isExternal,
	label,
	position,
}: {
	action: string;
	description: string;
	href: string;
	isExternal: boolean;
	label: string;
	position: number;
}) {
	const className =
		'group grid gap-5 py-7 transition-colors hover:bg-muted/35 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:px-5';

	const content = (
		<>
			<p className="font-mono text-hot-orange-contrast text-xs">
				{String(position).padStart(2, '0')}
			</p>
			<div>
				<h3 className="font-bold text-foreground text-xl">{label}</h3>
				<p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">{description}</p>
			</div>
			<span className="inline-flex items-center gap-2 font-medium text-hot-orange-contrast text-sm transition-colors group-hover:text-foreground">
				{action}
				<ArrowUpRight className="h-4 w-4" />
			</span>
		</>
	);

	if (isExternal) {
		return (
			<a className={className} href={href} rel="noopener" target="_blank">
				{content}
			</a>
		);
	}

	return (
		<AppLink className={className} href={href}>
			{content}
		</AppLink>
	);
}

export default function ApiDocsPage() {
	return (
		<main className="bg-background text-foreground">
			<section className="relative overflow-hidden border-border/70 border-b">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgb(154_51_8/0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgb(14_165_233/0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgb(154_51_8/0.3),transparent_30%),radial-gradient(circle_at_78%_18%,rgb(245_158_11/0.12),transparent_18%),radial-gradient(circle_at_bottom_right,rgb(14_165_233/0.22),transparent_24%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(rgb(15_23_42/0.03)_1px,transparent_1px),linear-gradient(90deg,rgb(15_23_42/0.03)_1px,transparent_1px)] bg-size-[44px_44px] dark:bg-[linear-gradient(rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.08)_1px,transparent_1px)]" />
				<div className="absolute inset-0 hidden dark:block dark:bg-[linear-gradient(180deg,rgb(255_255_255/0.03),transparent_28%,transparent_72%,rgb(14_165_233/0.05))]" />

				<div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:py-20">
					<div className="order-2 max-w-2xl space-y-8 lg:order-1">
						<div className="space-y-5">
							<p className="font-semibold text-hot-orange text-sm uppercase tracking-[0.24em]">
								Service documentation
							</p>
							<h1 className="font-black text-4xl tracking-tight sm:text-5xl lg:text-6xl">
								Hot Aisle API access and reference docs
							</h1>
							<p className="max-w-xl text-lg text-muted-foreground leading-8">
								Manage compute resources through the API, use the live reference and
								quick start flow to move from account access to actual requests.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<a
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-hot-orange px-5 py-3 font-semibold text-white shadow-hot-orange/15 shadow-lg transition hover:-translate-y-0.5 hover:opacity-95"
								href={ADMIN_API_DOCS_URL}
								rel="noopener"
								target="_blank"
							>
								Open docs
								<ArrowUpRight className="h-4 w-4" />
							</a>
							<AppLink
								className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/80 px-5 py-3 font-semibold text-foreground transition hover:border-hot-orange/30 hover:bg-muted/70"
								href="/quick-start"
							>
								Read quick start
							</AppLink>
						</div>
					</div>

					<div className="order-1 mx-auto w-full max-w-xl lg:order-2">
						<div className="rounded-4xl border border-border/80 bg-card/70 p-4 shadow-2xl shadow-black/5 backdrop-blur-sm dark:shadow-black/30">
							<OptimizedImage
								alt="3D pixel-art API documentation workstation with an endpoint board, terminal, and GPU server"
								className="aspect-4/3 w-full rounded-3xl object-cover dark:hidden"
								height={1086}
								src="/assets/docs/api-documentation-pixel-art-light.png"
								width={1448}
							/>
							<OptimizedImage
								alt=""
								aria-hidden="true"
								className="hidden aspect-4/3 w-full rounded-3xl object-cover dark:block"
								height={1086}
								src="/assets/docs/api-documentation-pixel-art.png"
								width={1448}
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
				<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
					<p className="ha-briefing-label">API access</p>
					<div>
						<h2 className="font-black text-4xl text-foreground md:text-5xl">
							From reference to live request.
						</h2>
						<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
							The API reference covers the request surface. The quick start gets your
							team authenticated and running. Both lead to the same isolated compute
							platform.
						</p>
					</div>
				</div>

				<div className="mt-12 grid gap-px bg-border lg:grid-cols-[1.2fr_0.8fr]">
					<section aria-labelledby="api-resources-heading" className="bg-background p-8">
						<div>
							<p className="font-mono text-hot-orange-contrast text-xs">
								PRIMARY RESOURCES
							</p>
							<h2
								className="mt-5 font-bold text-3xl text-foreground"
								id="api-resources-heading"
							>
								Everything needed to make the first request.
							</h2>
						</div>
						<div className="mt-8 divide-y divide-border border-border border-y">
							{PRIMARY_RESOURCES.map((resource, index) => (
								<ResourceLink
									key={resource.label}
									position={index + 1}
									{...resource}
								/>
							))}
						</div>
					</section>

					<section aria-labelledby="api-start-heading" className="bg-muted/35 p-8">
						<p className="font-mono text-hot-orange-contrast text-xs">GET STARTED</p>
						<h2
							className="mt-5 font-bold text-3xl text-foreground"
							id="api-start-heading"
						>
							A clear path through the basics.
						</h2>
						<ol className="mt-8 divide-y divide-border border-border border-y">
							{GETTING_STARTED_STEPS.map((step, index) => (
								<li className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-6" key={step}>
									<span className="font-mono text-hot-orange-contrast text-xs">
										{String(index + 1).padStart(2, '0')}
									</span>
									<p className="text-muted-foreground leading-relaxed">{step}</p>
								</li>
							))}
						</ol>
					</section>
				</div>
			</section>
		</main>
	);
}
