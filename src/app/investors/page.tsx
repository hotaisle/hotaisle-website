import { ArrowRight, Landmark, Waypoints } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const OPERATING_PROOF = [
	{
		detail: 'Hot Aisle has spent nearly three years operating, refining, and learning from real production workloads.',
		label: 'Operating horizon',
		value: '3 years',
	},
	{
		detail: 'Customers around the world have used the platform for compute without procurement drag.',
		label: 'Customers served',
		value: '700+',
	},
	{
		detail: 'From a single isolated GPU VM to dedicated bare metal, backed by the same automated platform.',
		label: 'Deployment range',
		value: '1 to many',
	},
] as const;

const EXPANSION_MODEL = [
	{
		description:
			'Compact, repeatable inference deployments in more data centers, placed near the teams and jurisdictions that need them.',
		title: 'Distributed by design',
	},
	{
		description:
			'Existing automation brings networking, PXE boot, operating systems, ROCm, and KVM isolation online without rebuilding the process at every site.',
		title: 'A repeatable unit',
	},
	{
		description:
			'Partner relationships across hardware, networking, and deployment reduce execution risk before a new location is brought online.',
		title: 'De-risked with partners',
	},
] as const;

const OPERATING_HISTORY = [
	{
		detail: 'Prior experience operating an Ethereum cluster at a scale that made every part of the stack consequential.',
		metric: '150,000',
		title: 'AMD GPUs at W3BCloud',
	},
	{
		detail: 'Experience operating durable, high-throughput storage alongside large-scale compute infrastructure.',
		metric: '20 PB',
		title: 'Filecoin storage cluster',
	},
	{
		detail: 'Hardware, storage, networking, orchestration, and the operations needed to keep all of it useful.',
		metric: 'Full stack',
		title: 'Operational depth',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Hot Aisle is expanding its developer-first sovereign inference cloud through repeatable, globally distributed AMD deployments.',
		image: '/assets/investors/global-inference-network.png',
		imageAlt: 'Global network of distributed Hot Aisle inference deployments',
		path: '/investors',
		title: 'Investors | Hot Aisle',
	});
}

export default function InvestorsPage() {
	return (
		<div className="overflow-x-hidden bg-background text-foreground">
			<section className="border-border border-b">
				<div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-20">
					<div className="max-w-3xl">
						<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
							Investors
						</p>
						<h1 className="mt-6 font-semibold text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
							Built patiently. Ready to compound.
						</h1>
						<p className="mt-7 max-w-2xl text-muted-foreground text-xl leading-9 sm:text-2xl">
							For nearly three years, we have built and operated the automation layer
							for developer-first sovereign inference. The foundation is established.
							The next phase is deliberate, repeatable expansion.
						</p>
						<div className="mt-10 flex flex-wrap gap-3">
							<AppLink
								className="inline-flex min-h-12 items-center gap-2 bg-foreground px-6 py-3 font-medium text-background text-base transition-opacity hover:opacity-80"
								href="/contact"
							>
								Start a conversation <ArrowRight className="h-4 w-4" />
							</AppLink>
						</div>
					</div>

					<figure className="relative mx-auto w-full max-w-3xl lg:mr-0">
						<div className="pointer-events-none absolute inset-3 border border-hot-orange/25" />
						<OptimizedImage
							alt="3D pixel-art map of distributed inference infrastructure"
							className="relative aspect-16/10 w-full object-cover dark:hidden"
							height={900}
							sizes="(max-width: 1024px) 100vw, 56vw"
							src="/assets/investors/global-inference-network.png"
							width={1600}
						/>
						<OptimizedImage
							alt=""
							aria-hidden="true"
							className="relative hidden aspect-16/10 w-full object-cover dark:block"
							height={900}
							sizes="(max-width: 1024px) 100vw, 56vw"
							src="/assets/investors/global-inference-network-dark.png"
							width={1600}
						/>
					</figure>
				</div>
			</section>

			<section className="border-border border-b bg-muted/35">
				<div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
					<div className="grid border-border border-t md:grid-cols-3">
						{OPERATING_PROOF.map((point, index) => (
							<article
								className={`border-border border-b py-7 ${index ? 'md:border-l md:pl-7' : 'md:pr-7'}`}
								key={point.label}
							>
								<p className="font-mono text-3xl">{point.value}</p>
								<h2 className="mt-4 font-medium text-xl">{point.label}</h2>
								<p className="mt-3 max-w-sm text-lg text-muted-foreground leading-8">
									{point.detail}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
					<div>
						<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
							The thesis
						</p>
						<h2 className="mt-6 max-w-xl font-semibold text-5xl leading-[1.04] sm:text-6xl">
							Inference needs sovereignty, not just scale.
						</h2>
					</div>
					<div className="max-w-3xl space-y-7 text-muted-foreground text-xl leading-9">
						<p>
							The next generation of useful software will be built around tokens: a
							practical unit of intelligence that products can request, measure, and
							ship. Even if the market overcorrects, we do not believe the world
							returns to building software without models in the loop.
						</p>
						<p>
							We use AI deeply in our own engineering workflow. With experienced
							operators directing it, AI gives a small team unusual leverage: faster
							iteration, stronger review loops, and more time for the hard systems
							work that cannot be delegated.
						</p>
						<p>
							Sovereign inference gives organizations a credible answer to where their
							models run, where their data stays, and who can operate the environment.
							Open-source models make that control practical. Hot Aisle exists to make
							that choice straightforward for teams that need it.
						</p>
					</div>
				</div>
			</section>

			<section className="border-border border-b bg-foreground text-background">
				<div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-28">
					<div>
						<p className="font-mono text-hot-orange text-xs uppercase tracking-[0.16em]">
							The expansion model
						</p>
						<h2 className="mt-6 max-w-xl font-semibold text-5xl leading-[1.04] sm:text-6xl">
							Small deployments. Global reach.
						</h2>
						<p className="mt-6 max-w-xl text-background/65 text-xl leading-9">
							We are not pursuing one giant deployment and hoping demand follows. We
							will grow through smaller inference-focused sites, each able to serve a
							regional market with the same platform and operating discipline.
						</p>
					</div>
					<div className="border-background/20 border-t">
						{EXPANSION_MODEL.map((point) => (
							<article
								className="grid gap-4 border-background/20 border-b py-7 sm:grid-cols-[11rem_1fr]"
								key={point.title}
							>
								<h3 className="font-medium text-xl">{point.title}</h3>
								<p className="text-background/65 text-lg leading-8">
									{point.description}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b">
				<div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
						<div>
							<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
								The operating experience
							</p>
							<h2 className="mt-6 max-w-lg font-semibold text-5xl leading-[1.04] sm:text-6xl">
								We know the machinery underneath.
							</h2>
						</div>
						<p className="max-w-3xl text-muted-foreground text-xl leading-9">
							Our decades of experience, prior infrastructure work at W3BCloud, and
							three years operating a bronze-tier neocloud taught us how compute,
							storage, and networking behave when the scale is real. That experience
							shapes how we design every customer environment and every new
							deployment.
						</p>
					</div>
					<div className="mt-14 grid border-border border-t md:grid-cols-3">
						{OPERATING_HISTORY.map((item, index) => (
							<article
								className={`border-border border-b py-7 ${index ? 'md:border-l md:pl-7' : 'md:pr-7'}`}
								key={item.title}
							>
								<p className="font-mono text-3xl">{item.metric}</p>
								<h3 className="mt-4 font-medium text-xl">{item.title}</h3>
								<p className="mt-3 max-w-sm text-lg text-muted-foreground leading-8">
									{item.detail}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="border-border border-b bg-muted/35">
				<div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
					<div className="flex gap-4">
						<Landmark
							aria-hidden="true"
							className="mt-1 h-6 w-6 shrink-0 text-hot-orange-contrast"
						/>
						<div>
							<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
								Capital with a job to do
							</p>
							<h2 className="mt-6 font-semibold text-4xl leading-[1.06] sm:text-5xl">
								Capital buys deployable units, not speculative acreage.
							</h2>
						</div>
					</div>
					<div className="max-w-3xl space-y-7 text-muted-foreground text-xl leading-9">
						<p>
							We have customer demand waiting for capacity. The limiting factor is not
							whether the platform can serve the work; it is the capital required to
							put more current-generation hardware online, beginning with AMD MI355X
							compute.
						</p>
						<p>
							We are open to thoughtful conversations about how to finance that
							growth: equity, strategic investment, asset finance, and structures that
							align long-term partners with disciplined expansion. We bring the
							operating platform, deployment experience, partner relationships, and
							demand. The right capital lets us make capacity available.
						</p>
					</div>
				</div>
			</section>

			<section>
				<div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:py-28">
					<div>
						<p className="font-mono text-hot-orange-contrast text-xs uppercase tracking-[0.16em]">
							A conversation, not a campaign
						</p>
						<h2 className="mt-6 max-w-4xl font-semibold text-5xl leading-[1.04] sm:text-7xl">
							Let&apos;s build a verifiably secure sovereign inference cloud.
						</h2>
					</div>
					<AppLink
						className="inline-flex min-h-12 items-center gap-2 bg-hot-orange px-6 py-3 font-medium text-base text-white transition-opacity hover:opacity-85"
						href="/contact"
					>
						<Waypoints className="h-4 w-4" /> Discuss the opportunity
					</AppLink>
				</div>
			</section>
		</div>
	);
}
