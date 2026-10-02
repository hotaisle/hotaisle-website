import { describe, expect, it } from 'bun:test';
import {
	advanceCrawlerLegs,
	CRAWLER_AGENTS,
	CRAWLER_IMAGE,
	CRAWLER_LEGS,
	type CrawlerTheme,
	createCrawlerLegs,
	getCrawlerAgentPose,
	getCrawlerProbe,
	getKnee,
	projectCrawlerPoint,
	STEP_LOOKAHEAD_SECONDS,
	toWorldPoint,
	type WorldPoint,
} from '@/lib/home-crawler.ts';

const THEMES: readonly CrawlerTheme[] = ['light', 'dark'];
const distance = (a: WorldPoint, b: WorldPoint): number =>
	Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

describe('homepage maintenance robot', () => {
	it('keeps eight short legs planted during small chassis movements', () => {
		for (const theme of THEMES) {
			const pose = getCrawlerAgentPose(0, theme, CRAWLER_AGENTS[0]);
			const legs = createCrawlerLegs(pose);
			const feet = legs.map(({ foot }) => ({ ...foot }));
			expect(legs).toHaveLength(8);
			advanceCrawlerLegs(legs, { ...pose, y: pose.y + 2 }, pose, 1 / 30);
			for (const [index, leg] of legs.entries()) {
				expect(distance(leg.foot, feet[index])).toBeCloseTo(0, 8);
			}
		}
	});

	it('faces the hardware, holds its probe on the port, then retracts before walking', () => {
		for (const theme of THEMES) {
			for (const definition of CRAWLER_AGENTS) {
				const agent = { ...definition, phase: 0 };
				let elapsed = 0;
				for (const stop of agent.routes[theme].stops) {
					const inspecting = getCrawlerAgentPose(
						elapsed + stop.arrivalSeconds + 2,
						theme,
						agent
					);
					const later = getCrawlerAgentPose(
						elapsed + stop.arrivalSeconds + 3,
						theme,
						agent
					);
					expect(inspecting.x).toBe(stop.station.x);
					expect(inspecting.y).toBe(stop.station.y);
					expect(inspecting.inspection).toBe(1);
					const forward = toWorldPoint({ x: 0, y: 1, z: 0 }, inspecting);
					const heading = Math.atan2(forward.y - inspecting.y, forward.x - inspecting.x);
					const targetHeading = Math.atan2(
						stop.target.y - inspecting.y,
						stop.target.x - inspecting.x
					);
					expect(Math.cos(heading - targetHeading)).toBeCloseTo(1);
					const probe = getCrawlerProbe(inspecting);
					expect(distance(probe[2], stop.target)).toBeCloseTo(0);
					expect(distance(getCrawlerProbe(later)[2], stop.target)).toBeCloseTo(0);
					const departing = getCrawlerAgentPose(
						elapsed + stop.stopSeconds + 0.5,
						theme,
						agent
					);
					expect(
						Math.hypot(departing.x - inspecting.x, departing.y - inspecting.y)
					).toBeGreaterThan(0);
					expect(departing.inspection).toBe(0);
					expect(departing.maintenance).toBeUndefined();
					expect(
						distance(getCrawlerProbe(departing)[0], getCrawlerProbe(departing)[2])
					).toBeLessThan(4);
					elapsed += stop.stopSeconds + stop.travelSeconds;
				}
			}
		}
	});

	it('anchors the first probe to the visible chassis panel in each illustration', () => {
		const cases = [
			{ theme: 'light', x: 0.105, y: 0.46 },
			{ theme: 'dark', x: 0.12, y: 0.49 },
		] as const;
		for (const { theme, x, y } of cases) {
			const { target } = CRAWLER_AGENTS[0].routes[theme].stops[0];
			const projected = projectCrawlerPoint(target, theme);
			expect(projected.x / CRAWLER_IMAGE.width).toBeCloseTo(x);
			expect(projected.y / CRAWLER_IMAGE.height).toBeCloseTo(y);
		}
	});

	it('projects onto the separately calibrated light and dark floor planes', () => {
		const cases = [
			{ expectedX: 0.775, expectedY: 0.92, theme: 'light' },
			{ expectedX: 0.785, expectedY: 0.92, theme: 'dark' },
		] as const;
		for (const { theme, expectedX, expectedY } of cases) {
			const origin = projectCrawlerPoint({ x: 0, y: 0, z: 0 }, theme);
			expect(origin.x / CRAWLER_IMAGE.width).toBeCloseTo(expectedX);
			expect(origin.y / CRAWLER_IMAGE.height).toBeCloseTo(expectedY);
			const near = projectCrawlerPoint({ x: 0, y: 40, z: 0 }, theme);
			const far = projectCrawlerPoint({ x: 0, y: 330, z: 0 }, theme);
			const nearWidth = projectCrawlerPoint({ x: 10, y: 40, z: 0 }, theme).x - near.x;
			const farWidth = projectCrawlerPoint({ x: 10, y: 330, z: 0 }, theme).x - far.x;
			expect(far.y).toBeLessThan(near.y);
			expect(farWidth / nearWidth).toBeGreaterThan(0.5);
			expect(farWidth / nearWidth).toBeLessThan(0.7);
			const elevated = projectCrawlerPoint({ x: 0, y: 40, z: 6 }, theme);
			expect(elevated.y).toBeLessThan(near.y);
			expect(elevated.x).toBe(near.x);
		}
	});

	it('walks slowly without teleporting at route, inspection, or loop boundaries', () => {
		const delta = 1 / 30;
		for (const theme of THEMES) {
			for (const agent of CRAWLER_AGENTS) {
				let peakSpeed = 0;
				for (
					let seconds = 0;
					seconds < agent.routes[theme].durationSeconds + 1;
					seconds += delta
				) {
					const pose = getCrawlerAgentPose(seconds, theme, agent);
					const next = getCrawlerAgentPose(seconds + delta, theme, agent);
					const speed = Math.hypot(next.x - pose.x, next.y - pose.y) / delta;
					peakSpeed = Math.max(peakSpeed, speed);
					expect(speed).toBeLessThanOrEqual(5.501);
					const turn = Math.atan2(
						Math.sin(next.angle - pose.angle),
						Math.cos(next.angle - pose.angle)
					);
					expect(Math.abs(turn) / delta).toBeLessThan(0.8);
				}
				expect(peakSpeed).toBeCloseTo(5.5, 3);
			}
		}
	});

	it('spreads ten independently phased robots inside both images throughout the patrol', () => {
		expect(CRAWLER_AGENTS).toHaveLength(10);
		expect(new Set(CRAWLER_AGENTS.map(({ id }) => id)).size).toBe(10);
		expect(new Set(CRAWLER_AGENTS.map(({ phase }) => phase)).size).toBe(10);
		for (const theme of THEMES) {
			const longestRoute = Math.max(
				...CRAWLER_AGENTS.map((agent) => agent.routes[theme].durationSeconds)
			);
			for (let seconds = 0; seconds < longestRoute; seconds += 0.5) {
				const positions = new Set<string>();
				const centers: WorldPoint[] = [];
				for (const agent of CRAWLER_AGENTS) {
					const pose = getCrawlerAgentPose(seconds, theme, agent);
					centers.push({ ...projectCrawlerPoint({ ...pose, z: 0 }, theme), z: 0 });
					positions.add(`${pose.x.toFixed(2)},${pose.y.toFixed(2)}`);
					for (const { rest } of CRAWLER_LEGS) {
						const projected = projectCrawlerPoint(toWorldPoint(rest, pose), theme);
						expect(projected.x).toBeGreaterThan(0);
						expect(projected.x).toBeLessThan(CRAWLER_IMAGE.width);
						expect(projected.y).toBeGreaterThan(0);
						expect(projected.y).toBeLessThan(CRAWLER_IMAGE.height);
					}
				}
				expect(positions.size).toBe(10);
				const xs = centers.map(({ x }) => x);
				const ys = centers.map(({ y }) => y);
				expect((Math.max(...xs) - Math.min(...xs)) / CRAWLER_IMAGE.width).toBeGreaterThan(
					0.75
				);
				expect((Math.max(...ys) - Math.min(...ys)) / CRAWLER_IMAGE.height).toBeGreaterThan(
					0.43
				);
			}
		}
	});

	it('keeps rigid legs within reach and every robot inside its artwork throughout its patrol', () => {
		const delta = 1 / 30;
		for (const theme of THEMES) {
			for (const agent of CRAWLER_AGENTS) {
				const legs = createCrawlerLegs(getCrawlerAgentPose(0, theme, agent));
				for (
					let seconds = 0;
					seconds < agent.routes[theme].durationSeconds + 1;
					seconds += delta
				) {
					const pose = getCrawlerAgentPose(seconds, theme, agent);
					const next = getCrawlerAgentPose(
						seconds + STEP_LOOKAHEAD_SECONDS,
						theme,
						agent
					);
					advanceCrawlerLegs(legs, pose, next, delta);
					for (const [index, config] of CRAWLER_LEGS.entries()) {
						const hip = toWorldPoint(config.hip, pose);
						const { foot } = legs[index];
						const knee = getKnee(hip, foot, config.side);
						expect(distance(knee, hip)).toBeCloseTo(10, 5);
						expect(distance(knee, foot)).toBeCloseTo(12, 5);
						const projected = projectCrawlerPoint(foot, theme);
						expect(projected.x).toBeGreaterThan(0);
						expect(projected.x).toBeLessThan(CRAWLER_IMAGE.width);
						expect(projected.y).toBeGreaterThan(0);
						expect(projected.y).toBeLessThan(CRAWLER_IMAGE.height);
					}
				}
			}
		}
	});
});
