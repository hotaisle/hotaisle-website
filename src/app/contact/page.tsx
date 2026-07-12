import { createPageMetadata } from '@/lib/metadata.ts';

const CONTACT_TOPICS = [
	{
		description:
			'Tell us about the models, scale, isolation, geography, or capacity constraints you are working through.',
		title: 'Compute and deployment',
	},
	{
		description:
			'Existing customers can reach the people operating the platform for account, provisioning, or technical questions.',
		title: 'Customer support',
	},
	{
		description:
			'Discuss infrastructure partnerships, deployment opportunities, or the next location for sovereign inference capacity.',
		title: 'Partnerships and growth',
	},
] as const;

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Contact Hot Aisle for AMD inference capacity, infrastructure deployments, partnerships, or customer support.',
		path: '/contact',
		title: 'Contact Hot Aisle',
	});
}

export default function ContactPage() {
	return (
		<div className="animation-fade-in bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Contact</p>
							<figure className="mt-10 max-w-sm overflow-hidden border border-border bg-muted p-3 dark:bg-black">
								<video
									autoPlay
									className="aspect-4/3 w-full object-cover"
									loop
									muted
									playsInline
								>
									<source src="/assets/contact/contact.mp4" type="video/mp4" />
								</video>
								<figcaption className="mt-3 border-border border-t pt-3 font-mono text-muted-foreground text-xs dark:border-white/20 dark:text-neutral-400">
									Direct access to the operating team
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								Talk to the people who built it.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								Whether you are planning an inference deployment, working through a
								technical issue, or evaluating a partnership, write to us directly.
							</p>
							<a
								className="mt-8 inline-flex border border-foreground bg-foreground px-5 py-3 font-medium text-background transition-colors hover:opacity-85"
								href="mailto:hello@hotaisle.ai"
							>
								hello@hotaisle.ai
							</a>
							<p className="mt-4 text-muted-foreground text-sm">
								A person on the Hot Aisle team will reply directly. No AI bot, and
								no spam.
							</p>
						</div>
					</div>
				</header>

				<section className="border-border border-b pt-16 pb-10">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Bring context</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Start with the problem you are solving.
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								We will route the conversation to the person who can address it,
								without making you repeat the requirements through a sales chain.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{CONTACT_TOPICS.map((topic, index) => (
							<article className="min-h-64 bg-background p-8" key={topic.title}>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{String(index + 1).padStart(2, '0')}
								</p>
								<h3 className="mt-10 font-bold text-2xl text-foreground">
									{topic.title}
								</h3>
								<p className="mt-4 text-muted-foreground leading-relaxed">
									{topic.description}
								</p>
							</article>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
