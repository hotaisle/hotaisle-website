const MACOS_COMMANDS = `mkdir -p ~/.ssh
chmod 700 ~/.ssh
mv ~/Downloads/id_hotaisle_ed25519 ~/.ssh/
mv ~/Downloads/id_hotaisle_ed25519.pub ~/.ssh/
chmod 600 ~/.ssh/id_hotaisle_ed25519
chmod 644 ~/.ssh/id_hotaisle_ed25519.pub
ssh -i ~/.ssh/id_hotaisle_ed25519 admin.hotaisle.app`;

const WINDOWS_COMMANDS = `New-Item -ItemType Directory -Force "$HOME\\.ssh"
Move-Item "$HOME\\Downloads\\id_hotaisle_ed25519" "$HOME\\.ssh\\"
Move-Item "$HOME\\Downloads\\id_hotaisle_ed25519.pub" "$HOME\\.ssh\\"
icacls "$HOME\\.ssh\\id_hotaisle_ed25519" /inheritance:r
icacls "$HOME\\.ssh\\id_hotaisle_ed25519" /grant:r "\${env:USERNAME}:(R)"
ssh -i "$HOME\\.ssh\\id_hotaisle_ed25519" admin.hotaisle.app`;

const LINUX_COMMANDS = `mkdir -p ~/.ssh
chmod 700 ~/.ssh
mv ~/Downloads/id_hotaisle_ed25519 ~/.ssh/
mv ~/Downloads/id_hotaisle_ed25519.pub ~/.ssh/
chmod 600 ~/.ssh/id_hotaisle_ed25519
chmod 644 ~/.ssh/id_hotaisle_ed25519.pub
ssh -i ~/.ssh/id_hotaisle_ed25519 admin.hotaisle.app`;

const PLATFORM_INSTRUCTIONS = [
	{ commands: MACOS_COMMANDS, id: 'macos', label: 'macOS' },
	{ commands: WINDOWS_COMMANDS, id: 'windows', label: 'Windows PowerShell' },
	{ commands: LINUX_COMMANDS, id: 'linux', label: 'Linux' },
] as const;
const ENABLE_BROWSER_SSH_KEYS = false;

export function EmbeddedTerminal() {
	return (
		<section
			aria-label="Hot Aisle browser terminal"
			className="ha-embedded-terminal mt-10 hidden w-full overflow-hidden border border-border bg-card"
			data-embedded-terminal
			data-ssh-keys-enabled={ENABLE_BROWSER_SSH_KEYS}
		>
			<div className="flex items-center justify-between border-border border-b px-4 py-3">
				<div className="flex items-center gap-2">
					<span
						aria-hidden="true"
						className="ha-embedded-terminal__status-dot size-2 bg-muted-foreground"
					/>
					<span className="ha-embedded-terminal__host font-mono text-foreground text-xs uppercase tracking-widest">
						admin.hotaisle.app
					</span>
				</div>
				<div className="flex items-center gap-3">
					<button
						className="hidden border border-border px-3 py-1.5 font-mono text-foreground text-xs uppercase tracking-widest hover:border-foreground hover:text-hot-orange-contrast focus-visible:border-hot-orange focus-visible:outline-none"
						data-terminal-reconnect
						type="button"
					>
						Reconnect
					</button>
					<p
						aria-live="polite"
						className="font-mono text-muted-foreground text-xs uppercase tracking-widest"
						data-terminal-status
					>
						Loading
					</p>
				</div>
			</div>
			<div className="ha-embedded-terminal__viewport">
				<div
					aria-busy="true"
					aria-label="Interactive SSH terminal"
					className="ha-embedded-terminal__screen"
					data-terminal-screen
					role="application"
				/>
				<button
					className="ha-embedded-terminal__focus-prompt"
					data-terminal-focus-prompt
					type="button"
				>
					Click terminal to focus
				</button>
			</div>
			<div className="hidden border-border border-t p-4" data-terminal-key-downloads>
				<div className="max-w-3xl space-y-4 text-muted-foreground text-sm">
					<p>
						You can always sign in again with your email address and the verification
						code we send you.
					</p>
					<p>
						The SSH key generated for this session was used to log in to the TUI and
						won&apos;t be able to be used from here again, but you can use it from your
						own terminal app. From the team account balance page, hit escape, select
						your name, then add this current session key to your account by hitting
						enter to confirm. Make sure to download both files to use this key for
						future connections. You can add any other SSH keys you use from the TUI as
						well.
					</p>
				</div>
				<div className="mt-3 flex flex-wrap gap-3">
					<button
						className="border border-border bg-foreground px-4 py-2 font-medium text-background text-sm hover:bg-hot-orange"
						data-download-private-key
						type="button"
					>
						Download private key
					</button>
					<button
						className="border border-border px-4 py-2 font-medium text-foreground text-sm hover:border-foreground"
						data-download-public-key
						type="button"
					>
						Download public key
					</button>
				</div>
				<p className="mt-6 max-w-3xl text-muted-foreground text-sm">
					Move the downloaded files into your SSH directory and restrict the private key
					so only your user can read it. If your browser saves downloads somewhere else,
					update the source paths below.
				</p>
				<div className="mt-6" data-platform-instructions>
					<div
						aria-label="SSH key setup platform"
						className="ha-terminal-platform-tabs"
						role="tablist"
					>
						{PLATFORM_INSTRUCTIONS.map(({ id, label }, index) => (
							<button
								aria-controls={`terminal-platform-panel-${id}`}
								aria-selected={index === 0}
								className="ha-terminal-platform-tab"
								data-platform={id}
								id={`terminal-platform-tab-${id}`}
								key={id}
								role="tab"
								tabIndex={index === 0 ? 0 : -1}
								type="button"
							>
								{label}
							</button>
						))}
					</div>
					{PLATFORM_INSTRUCTIONS.map(({ commands, id }, index) => (
						<div
							aria-labelledby={`terminal-platform-tab-${id}`}
							data-platform={id}
							data-platform-panel
							hidden={index !== 0}
							id={`terminal-platform-panel-${id}`}
							key={id}
							role="tabpanel"
						>
							<pre className="overflow-x-auto border border-border border-t-0 bg-background p-4 text-foreground text-sm">
								<code>{commands}</code>
							</pre>
						</div>
					))}
				</div>
			</div>
			<noscript>
				<p className="p-4 font-mono text-sm">ssh admin.hotaisle.app</p>
			</noscript>
		</section>
	);
}
