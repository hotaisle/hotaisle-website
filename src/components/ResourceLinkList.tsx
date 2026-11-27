import { ArrowUpRight } from 'lucide-react';
import { AppLink } from '@/components/AppLink.tsx';

interface Resource {
	description: string;
	href: string;
	label: string;
	title: string;
}

const LINK_CLASS_NAME = 'group block py-6 text-foreground';

export function ResourceLinkList({ resources }: { resources: readonly Resource[] }) {
	return (
		<ul className="[&>li:first-child>a]:pt-0 [&>li:last-child>a]:pb-0">
			{resources.map((resource) => {
				const isExternal = resource.href.startsWith('http');
				const content = (
					<>
						<span className="flex items-start justify-between gap-6">
							<span className="group-hover:text-hot-orange-contrast text-2xl font-bold transition-colors">
								{resource.title}
							</span>
							<ArrowUpRight
								aria-hidden="true"
								className="text-hot-orange-contrast mt-1 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
								size={24}
							/>
						</span>
						<span className="text-muted-foreground mt-2 block max-w-lg text-base leading-relaxed">
							{resource.description}
						</span>
						<span className="text-hot-orange-contrast mt-4 block text-sm font-medium">
							{resource.label}
						</span>
					</>
				);

				return (
					<li className="border-border border-b last:border-b-0" key={resource.href}>
						{isExternal ? (
							<a
								className={LINK_CLASS_NAME}
								href={resource.href}
								rel="noopener"
								target="_blank"
							>
								{content}
							</a>
						) : (
							<AppLink className={LINK_CLASS_NAME} href={resource.href}>
								{content}
							</AppLink>
						)}
					</li>
				);
			})}
		</ul>
	);
}
