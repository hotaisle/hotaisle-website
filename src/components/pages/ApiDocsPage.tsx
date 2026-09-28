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
}: {
	action: string;
	description: string;
	href: string;
	isExternal: boolean;
	label: string;
}) {
	const className = 'group block py-6 text-foreground';

	const content = (
		<>
			<span className="flex items-start justify-between gap-6">
				<span className="font-bold text-2xl transition-colors group-hover:text-hot-orange-contrast">
					{label}
				</span>
				<ArrowUpRight
					aria-hidden="true"
					className="mt-1 h-6 w-6 shrink-0 text-hot-orange-contrast transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
				/>
			</span>
			<span className="mt-2 block max-w-lg text-base text-muted-foreground leading-relaxed">
				{description}
			</span>
			<span className="mt-4 block font-medium text-hot-orange-contrast text-sm">
				{action}
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

				<div className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:py-14">
					<div className="order-2 max-w-2xl space-y-8 lg:order-1">
						<div className="space-y-5">
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

			<section className="mx-auto w-full max-w-6xl border-border border-b px-6">
				<div className="ha-inset-dividers ha-inset-dividers-lg-2 grid lg:grid-cols-[0.95fr_1.05fr]">
					<div className="py-10 lg:pr-16 xl:pr-20">
						<h2
							className="max-w-md font-black text-4xl text-foreground tracking-tighter md:text-5xl"
							id="api-resources-heading"
						>
							Everything needed to make the first request
						</h2>
					</div>
					<section
						aria-labelledby="api-resources-heading"
						className="pb-10 lg:py-10 lg:pl-16"
					>
						<p className="max-w-md text-lg text-muted-foreground leading-relaxed">
							The API reference covers the request surface. The quick start gets your
							team authenticated and running. Both lead to the same isolated compute
							platform.
						</p>
						<ul className="mt-8 [&>li:first-child>a]:pt-0 [&>li:last-child>a]:pb-0">
							{PRIMARY_RESOURCES.map((resource) => (
								<li
									className="border-border border-b last:border-b-0"
									key={resource.label}
								>
									<ResourceLink {...resource} />
								</li>
							))}
						</ul>
					</section>
				</div>
			</section>
		</main>
	);
}
