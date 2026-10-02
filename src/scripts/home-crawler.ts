import {
	advanceCrawlerLegs,
	CRAWLER_AGENTS,
	type CrawlerTheme,
	createCrawlerLegs,
	getCrawlerAgentPose,
	STEP_LOOKAHEAD_SECONDS,
} from '@/lib/home-crawler.ts';
import { createCrawlerRenderer } from '@/scripts/home-crawler-renderer.ts';

const FRAME_INTERVAL_MS = 1000 / 30;
const MAX_DELTA_SECONDS = 0.05;

export const initializeHomeCrawler = (): (() => void) => {
	const host = document.querySelector<HTMLElement>('[data-home-crawler]');
	const svg = host?.querySelector('svg');
	if (!(host && svg)) {
		return () => undefined;
	}

	const doc = host.ownerDocument;
	const view = doc.defaultView;
	if (!view) {
		return () => undefined;
	}

	const readTheme = (): CrawlerTheme =>
		doc.documentElement.classList.contains('dark') ? 'dark' : 'light';
	let theme = readTheme();
	let seconds = 0;
	let previousTime = 0;
	let frame: number | undefined;
	let visible = false;
	let suspended = false;
	const agents = CRAWLER_AGENTS.map((definition) => {
		const group = svg.querySelector<SVGGElement>(`[data-crawler-agent="${definition.id}"]`);
		if (!group) {
			throw new Error(`Missing maintenance robot: ${definition.id}`);
		}
		const pose = getCrawlerAgentPose(seconds, theme, definition);
		return {
			definition,
			draw: createCrawlerRenderer(group),
			group,
			legs: createCrawlerLegs(pose),
			pose,
		};
	});
	let paintOrder = '';

	const render = (delta: number): void => {
		for (const agent of agents) {
			agent.pose = getCrawlerAgentPose(seconds, theme, agent.definition);
			const nextPose = getCrawlerAgentPose(
				seconds + STEP_LOOKAHEAD_SECONDS,
				theme,
				agent.definition
			);
			advanceCrawlerLegs(agent.legs, agent.pose, nextPose, delta);
			agent.draw(agent.pose, agent.legs, theme);
		}
		// Farther robots paint first. Only reorder the DOM when robots pass one another.
		agents.sort((a, b) => b.pose.y - a.pose.y);
		const nextOrder = agents.map(({ definition }) => definition.id).join(',');
		if (nextOrder !== paintOrder) {
			for (const { group } of agents) {
				svg.append(group);
			}
			paintOrder = nextOrder;
		}
		host.dataset.ready = '';
	};

	const tick = (time: number): void => {
		frame = view.requestAnimationFrame(tick);
		if (previousTime && time - previousTime < FRAME_INTERVAL_MS) {
			return;
		}
		const delta = previousTime ? Math.min((time - previousTime) / 1000, MAX_DELTA_SECONDS) : 0;
		previousTime = time;
		seconds += delta;
		render(delta);
	};

	const stop = (): void => {
		if (frame !== undefined) {
			view.cancelAnimationFrame(frame);
			frame = undefined;
		}
		previousTime = 0;
	};

	const syncPlayback = (): void => {
		if (doc.hidden || !visible || suspended) {
			stop();
			return;
		}
		if (frame === undefined) {
			frame = view.requestAnimationFrame(tick);
		}
	};

	const themeObserver = new MutationObserver(() => {
		const nextTheme = readTheme();
		if (nextTheme === theme) {
			return;
		}
		theme = nextTheme;
		for (const agent of agents) {
			agent.legs = createCrawlerLegs(getCrawlerAgentPose(seconds, theme, agent.definition));
		}
		render(0);
	});
	const intersection = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		syncPlayback();
	});
	const onPageHide = (): void => {
		suspended = true;
		stop();
	};
	const onPageShow = (): void => {
		suspended = false;
		syncPlayback();
	};

	render(0);
	themeObserver.observe(doc.documentElement, { attributeFilter: ['class'] });
	intersection.observe(host);
	doc.addEventListener('visibilitychange', syncPlayback);
	view.addEventListener('pagehide', onPageHide);
	view.addEventListener('pageshow', onPageShow);

	return () => {
		stop();
		themeObserver.disconnect();
		intersection.disconnect();
		doc.removeEventListener('visibilitychange', syncPlayback);
		view.removeEventListener('pagehide', onPageHide);
		view.removeEventListener('pageshow', onPageShow);
		delete host.dataset.ready;
	};
};
