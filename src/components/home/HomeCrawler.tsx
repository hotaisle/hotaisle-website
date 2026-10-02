import { CRAWLER_AGENTS, CRAWLER_IMAGE, CRAWLER_LEGS } from '@/lib/home-crawler.ts';
import '@/styles/home-crawler.css';

export function HomeCrawler() {
	return (
		<div aria-hidden="true" className="home-crawler" data-home-crawler="">
			<svg
				fill="none"
				height={CRAWLER_IMAGE.height}
				preserveAspectRatio="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				viewBox={`0 0 ${CRAWLER_IMAGE.width} ${CRAWLER_IMAGE.height}`}
				width={CRAWLER_IMAGE.width}
			>
				{CRAWLER_AGENTS.map((agent) => (
					<g data-crawler-agent={agent.id} key={agent.id}>
						<path
							className="home-crawler-shadow"
							data-crawler-shadow=""
							stroke="none"
						/>
						<path className="home-crawler-beam" data-crawler-beam="" stroke="none" />
						<path className="home-crawler-scan" data-crawler-scan="" />
						{CRAWLER_LEGS.map(({ id }) => (
							<g key={id}>
								<polyline data-crawler-leg="" />
								<circle
									className="home-crawler-joint"
									data-crawler-joint=""
									stroke="none"
								/>
							</g>
						))}
						<path className="home-crawler-chassis" data-crawler-chassis="" />
						<path className="home-crawler-shell" data-crawler-body="" />
						<path className="home-crawler-vents" data-crawler-vents="" />
						<path className="home-crawler-core" data-crawler-sensor="" stroke="none" />
						<path className="home-crawler-probe" data-crawler-probe="" />
						<path className="home-crawler-contact" data-crawler-contact="" />
					</g>
				))}
			</svg>
		</div>
	);
}
