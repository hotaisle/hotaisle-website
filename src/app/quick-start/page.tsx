import { ArrowRight } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';
import CopyCommand from '@/components/CopyCommand.tsx';
import { OptimizedImage } from '@/components/OptimizedImage.tsx';
import { TerminalTyping } from '@/components/TerminalTyping.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

const FIRST_LAUNCH_STEPS = [
	{
		description: 'Log in to the terminal UI and create a team.',
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
			'Get started with Hot Aisle in under 60 seconds, from SSH login through account setup and first workload.',
		image: '/assets/og/hot-aisle-inference-cloud.png',
		imageAlt: 'Hot Aisle branded share image',
		path: '/quick-start',
		title: 'Quick Start',
	});
}

function ResourceGrid({ columns, resources }: { columns: string; resources: readonly Resource[] }) {
	return (
		<div className={`mt-12 grid gap-px bg-border ${columns}`}>
			{resources.map((resource, index) => {
				const isExternal = resource.href.startsWith('http');
				const linkClassName =
					'mt-auto inline-flex items-center gap-2 pt-8 font-medium text-hot-orange-contrast text-sm hover:text-foreground';

				return (
					<article
						className="flex min-h-60 flex-col bg-background p-8"
						key={resource.title}
					>
						<p className="font-mono text-hot-orange-contrast text-xs">
							{String(index + 1).padStart(2, '0')}
						</p>
						<h3 className="mt-10 font-bold text-2xl text-foreground">
							{resource.title}
						</h3>
						<p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
							{resource.description}
						</p>
						{isExternal ? (
							<a
								className={linkClassName}
								href={resource.href}
								rel="noopener"
								target="_blank"
							>
								{resource.label}
								<ArrowRight aria-hidden="true" size={16} />
							</a>
						) : (
							<AppLink className={linkClassName} href={resource.href}>
								{resource.label}
								<ArrowRight aria-hidden="true" size={16} />
							</AppLink>
						)}
					</article>
				);
			})}
		</div>
	);
}

export default function QuickStartPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto max-w-6xl px-6">
				<header className="border-border border-b py-14 md:py-18">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<div>
							<p className="ha-briefing-label">Quick start</p>
							<figure className="relative mt-10 max-w-sm overflow-hidden border border-border bg-black">
								<OptimizedImage
									alt="3D pixel-art terminal workstation for provisioning cloud compute"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="hidden dark:block"
									src="/assets/quickstart/terminal-provisioning-pixel-art.png"
									width={1448}
								/>
								<OptimizedImage
									alt=""
									aria-hidden="true"
									className="aspect-4/3 w-full object-cover"
									height={1086}
									pictureClassName="dark:hidden"
									src="/assets/quickstart/terminal-provisioning-pixel-art-light.png"
									width={1448}
								/>
								<div className="pointer-events-none absolute right-[8%] bottom-[11%] left-[8%] overflow-hidden font-mono text-[0.55rem] text-emerald-600 sm:text-xs dark:text-green-400">
									<TerminalTyping />
								</div>
							</figure>
						</div>
						<div>
							<h1 className="max-w-3xl font-black text-5xl text-foreground tracking-tighter md:text-7xl">
								From terminal to isolated compute.
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
								Self-service AMD GPU compute with no sales handoff in the way.
							</p>
						</div>
					</div>

					<div className="mt-12 grid gap-px bg-border md:grid-cols-3">
						{FIRST_LAUNCH_STEPS.map((step, index) => (
							<div className="min-h-48 bg-background p-7" key={step.title}>
								<p className="font-mono text-hot-orange-contrast text-xs">
									{String(index + 1).padStart(2, '0')}
								</p>
								<h3 className="mt-8 font-bold text-2xl text-foreground">
									{step.title}
								</h3>
								<p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</header>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Terminal access</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Connect via SSH.
							</h2>
							<p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
								Log in to the Hot Aisle terminal UI and create your team from the
								same place you provision compute.
							</p>
							<div className="mt-8 max-w-2xl">
								<CopyCommand command="ssh admin.hotaisle.app" />
							</div>
							<p className="mt-4 max-w-2xl text-muted-foreground text-sm leading-relaxed">
								For a terminal app, use{' '}
								<a
									className="font-medium text-hot-orange-contrast hover:text-foreground"
									href="https://ghostty.org/"
									rel="noopener"
									target="_blank"
								>
									Ghostty
								</a>{' '}
								on macOS and Linux, or{' '}
								<a
									className="font-medium text-hot-orange-contrast hover:text-foreground"
									href="https://wezterm.org/"
									rel="noopener"
									target="_blank"
								>
									WezTerm
								</a>{' '}
								on Windows.
							</p>
						</div>
					</div>
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">After launch</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Next steps
							</h2>
							<p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
								Your VM already comes with a recent ROCm setup, and Docker or Podman
								is ready to go. AMD recommends using their dev containers, which is
								a lot easier than installing everything by hand, and their docs are
								solid. If you have any feedback, we’d be happy to pass it along to
								them.
							</p>
						</div>
					</div>
					<ResourceGrid columns="md:grid-cols-2" resources={NEXT_STEP_RESOURCES} />
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Programmatic access</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Build from your own tooling.
							</h2>
							<p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
								The same platform is available through the API, CLI, and cloud-init
								templates.
							</p>
						</div>
					</div>
					<ResourceGrid columns="md:grid-cols-3" resources={PROGRAMMATIC_RESOURCES} />
				</section>

				<section className="border-border border-b py-16">
					<div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
						<p className="ha-briefing-label">Questions</p>
						<div>
							<h2 className="font-black text-4xl text-foreground md:text-5xl">
								Talk to a real person.
							</h2>
							<a
								className="mt-5 inline-flex font-bold text-2xl text-hot-orange-contrast hover:text-foreground"
								href="mailto:hello@hotaisle.ai"
							>
								hello@hotaisle.ai
							</a>
							<p className="mt-3 text-muted-foreground text-sm">
								A real human will reply, not an AI bot or support agent.
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
