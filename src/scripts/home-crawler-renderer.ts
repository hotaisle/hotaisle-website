import {
	CRAWLER_LEGS,
	type CrawlerLeg,
	type CrawlerPose,
	type CrawlerTheme,
	getCrawlerProbe,
	getKnee,
	projectCrawlerPoint,
	toWorldPoint,
	type WorldPoint,
} from '@/lib/home-crawler.ts';

const CHASSIS_OUTLINE = [
	{ x: -5, y: -7 },
	{ x: -3, y: -9 },
	{ x: 3, y: -9 },
	{ x: 5, y: -7 },
	{ x: 5, y: 7 },
	{ x: 3, y: 9 },
	{ x: -3, y: 9 },
	{ x: -5, y: 7 },
];
const CHASSIS_BASE = CHASSIS_OUTLINE.map((point) => ({ ...point, z: 2.5 }));
const CHASSIS_TOP = CHASSIS_OUTLINE.map((point) => ({ ...point, z: 6 }));
const SENSOR = [
	{ x: -2.5, y: 4.5, z: 6.1 },
	{ x: 2.5, y: 4.5, z: 6.1 },
	{ x: 2.5, y: 6, z: 6.1 },
	{ x: -2.5, y: 6, z: 6.1 },
];
const VENTS = [-4, -1, 2].map((y) => [
	{ x: -2.5, y, z: 6.1 },
	{ x: 2.5, y, z: 6.1 },
]);
const SHADOW = Array.from({ length: 16 }, (_, index) => {
	const angle = (index / 16) * Math.PI * 2;
	return { x: Math.cos(angle) * 14, y: Math.sin(angle) * 17, z: 0 };
});
const coordinates = (points: readonly WorldPoint[], theme: CrawlerTheme): string =>
	points
		.map((point) => {
			const projected = projectCrawlerPoint(point, theme);
			return `${projected.x.toFixed(2)},${projected.y.toFixed(2)}`;
		})
		.join(' ');

export const createCrawlerRenderer = (group: SVGGElement) => {
	const paths = [...group.querySelectorAll<SVGPolylineElement>('[data-crawler-leg]')];
	const joints = [...group.querySelectorAll<SVGCircleElement>('[data-crawler-joint]')];
	const findPath = (name: string): SVGPathElement => {
		const path = group.querySelector<SVGPathElement>(`[data-crawler-${name}]`);
		if (!path) {
			throw new Error(`Missing maintenance robot shape: ${name}`);
		}
		return path;
	};
	const shadow = findPath('shadow');
	const chassis = findPath('chassis');
	const body = findPath('body');
	const sensor = findPath('sensor');
	const vents = findPath('vents');
	const beam = findPath('beam');
	const scan = findPath('scan');
	const probe = findPath('probe');
	const contact = findPath('contact');

	return (pose: CrawlerPose, legs: CrawlerLeg[], theme: CrawlerTheme): void => {
		const origin = projectCrawlerPoint({ ...pose, z: 0 }, theme);
		const unit = projectCrawlerPoint({ x: pose.x + 1, y: pose.y, z: 0 }, theme).x - origin.x;
		const worldPoints = (points: WorldPoint[]): WorldPoint[] =>
			points.map((point) => toWorldPoint(point, pose));
		const localPath = (points: WorldPoint[]): string =>
			`M ${coordinates(worldPoints(points), theme)}`;
		for (const [index, config] of CRAWLER_LEGS.entries()) {
			const hip = toWorldPoint(config.hip, pose);
			const { foot } = legs[index];
			const knee = getKnee(hip, foot, config.side);
			paths[index]?.setAttribute('points', coordinates([hip, knee, foot], theme));
			const joint = projectCrawlerPoint(knee, theme);
			joints[index]?.setAttribute('cx', joint.x.toFixed(2));
			joints[index]?.setAttribute('cy', joint.y.toFixed(2));
			joints[index]?.setAttribute('r', (unit * 0.65).toFixed(2));
		}
		group.setAttribute('stroke-width', (unit * 0.65).toFixed(2));
		shadow.setAttribute('d', `${localPath(SHADOW)} Z`);
		chassis.setAttribute('d', `${localPath(CHASSIS_BASE)} Z`);
		body.setAttribute('d', `${localPath(CHASSIS_TOP)} Z`);
		sensor.setAttribute('d', `${localPath(SENSOR)} Z`);
		sensor.setAttribute('opacity', (0.65 + pose.inspection * 0.35).toFixed(2));
		vents.setAttribute('d', VENTS.map(localPath).join(' '));
		const probePoints = getCrawlerProbe(pose);
		probe.setAttribute('d', `M ${coordinates(probePoints, theme)}`);
		beam.setAttribute('opacity', (pose.inspection * 0.045).toFixed(3));
		scan.setAttribute('opacity', (pose.inspection * 0.3).toFixed(3));
		contact.setAttribute('opacity', '0');
		if (pose.maintenance) {
			const { target, progress } = pose.maintenance;
			beam.setAttribute(
				'd',
				`M ${coordinates([probePoints[0], { ...target, x: target.x - 4 }, { ...target, x: target.x + 4 }], theme)} Z`
			);
			// A small scan stays attached to the panel instead of sweeping the empty floor.
			const scanHeight = target.z + Math.sin(progress * Math.PI * 4) * 3;
			scan.setAttribute(
				'd',
				`M ${coordinates(
					[
						{ ...target, x: target.x - 4, z: scanHeight },
						{ ...target, x: target.x + 4, z: scanHeight },
					],
					theme
				)}`
			);
			const port = projectCrawlerPoint(target, theme);
			const radius = unit * 1.2;
			contact.setAttribute(
				'd',
				`M ${port.x - radius},${port.y} a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 ${-radius * 2},0`
			);
			if (pose.inspection === 1) {
				const pulse = 0.35 + 0.35 * Math.sin(progress * Math.PI * 6) ** 2;
				contact.setAttribute('opacity', pulse.toFixed(3));
			}
		}
	};
};
