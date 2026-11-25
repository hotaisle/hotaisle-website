import MI355XContent from '@/components/pages/MI355XContent.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Plan AMD Instinct MI355X capacity for high-memory, isolated production inference deployments.',
		path: '/mi355x',
		title: 'AMD MI355X',
	});
}

export default function MI355XPage() {
	return <MI355XContent />;
}
