import { AppLink } from '@/components/AppLink.tsx';
import { FeaturesSection } from '@/components/home/FeaturesSection.tsx';
import HotAisleHero from '@/components/home/HotAisleHero.tsx';
import { SecuritySection } from '@/components/home/SecuritySection.tsx';
import { VideoSection } from '@/components/home/VideoSection.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'AMD Exclusive AI Cloud. Deploy MI300X GPUs in 60 seconds. $1.99/GPU/hr. No contracts, no commitments, no drama.',
		image: '/assets/og/hot-aisle-share.png',
		imageAlt: 'Hot Aisle branded share image',
		path: '/',
		title: 'Hot Aisle - AMD Exclusive AI Cloud',
	});
}

export default function Home() {
	return (
		<div className="animation-fade-in min-h-screen overflow-x-hidden bg-background pb-20 text-foreground">
			<HotAisleHero />

			<SecuritySection />

			<FeaturesSection />

			<VideoSection />

			{/* Footer CTA */}
			<section className="border-border/60 border-t py-24 text-center">
				<div className="mx-auto max-w-2xl px-6">
					<h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
						Ready to accelerate?
					</h2>
					<p className="mb-8 text-lg text-muted-foreground">
						Launch a GPU instance in under 60 seconds. No contracts required.
					</p>
					<AppLink
						className="inline-flex items-center gap-2 rounded-xl bg-hot-orange px-8 py-4 font-semibold text-base text-white shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-orange-500"
						href="/quick-start"
					>
						Launch Instance
					</AppLink>
				</div>
			</section>
		</div>
	);
}
