import type * as React from 'react';

interface AppLinkProps extends Omit<React.ComponentProps<'a'>, 'href'> {
	children: React.ReactNode;
	href: string;
}

export function AppLink({ children, href, ...props }: AppLinkProps) {
	return (
		<a data-prefetch-link="true" href={href} {...props}>
			{children}
		</a>
	);
}
