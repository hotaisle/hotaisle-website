import { BookOpen, Box, Code, Mail, Server, Terminal } from 'lucide-react';
import CopyCommand from '@/components/CopyCommand.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Get started with Hot Aisle in under 60 seconds, from SSH login through account setup and first workload.',
		image: '/assets/og/hot-aisle-share.png',
		imageAlt: 'Hot Aisle branded share image',
		path: '/quick-start',
		title: 'Quick Start',
	});
}

export default function QuickStartPage() {
	return (
		<div className="min-h-screen bg-background pb-20 text-foreground">
			{/* Hero Header with Banner */}
			<div className="relative h-100 w-full overflow-hidden border-border border-b">
				<div className="absolute inset-0 bg-background">
					<video
						autoPlay
						className="absolute inset-0 h-full w-full object-cover"
						loop
						muted
						playsInline
					>
						<source
							src="/assets/quickstart/Data_Bits_and_Information_Video.mp4"
							type="video/mp4"
						/>
					</video>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(154_51_8/0.2),transparent_45%)]" />
					<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-hot-orange/60 to-transparent" />
					<div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[48px_48px] opacity-25" />
					<div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />
				</div>

				<div className="absolute bottom-0 left-0 flex w-full flex-col items-center p-8 pb-12 text-center">
					<div className="container mx-auto max-w-4xl">
						<h1 className="mb-4 font-black text-5xl text-foreground tracking-tighter md:text-7xl">
							Quick Start
						</h1>
						<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
							From gpu poor to gpu rich in under 60 seconds.
						</p>
					</div>
				</div>
			</div>

			{/* Main Connection Steps */}
			<div className="container relative z-10 mx-auto -mt-8 max-w-4xl px-6">
				<div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl border border-border bg-card p-8 shadow-xl md:p-12">
					<div className="mb-8 flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
							<Terminal size={24} />
						</div>
						<h2 className="font-bold text-2xl">Connect via SSH</h2>
					</div>

					<div className="w-full max-w-xl">
						<CopyCommand command="ssh admin.hotaisle.app" />
					</div>

					<p className="mt-4 max-w-xl text-center text-muted-foreground text-sm">
						If you need a terminal app, use
						<a
							className="mx-1 font-medium text-hot-orange-contrast hover:underline"
							href="https://www.cmux.dev/"
							rel="noopener"
							target="_blank"
						>
							cmux
						</a>
						on macOS,
						<a
							className="mx-1 font-medium text-hot-orange-contrast hover:underline"
							href="https://ghostty.org/"
							rel="noopener"
							target="_blank"
						>
							Ghostty
						</a>
						on Linux,
						<br />
						and
						<a
							className="mx-1 font-medium text-hot-orange-contrast hover:underline"
							href="https://wezterm.org/"
							rel="noopener"
							target="_blank"
						>
							WezTerm
						</a>
						on Windows.
					</p>

					<div className="mt-8 w-full max-w-xl space-y-6">
						<div className="flex gap-4">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-bold text-sm text-white">
								1
							</div>
							<div>
								<h3 className="mb-1 font-bold text-lg">Create Account</h3>
								<p className="text-muted-foreground text-sm">
									Log in to the TUI (Terminal User Interface) and create a team.
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-bold text-sm text-white">
								2
							</div>
							<div>
								<h3 className="mb-1 font-bold text-lg">Add Credits</h3>
								<p className="text-muted-foreground text-sm">
									Top up via Stripe (Credit Card) or crypto stablecoins
									(USDT/USDC).
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-bold text-sm text-white">
								3
							</div>
							<div>
								<h3 className="mb-1 font-bold text-lg">Launch Instance</h3>
								<p className="text-muted-foreground text-sm">
									Select your GPU configuration and start computing instantly.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Next Steps Guide */}
			<div className="container mx-auto mt-24 max-w-5xl px-6">
				<div className="mb-16 text-center">
					<h2 className="mb-6 font-black text-4xl">Next Steps</h2>
					<p className="mx-auto max-w-3xl text-muted-foreground text-xl">
						Oh hey 👋 wondering what to do after you spin up your VM? We’ve got a few
						tips.
					</p>
				</div>

				<div className="space-y-12 rounded-2xl border border-border bg-card p-8 shadow-xl md:p-12">
					{/* Intro */}
					<div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
						<p>
							<span>Your VM already comes with </span>
							<strong className="text-foreground">ROCm</strong>
							<span> (usually a pretty recent version), and</span>
							<strong className="text-foreground"> Docker </strong>
							<span>
								(or Podman) is ready to roll since it’s the go-to for AMD tooling.
								AMD themselves suggest using their containers for development,
								because, let’s be real, installing everything by hand is still a
								major pain. The good news is that their provided documentation is
								well polished.
							</span>
						</p>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{/* AMD */}
						<div className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-hot-orange/50">
							<div className="mb-4 flex items-center gap-3">
								<Box className="h-5 w-5 shrink-0 text-hot-orange" />
								<h3 className="font-bold text-lg">Quickstart with AMD</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								Pro tip: start your container with an external volume so your work
								sticks around after the container exits.
							</p>
							<a
								className="mt-auto flex items-center pt-2 font-bold text-hot-orange-contrast text-sm hover:underline"
								href="https://rocm.docs.amd.com/projects/install-on-linux/en/latest/how-to/docker.html"
								rel="noopener"
								target="_blank"
							>
								View Docker Guide <Terminal className="ml-1" size={14} />
							</a>
						</div>

						{/* dstack */}
						<div className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-hot-orange/50">
							<div className="mb-4 flex items-center gap-3">
								<Server className="h-5 w-5 shrink-0 text-hot-orange" />
								<h3 className="font-bold text-lg">Automate with dstack</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								Want to get the most out of our VMs (and save some cash) by
								automating your deployment? Check out our tight API integration.
							</p>
							<a
								className="mt-auto flex items-center pt-2 font-bold text-hot-orange-contrast text-sm hover:underline"
								href="https://dstack.ai/blog/hotaisle/"
								rel="noopener"
								target="_blank"
							>
								View dstack Integration <Terminal className="ml-1" size={14} />
							</a>
						</div>

						{/* ChatXYZ */}
						<div className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-hot-orange/50">
							<div className="mb-4 flex items-center gap-3">
								<Server className="h-5 w-5 shrink-0 text-hot-orange" />
								<h3 className="font-bold text-lg">ChatXYZ + Open WebUI</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								Build a private ChatGPT-style interface on Hot Aisle with Open
								WebUI, vLLM, and an SSH tunnel to your GPU VM.
							</p>
							<a
								className="mt-auto flex items-center pt-2 font-bold text-hot-orange-contrast text-sm hover:underline"
								href="/blog/chatxyz-openwebui-hotaisle"
							>
								Read Blog Post <Terminal className="ml-1" size={14} />
							</a>
						</div>

						{/* OpenCode */}
						<div className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-hot-orange/50">
							<div className="mb-4 flex items-center gap-3">
								<Server className="h-5 w-5 shrink-0 text-hot-orange" />
								<h3 className="font-bold text-lg">OpenCode + vLLM</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								Connect OpenCode to a self-hosted vLLM server on Hot Aisle with SSH
								tunneling and AMD MI300X GPUs.
							</p>
							<a
								className="mt-auto flex items-center pt-2 font-bold text-hot-orange-contrast text-sm hover:underline"
								href="/blog/opencode-vllm-hotaisle"
							>
								Read Blog Post <Terminal className="ml-1" size={14} />
							</a>
						</div>

						{/* PyTorch */}
						<div className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-hot-orange/50">
							<div className="mb-4 flex items-center gap-3">
								<Code className="h-5 w-5 shrink-0 text-hot-orange" />
								<h3 className="font-bold text-lg">PyTorch Official Guide</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								If PyTorch is your mojo, check out AMD’s official installation
								guide.
							</p>
							<a
								className="mt-auto flex items-center pt-2 font-bold text-hot-orange-contrast text-sm hover:underline"
								href="https://rocm.docs.amd.com/projects/install-on-linux/en/latest/install/3rd-party/pytorch-install.html"
								rel="noopener"
								target="_blank"
							>
								View PyTorch Guide <Terminal className="ml-1" size={14} />
							</a>
						</div>

						{/* TinyGrad */}
						<div className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-hot-orange/50">
							<div className="mb-4 flex items-center gap-3">
								<Terminal className="h-5 w-5 shrink-0 text-hot-orange" />
								<h3 className="font-bold text-lg">TinyGrad Setup</h3>
							</div>
							<p className="text-muted-foreground text-sm">
								If you’re more into TinyGrad, follow their setup here.
							</p>
							<a
								className="mt-auto flex items-center pt-2 font-bold text-hot-orange-contrast text-sm hover:underline"
								href="https://github.com/tinygrad/tinygrad/#installation"
								rel="noopener"
								target="_blank"
							>
								View TinyGrad Repo <Terminal className="ml-1" size={14} />
							</a>
						</div>
					</div>

					{/* Developer Tools */}
					<div className="border-border border-t pt-12">
						<h3 className="mb-6 flex items-center gap-2 font-bold text-xl">
							<Terminal className="text-hot-orange" /> Work Programmatically with Hot
							Aisle solutions
						</h3>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<a
								className="group flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
								href="https://admin.hotaisle.app/api/docs/"
								rel="noopener"
								target="_blank"
							>
								<span className="font-medium font-mono">API Docs</span>
								<BookOpen
									className="text-muted-foreground group-hover:text-foreground"
									size={16}
								/>
							</a>
							<a
								className="group flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
								href="https://github.com/hotaisle/hotaisle-cli"
								rel="noopener"
								target="_blank"
							>
								<span className="font-medium font-mono">CLI</span>
								<Code
									className="text-muted-foreground group-hover:text-foreground"
									size={16}
								/>
							</a>
							<a
								className="group flex items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
								href="https://github.com/hotaisle/cloud-init-templates"
								rel="noopener"
								target="_blank"
							>
								<span className="font-medium font-mono">Cloud-init template</span>
								<Terminal
									className="text-muted-foreground group-hover:text-foreground"
									size={16}
								/>
							</a>
						</div>
					</div>

					{/* Contact */}
					<div className="rounded-xl border border-hot-orange/10 bg-hot-orange/5 p-8 text-center">
						<h3 className="mb-2 font-bold text-4xl">Questions?</h3>
						<a
							className="flex items-center justify-center gap-2 font-bold text-hot-orange-contrast text-xl hover:underline"
							href="mailto:hello@hotaisle.ai"
						>
							<Mail size={20} /> hello@hotaisle.ai
						</a>
						<p className="mt-3 text-muted-foreground text-sm">
							A real human will reply, not an AI bot or support agent.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
