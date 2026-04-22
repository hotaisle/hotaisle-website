import {
	ArrowRight,
	BarChart,
	Briefcase,
	Cpu,
	MessageSquare,
	Settings,
	ShieldCheck,
	Users,
	Zap,
} from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Design and deploy AMD GPU clusters with Hot Aisle, from compact builds to large multi-node AI and HPC environments.',
		path: '/cluster',
		title: 'Cluster Design',
	});
}

const clusters = [
	{
		title: 'Performance Beyond Compare',
		desc: "Hot Aisle's clusters aren't just powerful, they're built for the future. Our flagship 128 GPU MI300x bare metal cluster delivers peak performance with AMD's enterprise architecture, giving you compute power that can match or exceed an H200 setup. For businesses looking to push AI boundaries or handle complex simulations, these clusters are your ticket to rapid insights and growth.",
		icon: Zap,
	},
	{
		title: 'Scalable & Customizable',
		desc: "We design our clusters to scale seamlessly as your needs evolve. Whether you're looking for a compact, high-power cluster or a massive multi-data-center deployment, we are ready to tailor a solution just for you.",
		icon: Settings,
	},
];

const reasons = [
	{
		title: 'Trusted Expertise',
		desc: 'Founded by industry veterans, Hot Aisle combines years of experience in open-source, large-scale compute, and data center management. Our team has deployed and optimized tens of thousands of servers across multiple environments.',
		icon: Users,
	},
	{
		title: 'Cutting-Edge Hardware',
		desc: "With top-of-the-line AMD hardware, we're among the few providers enabling true high-density, high-performance compute. Our recent partnership with Dell for hardware and support, paired with AMD's MI300x (skip MI325x, go for MI355x), ensures you're accessing the latest tech.",
		icon: Cpu,
	},
	{
		title: 'No Hidden Costs',
		desc: 'We provide transparent pricing and flexibility with our model, meaning you can harness supercomputer-grade resources without the hefty CapEx. Our deep relationships with vendors will ensure you get the best pricing.',
		icon: BarChart,
	},
	{
		title: 'Bring Your Own DC',
		desc: "We've developed relationships with a number of Tier 3-5 data centers in the US. We can help negotiate your DC, Insurance and Internet contracts for you.",
		icon: ShieldCheck,
	},
];

const services = [
	{
		title: 'Workload Optimization',
		desc: "We don't just deliver the hardware; we optimize it. Our team fine-tunes every aspect of your compute to squeeze out the best performance, ensuring ROI with every cycle.",
	},
	{
		title: 'Custom Solutions',
		desc: "Every project is unique. Whether you're building a dedicated cluster for research or integrating a hybrid cloud environment, our architects design solutions that work in tandem with your specific goals.",
	},
	{
		title: 'Filling in the Gaps',
		desc: 'Supply chain management, ensuring that nothing is left out of your deployment and everything is delivered on-time.',
	},
	{
		title: 'Expertise When You Need It',
		desc: 'Our consulting extends beyond setup, with ongoing support to keep your workloads running smoothly and efficiently as you scale.',
	},
];

const testimonials = [
	{
		text: "Hot Aisle's team helped us deploy our AI infrastructure within weeks, not months. The performance gains were immediate, and the ongoing support keeps our projects on track.",
		author: 'AI Infrastructure Lead',
	},
	{
		text: 'The Hot Aisle cluster outperformed our expectations, allowing us to hit milestones faster than we thought possible. The team was hands-on from start to finish, optimizing everything for our exact needs.',
		author: 'CTO, FinTech Research Firm',
	},
];

export default function ClusterPage() {
	return (
		<div className="animation-fade-in min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Section */}
			<div className="relative border-border border-b bg-muted/20">
				<div className="container mx-auto max-w-6xl px-6 py-32 text-center">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-bold text-foreground text-xs uppercase tracking-wider shadow-sm">
						<Briefcase className="text-hot-orange" size={14} />
						Design & Deploy
					</div>

					<h1 className="mb-8 font-black text-5xl text-foreground leading-tight tracking-tighter md:text-7xl">
						Unlock the Full Potential <br className="hidden md:block" />
						<span className="whitespace-nowrap">
							of <span className="text-hot-orange">AI & HPC</span>
						</span>
					</h1>

					{/* Cluster Photo */}
					<div className="mx-auto mb-12 max-w-md rounded-3xl border border-border bg-card p-4 shadow-sm">
						<img
							alt="Hot Aisle cluster setup with Powered by AMD signage"
							className="h-auto w-full rounded-2xl object-cover"
							height={679}
							src="/assets/cluster/cluster-powered-by-amd.webp"
							width={456}
						/>
					</div>

					<p className="mx-auto mb-12 max-w-4xl font-light text-muted-foreground text-xl leading-relaxed md:text-2xl">
						Welcome to Hot Aisle, where unparalleled compute power and expert consulting
						come together. We’re here to help you maximize performance, efficiency, and
						innovation with cutting-edge clusters designed to meet today’s most
						demanding AI and HPC workloads.
					</p>

					<div className="flex flex-col justify-center gap-6 md:flex-row">
						<AppLink
							className="rounded-full bg-foreground px-10 py-4 font-bold text-background text-lg transition-transform hover:scale-105 hover:opacity-90"
							href="/contact"
						>
							Start Your Deployment
						</AppLink>
						<a
							className="rounded-full border border-border bg-background px-10 py-4 font-bold text-foreground text-lg transition-colors hover:bg-muted"
							href="#clusters"
						>
							Explore Clusters
						</a>
					</div>
				</div>
			</div>

			{/* Meet Our Clusters */}
			<div className="container mx-auto max-w-6xl px-6 py-24" id="clusters">
				<h2 className="mb-16 text-center font-black text-4xl text-foreground">
					Meet Our Clusters
				</h2>
				<div className="grid grid-cols-1 gap-12 md:grid-cols-2">
					{clusters.map((item) => (
						<div
							className="group rounded-3xl border border-border bg-card p-10 shadow-sm transition-all hover:border-hot-orange/40"
							key={item.title}
						>
							<div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-hot-orange/10">
								<item.icon
									className="text-muted-foreground group-hover:text-hot-orange"
									size={32}
								/>
							</div>
							<h3 className="mb-4 font-bold text-3xl text-foreground">
								{item.title}
							</h3>
							<p className="text-lg text-muted-foreground leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Why Hot Aisle */}
			<div className="border-border border-y bg-muted/30 px-6 py-24">
				<div className="container mx-auto max-w-6xl">
					<h2 className="mb-16 text-center font-black text-4xl text-foreground">
						Why Hot Aisle?
					</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{reasons.map((reason) => (
							<div
								className="flex items-start gap-6 rounded-2xl border border-border bg-background p-8"
								key={reason.title}
							>
								<div className="shrink-0 rounded-xl bg-muted p-3">
									<reason.icon className="text-foreground" size={24} />
								</div>
								<div>
									<h3 className="mb-2 font-bold text-foreground text-xl">
										{reason.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{reason.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Consulting Services */}
			<div className="container mx-auto max-w-6xl px-6 py-24">
				<div className="flex flex-col gap-16 lg:flex-row">
					<div className="lg:w-1/3">
						<h2 className="mb-6 font-black text-4xl text-foreground leading-tight">
							Consulting & <br />
							<span className="text-hot-orange">Custom Deployments</span>
						</h2>
						<p className="mb-8 text-muted-foreground text-xl">
							Our consulting services go beyond simple deployment. With us, you get
							end-to-end support.
						</p>
						<div className="rounded-2xl border border-border bg-card p-6">
							<h4 className="mb-2 font-bold text-foreground">
								Want to build a supercomputer?
							</h4>
							<p className="mb-4 text-muted-foreground text-sm">
								But don't know where to start? We can help you design, build, and
								deploy.
							</p>
							<AppLink
								className="flex items-center gap-1 font-bold text-hot-orange transition-colors hover:text-foreground"
								href="/contact"
							>
								Talk to an Architect <ArrowRight size={16} />
							</AppLink>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">
						{services.map((service) => (
							<div
								className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
								key={service.title}
							>
								<h3 className="mb-3 font-bold text-foreground text-lg">
									{service.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{service.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Testimonials */}
			<div className="container mx-auto mb-12 max-w-5xl px-6 py-12">
				<h2 className="mb-12 text-center font-bold text-muted-foreground text-sm uppercase tracking-widest">
					What People Say
				</h2>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{testimonials.map((t) => (
						<div className="relative rounded-4xl bg-muted/50 p-8" key={t.text}>
							<MessageSquare className="absolute top-8 right-8 h-12 w-12 text-hot-orange/20" />
							<p className="mb-6 font-medium text-foreground text-lg italic leading-relaxed">
								"{t.text}"
							</p>
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600" />
								<div className="font-bold text-muted-foreground text-sm">
									{t.author}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* CTA */}
			<div className="bg-foreground px-6 py-24 text-background">
				<div className="container mx-auto max-w-4xl text-center">
					<h2 className="mb-8 font-black text-4xl leading-tight md:text-5xl">
						Join the Leaders in Compute Innovation
					</h2>
					<p className="mx-auto mb-12 max-w-2xl font-light text-background/80 text-xl md:text-2xl">
						Are you ready to take your projects to the next level? Contact us today to
						learn how Hot Aisle's cluster and consulting services can supercharge your
						AI initiatives.
					</p>
					<AppLink
						className="inline-block rounded-full bg-background px-12 py-5 font-bold text-foreground text-xl transition-transform hover:scale-105"
						href="/contact"
					>
						Contact Us Today
					</AppLink>

					<div className="mt-16 border-white/20 border-t pt-16 text-center">
						<p className="font-serif text-background/60 text-lg italic">
							We absolutely love what we do...
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
