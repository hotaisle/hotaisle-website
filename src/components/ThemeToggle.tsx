import { Moon, Sun } from 'lucide-react';

const THEME_TOGGLE_CLASS_NAME =
	'ha-theme-toggle inline-flex min-h-10 min-w-10 items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
const THEME_TOGGLE_ICON_CLASS_NAME = 'ha-theme-toggle__icon h-[1.125rem] w-[1.125rem]';

type ThemeToggleProps = {
	className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
	const resolvedClassName = className
		? `${THEME_TOGGLE_CLASS_NAME} ${className}`
		: THEME_TOGGLE_CLASS_NAME;

	return (
		<button
			aria-label="Switch to dark mode"
			className={resolvedClassName}
			data-theme-toggle
			title="Switch to dark mode"
			type="button"
		>
			<Moon
				aria-hidden="true"
				className={THEME_TOGGLE_ICON_CLASS_NAME}
				data-theme-icon="dark"
				strokeWidth={2}
			/>
			<Sun
				aria-hidden="true"
				className={THEME_TOGGLE_ICON_CLASS_NAME}
				data-theme-icon="light"
				strokeWidth={2}
			/>
		</button>
	);
}
