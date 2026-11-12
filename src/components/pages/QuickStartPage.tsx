import { ArrowUpRight } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import CopyCommand from '@/components/CopyCommand.tsx';
import { EmbeddedTerminal } from '@/components/EmbeddedTerminal.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { TerminalTyping } from '@/components/TerminalTyping.tsx';
import { VideoPreview } from '@/components/VideoPreview.tsx';
import { CONSOLE_WALKTHROUGH } from '@/lib/console-walkthrough.ts';
import { createPageMetadata } from '@/lib/metadata.ts';

const CONSOLE_SCREENSHOT = {
	alt: 'Hot Aisle web console showing a running MI300X machine, its SSH command, GPU usage, and a server illustration',
	dark: '/assets/quickstart/hotaisle-console-dark.jpg',
	height: 1735,
	light: '/assets/quickstart/hotaisle-console.jpg',
	width: 2069,
} as const;
const CONSOLE_SCREENSHOT_VARIANTS = [
	{ pictureClassName: 'dark:hidden', src: CONSOLE_SCREENSHOT.light },
	{ pictureClassName: 'hidden dark:block', src: CONSOLE_SCREENSHOT.dark },
] as const;

const FIRST_LAUNCH_STEPS = [
	{
		description: 'Sign in on the web or via SSH and create a team.',
		title: 'Create an account',
	},
	{
		description: 'Add credits with Stripe or crypto stablecoins (USDT and USDC).',
		title: 'Add credits',
	},
	{
		description: 'Choose a GPU configuration and start your isolated compute.',
		title: 'Launch an instance',
	},
] as const;

const NEXT_STEP_RESOURCES = [
	{
		description:
			'Start your container with an external volume so your work remains available after the container exits.',
		href: 'https://rocm.docs.amd.com/projects/install-on-linux/en/latest/how-to/docker.html',
		label: 'View Docker guide',
		title: 'Quickstart with AMD',
	},
	{
		description:
			'Automate deployments and make better use of your VM capacity with our dstack API integration.',
		href: 'https://dstack.ai/blog/hotaisle/',
		label: 'View dstack integration',
		title: 'Automate with dstack',
	},
	{
		description:
			'Build a private ChatGPT-style interface with Open WebUI, vLLM, and an SSH tunnel to your GPU VM.',
		href: '/blog/chatxyz-openwebui-hotaisle',
		label: 'Read blog post',
		title: 'ChatXYZ + Open WebUI',
	},
	{
		description:
			'Connect OpenCode to a self-hosted vLLM server on Hot Aisle with SSH tunneling and AMD MI300X GPUs.',
		href: '/blog/opencode-vllm-hotaisle',
		label: 'Read blog post',
		title: 'OpenCode + vLLM',
	},
	{
		description: 'Use AMD’s official installation guide to get PyTorch running with ROCm.',
		href: 'https://rocm.docs.amd.com/projects/install-on-linux/en/latest/install/3rd-party/pytorch-install.html',
		label: 'View PyTorch guide',
		title: 'PyTorch official guide',
	},
	{
		description:
			'Follow the TinyGrad project setup instructions for an alternative lightweight stack.',
		href: 'https://github.com/tinygrad/tinygrad/#installation',
		label: 'View TinyGrad repository',
		title: 'TinyGrad setup',
	},
] as const;

const PROGRAMMATIC_RESOURCES = [
	{
		description: 'Reference the Hot Aisle API directly from your application or automation.',
		href: '/docs/api',
		label: 'Read API docs',
		title: 'API docs',
	},
	{
		description: 'Use the command line to inspect and manage compute from your terminal.',
		href: 'https://github.com/hotaisle/hotaisle-cli',
		label: 'View CLI',
		title: 'CLI',
	},
	{
		description: 'Configure an instance at first boot with repeatable cloud-init templates.',
		href: 'https://github.com/hotaisle/cloud-init-templates',
		label: 'View templates',
		title: 'Cloud-init templates',
	},
] as const;

interface Resource {
	description: string;
	href: string;
	label: string;
	title: string;
}

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Get started with Hot Aisle through the web console or SSH, from account setup to your first GPU workload.',
		image: '/assets/og/hot-aisle-inference-cloud.png',
		imageAlt: 'Hot Aisle branded share image',
		path: '/quick-start',
		title: 'Quick Start',
	});
}

function ResourceLinkList({ resources }: { resources: readonly Resource[] }) {
	const linkClassName = 'group block py-6 text-foreground';

	return (
		<ul className="[&>li:first-child>a]:pt-0 [&>li:last-child>a]:pb-0">
			{resources.map((resource) => {
				const isExternal = resource.href.startsWith('http');
				const content = (
					<>
						<span className="flex items-start justify-between gap-6">
							<span className="group-hover:text-hot-orange-contrast text-2xl font-bold transition-colors">
								{resource.title}
							</span>
							<ArrowUpRight
								aria-hidden="true"
								className="text-hot-orange-contrast mt-1 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
								size={24}
							/>
						</span>
						<span className="text-muted-foreground mt-2 block max-w-lg text-base leading-relaxed">
							{resource.description}
						</span>
						<span className="text-hot-orange-contrast mt-4 block text-sm font-medium">
							{resource.label}
						</span>
					</>
				);

				return (
					<li className="border-border border-b last:border-b-0" key={resource.title}>
						{isExternal ? (
							<a
								className={linkClassName}
								href={resource.href}
								rel="noopener"
								target="_blank"
							>
								{content}
							</a>
						) : (
							<AppLink className={linkClassName} href={resource.href}>
								{content}
							</AppLink>
						)}
					</li>
				);
			})}
		</ul>
	);
}

export default function QuickStartPage() {
	return (
		<div className="bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b pt-12 pb-8 md:pt-14 md:pb-10">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<figure className="border-border relative max-w-sm overflow-hidden border bg-black">
								<OptimizedImage
									alt="3D pixel-art terminal workstation for provisioning cloud compute"
									className="aspect-4/3 w-full object-cover"
									fetchPriority="high"
									height={1086}
									loading="eager"
									pictureClassName="hidden dark:block"
									responsiveWidths={[480, 672, 800]}
									sizes="(max-width: 640px) calc(100vw - 3rem), 384px"
									src="/assets/quickstart/terminal-provisioning-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									fetchPriority="high"
									height={1086}
									loading="eager"
									pictureClassName="dark:hidden"
									responsiveWidths={[480, 672, 800]}
									sizes="(max-width: 640px) calc(100vw - 3rem), 384px"
									src="/assets/quickstart/terminal-provisioning-pixel-art-light.png"
									width={1448}
								/>
								<div className="pointer-events-none absolute right-[8%] bottom-[11%] left-[8%] overflow-hidden font-mono text-[0.55rem] text-emerald-600 sm:text-xs dark:text-green-400">
									<TerminalTyping />
								</div>
							</figure>
						</div>
						<div>
							<h1 className="text-foreground max-w-3xl text-5xl font-black tracking-tighter md:text-7xl">
								From sign-in to isolated compute
							</h1>
							<p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
								Self-service AMD GPU compute with no sales handoff in the way.
							</p>
						</div>
					</div>

					<h2 className="sr-only">First launch steps</h2>
					<div className="ha-inset-dividers ha-inset-dividers-md-3 bg-border mt-8 grid gap-y-px md:grid-cols-3">
						{FIRST_LAUNCH_STEPS.map((step, index) => (
							<div className="bg-background p-6" key={step.title}>
								<h3 className="text-foreground flex items-baseline gap-3 text-2xl font-bold">
									<span className="text-hot-orange-contrast shrink-0 font-mono font-normal">
										{String(index + 1).padStart(2, '0')}
									</span>
									<span>{step.title}</span>
								</h3>
								<p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</header>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Connect via Web
						</h2>
						<div>
							<p className="border-border bg-muted/35 border-l-hot-orange-contrast max-w-xl border border-l-2 px-4 py-3 text-base leading-relaxed">
								<span className="text-hot-orange-contrast font-mono text-xs font-bold tracking-widest uppercase">
									New
								</span>{' '}
								<span className="text-foreground">hotaisle-console is here.</span>{' '}
								<AppLink
									className="text-hot-orange-contrast hover:text-foreground font-medium underline underline-offset-4"
									href="/blog/introducing-hotaisle-console"
								>
									Read the announcement
								</AppLink>
							</p>
							<p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
								Sign in to the Hot Aisle web console to create your team, add
								credits, and launch and manage GPU machines from your browser.
							</p>
							<a
								className="text-hot-orange-contrast hover:text-foreground mt-6 inline-flex items-center gap-2 text-xl font-bold"
								href="https://console.hotaisle.app"
								rel="noopener"
								target="_blank"
							>
								Open console.hotaisle.app
								<ArrowUpRight aria-hidden="true" size={24} />
							</a>
							<p className="text-muted-foreground mt-4 text-sm leading-relaxed">
								The console is open source.{' '}
								<a
									className="text-hot-orange-contrast hover:text-foreground font-medium"
									href="https://github.com/hotaisle/hotaisle-console"
									rel="noopener"
									target="_blank"
								>
									View hotaisle-console on GitHub
								</a>
							</p>
						</div>
					</div>
					<figure className="mt-8">
						<div className="ha-console-screenshot-stage">
							<VideoPreview
								{...CONSOLE_WALKTHROUGH}
								className="ha-console-screenshot border-border bg-card border"
							>
								{CONSOLE_SCREENSHOT_VARIANTS.map(({ pictureClassName, src }) => (
									<OptimizedImage
										alt={CONSOLE_SCREENSHOT.alt}
										className="block h-auto w-full"
										decoding="async"
										height={CONSOLE_SCREENSHOT.height}
										key={src}
										loading="lazy"
										pictureClassName={pictureClassName}
										responsiveWidths={[480, 672, 800]}
										sizes="(max-width: 1152px) calc(100vw - 4.25rem), 1084px"
										src={src}
										width={CONSOLE_SCREENSHOT.width}
									/>
								))}
							</VideoPreview>
						</div>
						<figcaption className="text-muted-foreground mt-3 text-center text-sm">
							Click to play the video
						</figcaption>
					</figure>
				</section>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Connect via SSH
						</h2>
						<div>
							<p
								className="text-muted-foreground hidden max-w-xl text-lg leading-relaxed"
								data-terminal-supported-copy
							>
								This is a live terminal connected exclusively to{' '}
								<span className="text-success">admin.hotaisle.app</span>, so you can
								explore our unique platform right here, right now. For regular use,
								we recommend one of the terminal apps listed below.
							</p>
							<p
								className="text-muted-foreground max-w-xl text-lg leading-relaxed"
								data-terminal-fallback-copy
							>
								Log in to the Hot Aisle terminal UI with your favorite console
								application and create your team, add credits, and provision
								compute.
							</p>
						</div>
					</div>
					<EmbeddedTerminal />
					<div className="mt-8">
						<CopyCommand command="ssh admin.hotaisle.app" />
					</div>
					<p className="text-muted-foreground mt-4 text-sm leading-relaxed">
						For a terminal app, use{' '}
						<a
							className="text-hot-orange-contrast hover:text-foreground font-medium"
							href="https://ghostty.org/"
							rel="noopener"
							target="_blank"
						>
							Ghostty
						</a>{' '}
						on macOS and Linux, or{' '}
						<a
							className="text-hot-orange-contrast hover:text-foreground font-medium"
							href="https://wezterm.org/"
							rel="noopener"
							target="_blank"
						>
							WezTerm
						</a>{' '}
						on Windows.
					</p>
				</section>

				<section className="border-border border-b">
					<div className="ha-inset-dividers ha-inset-dividers-lg-2 grid lg:grid-cols-[0.95fr_1.05fr]">
						<div className="py-10 lg:pr-16 xl:pr-20">
							<h2 className="text-foreground max-w-sm text-5xl font-black tracking-tighter md:text-6xl">
								Next steps
							</h2>
							<p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
								Your VM already comes with a recent ROCm setup, and Docker or Podman
								is ready to go. AMD recommends using their dev containers, which is
								a lot easier than installing everything by hand, and their docs are
								solid. If you have any feedback, we’d be happy to pass it along to
								them.
							</p>
						</div>
						<div className="pb-10 lg:py-10 lg:pl-16">
							<ResourceLinkList resources={NEXT_STEP_RESOURCES} />
						</div>
					</div>

					<div className="ha-inset-dividers ha-inset-dividers-lg-2 border-border grid border-t lg:grid-cols-[0.95fr_1.05fr]">
						<div className="py-10 lg:pr-16 xl:pr-20">
							<h2 className="text-foreground max-w-md text-4xl font-black tracking-tighter md:text-5xl">
								Build from your own tooling
							</h2>
							<p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
								The same platform is available through the API, CLI, and cloud-init
								templates.
							</p>
						</div>
						<div className="pb-10 lg:py-10 lg:pl-16">
							<ResourceLinkList resources={PROGRAMMATIC_RESOURCES} />
						</div>
					</div>
				</section>

				<section className="border-border border-b py-12">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<h2 className="text-foreground text-4xl font-black md:text-5xl">
							Talk to a real person
						</h2>
						<div>
							<a
								className="text-hot-orange-contrast hover:text-foreground inline-flex text-2xl font-bold"
								href="mailto:hello@hotaisle.ai"
							>
								hello@hotaisle.ai
							</a>
							<p className="text-muted-foreground mt-3 text-sm">
								A real human will reply, not an AI bot or support agent.
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
