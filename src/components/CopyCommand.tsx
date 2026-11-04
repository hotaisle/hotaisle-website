export default function CopyCommand({ command }: { command: string }) {
	return (
		<div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-neutral-300 bg-white p-6 font-mono text-sm text-neutral-900 md:flex-row md:text-base dark:border-neutral-800 dark:bg-black dark:text-neutral-300">
			<code className="text-emerald-700 dark:text-green-400">{command}</code>
			<button
				className="cursor-pointer rounded bg-neutral-800 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-neutral-700"
				data-copy-command-button
				data-copy-command-text={command}
				data-copy-copied-class="!bg-green-600"
				data-copy-default-label="Copy"
				type="button"
			>
				Copy
			</button>
		</div>
	);
}
