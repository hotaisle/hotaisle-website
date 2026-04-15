import { ArrowLeft, Compass, Home } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';

export default function NotFound() {
	return (
		<div className="animation-fade-in relative min-h-screen overflow-hidden bg-background text-foreground">
			<div className="pointer-events-none absolute -top-48 -right-32 h-96 w-96 rounded-full bg-hot-orange/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-hot-orange/15 blur-3xl" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hot-orange/30 bg-hot-orange/10 px-3 py-1 font-bold text-hot-orange-contrast text-xs uppercase tracking-widest">
					<Compass size={14} />
					Page Not Found
				</div>

				<p className="mb-4 font-black text-8xl tracking-tight md:text-9xl">404</p>
				<h1 className="mb-4 max-w-2xl font-black text-3xl tracking-tight md:text-5xl">
					Wrong turn in the data center.
				</h1>
				<p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
					The page you requested does not exist.
				</p>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<AppLink
						className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-bold text-background transition-all hover:scale-[1.02] hover:opacity-90"
						href="/"
					>
						<Home size={16} />
						Go Home
					</AppLink>
					<AppLink
						className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-bold text-foreground transition-colors hover:border-hot-orange/40 hover:bg-muted"
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
