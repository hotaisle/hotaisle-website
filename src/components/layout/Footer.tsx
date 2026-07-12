import { AppLink } from '@/components/AppLink.tsx';
import { FOOTER_COLUMNS, FOOTER_META_LINKS, getFooterCopyright } from '@/lib/footer.ts';

export function Footer() {
	const footerCopyright = getFooterCopyright();

	return (
		<footer className="border-border border-t bg-card">
			<div className="mx-auto max-w-6xl px-5 lg:px-8">
				{/* Link columns grid */}
				<div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4">
					{FOOTER_COLUMNS.map((column) => (
						<div className="text-center" key={column.heading}>
							<h3 className="mb-4 font-mono text-foreground text-xs uppercase">
								{column.heading}
							</h3>
							<ul className="flex flex-col items-center gap-3">
								{column.links.map((link) => {
									const isExternal = link.href.startsWith('http');

									return (
										<li key={link.href}>
											<AppLink
												className="text-muted-foreground text-sm transition-colors hover:text-foreground"
												href={link.href}
												rel={isExternal ? 'noopener' : undefined}
												target={isExternal ? '_blank' : undefined}
											>
												{link.label}
											</AppLink>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>

				{/* Divider */}
				<div className="border-border border-t" />

				{/* Bottom row */}
				<div className="flex flex-col items-center gap-5 py-8 text-center">
					<AppLink aria-label="Home" className="shrink-0" href="/">
						<img
							alt="Hot Aisle"
							className="h-7 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
							height={28}
							src="/hotaisle-logo.svg"
							width={110}
						/>
					</AppLink>

					<p className="text-center text-muted-foreground text-xs">{footerCopyright}</p>

					<div className="flex items-center gap-4">
						{FOOTER_META_LINKS.map((link) => (
							<AppLink
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
								href={link.href}
								key={link.href}
								rel={link.href.startsWith('http') ? 'noopener' : undefined}
								target={link.href.startsWith('http') ? '_blank' : undefined}
							>
								{link.label}
							</AppLink>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
