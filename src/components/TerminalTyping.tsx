'use client';

import { useEffect, useRef } from 'react';

const COMMAND = 'ssh admin.hotaisle.app';
const INITIAL_DELAY_MS = 100;
const TYPING_DELAY_MS = 200;

export function TerminalTyping() {
	const commandRef = useRef<HTMLSpanElement>(null);
	const cursorRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const commandElement = commandRef.current;
		const cursorElement = cursorRef.current;
		if (!(commandElement && cursorElement)) {
			return;
		}

		let characterIndex = 0;
		let typingTimeoutId: number | undefined;
		cursorElement.hidden = true;
		cursorElement.classList.remove('is-flashing');
		commandElement.textContent = '';

		const typeNextCharacter = (): void => {
			commandElement.textContent = COMMAND.slice(0, characterIndex);
			characterIndex += 1;

			if (characterIndex <= COMMAND.length) {
				typingTimeoutId = window.setTimeout(typeNextCharacter, TYPING_DELAY_MS);
				return;
			}

			cursorElement.hidden = false;
			cursorElement.classList.add('is-flashing');
		};

		const initialTimeoutId = window.setTimeout(typeNextCharacter, INITIAL_DELAY_MS);

		return () => {
			window.clearTimeout(initialTimeoutId);
			if (typingTimeoutId) {
				window.clearTimeout(typingTimeoutId);
			}
		};
	}, []);

	return (
		<>
			<span ref={commandRef} />
			<span className="ha-terminal-cursor" hidden ref={cursorRef}>
				_
			</span>
		</>
	);
}
