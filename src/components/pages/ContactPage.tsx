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
				<header className="border-border border-b py-12 md:py-14">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<figure className="border-border bg-muted max-w-sm overflow-hidden border p-3 dark:bg-black">
								<video
									autoPlay
									className="aspect-4/3 w-full object-cover"
									loop
									muted
									playsInline
								>
									<source src="/assets/contact/contact.mp4" type="video/mp4" />
								</video>
								<figcaption className="border-border text-muted-foreground mt-3 border-t pt-3 font-mono text-xs dark:border-white/20 dark:text-neutral-400">
									Direct access to the operating team
								</figcaption>
							</figure>
						</div>
						<div>
							<h1 className="text-foreground max-w-3xl text-5xl font-black tracking-tighter md:text-7xl">
								Talk to the people who built it
							</h1>
							<p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
								Whether you are planning an inference deployment, working through a
								technical issue, or evaluating a partnership, write to us directly.
							</p>
							<a
								className="border-foreground bg-foreground text-background mt-8 inline-flex border px-5 py-3 font-medium transition-colors hover:opacity-85"
								href="mailto:hello@hotaisle.ai"
							>
								hello@hotaisle.ai
							</a>
							<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
								A human on the Hot Aisle team will reply directly. No AI bot, and no
								spam.
							</p>
						</div>
					</div>
				</header>

				<section className="border-border border-b py-10">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Start with the problem you are solving
						</h2>
						<p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
							We will route the conversation to the person who can address it, without
							making you repeat the requirements through a sales chain.
						</p>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-md-3 bg-border mt-8 grid gap-y-px md:grid-cols-3">
						{CONTACT_TOPICS.map((topic) => (
							<article className="bg-background p-6" key={topic.title}>
								<h3 className="text-foreground text-2xl font-bold">
									{topic.title}
								</h3>
								<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
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
