const COMMAND = 'ssh admin.hotaisle.app';

export function TerminalTyping() {
	return (
		<span className="ha-terminal-typing">
			<button
				aria-label={`Copy ${COMMAND} to clipboard`}
				aria-live="polite"
				className="cursor-pointer text-left hover:underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current"
				data-copy-command-button
				data-copy-command-text={COMMAND}
				data-copy-default-label={COMMAND}
				title="Copy SSH command"
				type="button"
			>
				{COMMAND}
			</button>
			<span aria-hidden="true" className="ha-terminal-typing__cursor">
				_
			</span>
		</span>
	);
}
