import MI355XContent from '@/app/mi355x/MI355XContent.tsx';
import { createPageMetadata } from '@/lib/metadata.ts';

export function generateMetadata() {
	return createPageMetadata({
		description:
			'Reserve AMD Instinct MI355X compute and review platform details for next-generation AI and HPC workloads.',
		image: '/assets/mi355x/mi355ximage.png',
		imageAlt: 'AMD MI355X',
		path: '/mi355x',
		title: 'AMD MI355X',
	});
}

export default function MI355XPage() {
	return <MI355XContent />;
}
