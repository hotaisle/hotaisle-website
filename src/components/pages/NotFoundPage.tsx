import { ArrowLeft, Compass, Home } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';

export default function NotFound() {
	return (
		<div className="animation-fade-in bg-background text-foreground relative min-h-screen overflow-hidden">
			<div className="bg-hot-orange/20 pointer-events-none absolute -top-48 -right-32 h-96 w-96 rounded-full blur-3xl" />
			<div className="bg-hot-orange/15 pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full blur-3xl" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
				<div className="border-hot-orange/30 bg-hot-orange/10 text-hot-orange-contrast mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
					<Compass size={14} />
					Page Not Found
				</div>

				<p className="mb-4 text-8xl font-black tracking-tight md:text-9xl">404</p>
				<h1 className="mb-4 text-xl font-black tracking-tight whitespace-nowrap sm:text-3xl md:text-4xl lg:text-5xl">
					Wrong turn in the data center
				</h1>
				<p className="text-muted-foreground mb-10 max-w-2xl text-lg md:text-xl">
					The page you requested does not exist.
				</p>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<AppLink
						className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold transition-all hover:scale-[1.02] hover:opacity-90"
						href="/"
					>
						<Home size={16} />
						Go Home
					</AppLink>
					<AppLink
						className="border-border bg-card text-foreground hover:border-hot-orange/40 hover:bg-muted inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold transition-colors"
						href="/blog"
					>
						<ArrowLeft size={16} />
						Read the Blog
					</AppLink>
				</div>
			</div>
		</div>
	);
}
