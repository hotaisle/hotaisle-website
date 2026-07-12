const COMMAND = 'ssh admin.hotaisle.app';

export function TerminalTyping() {
	return (
		<span aria-hidden="true" className="ha-terminal-typing">
			<span className="ha-terminal-typing__command">{COMMAND}</span>
			<span className="ha-terminal-typing__cursor">_</span>
		</span>
	);
}
