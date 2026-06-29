import type * as React from 'react';
import { toCanonicalDocumentHref } from '@/lib/canonical-href.ts';

interface AppLinkProps extends Omit<React.ComponentProps<'a'>, 'href'> {
	children: React.ReactNode;
	href: string;
}

export function AppLink({ children, href, ...props }: AppLinkProps) {
	const canonicalHref = toCanonicalDocumentHref(href);

	return (
		<a data-prefetch-link="true" href={canonicalHref} {...props}>
			{children}
		</a>
	);
}
