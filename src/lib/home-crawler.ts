import { CRAWLER_SERVICE_ROUTES } from '@/lib/home-crawler-routes.ts';

const WALK_SPEED = 5.5;
const GOLDEN_PHASE_STEP = 0.618_033_988_75;
const TURN_SPEED = 0.75;
const INSPECTION_SECONDS = 4.5;
const PORT_HEIGHT = 18;
const FLOOR_WIDTH = 460;
const FLOOR_SLOPE = 0.16;
const UPPER_LEG_LENGTH = 10;
const LOWER_LEG_LENGTH = 12;
const STEP_DISTANCE = 6;
const STEP_DURATION_SECONDS = 0.65;
const BODY_HEIGHT = 5;
const STEP_LIFT = 2;
const REACH_EPSILON = 0.001;

export const CRAWLER_IMAGE = { height: 992, width: 1586 } as const;
export const STEP_LOOKAHEAD_SECONDS = 0.5;
export type CrawlerTheme = 'light' | 'dark';

export interface Point {
	x: number;
	y: number;
}

export interface WorldPoint extends Point {
	z: number;
}

export interface CrawlerPose extends Point {
	angle: number;
	inspection: number;
	maintenance?: { progress: number; target: WorldPoint };
}

export interface CrawlerLeg {
	foot: WorldPoint;
	from: WorldPoint;
	progress: number;
	target: WorldPoint;
}

export interface CrawlerAgent {
	id: string;
	phase: number;
	routes: Readonly<Record<CrawlerTheme, CrawlerRoute>>;
}

interface CrawlerRoute {
	durationSeconds: number;
	stops: readonly {
		arrivalAngle: number;
		arrivalSeconds: number;
		departureAngle: number;
		departureSeconds: number;
		inspectionAngle: number;
		next: Point;
		station: Point;
		target: WorldPoint;
		stopSeconds: number;
		travelSeconds: number;
	}[];
}

// Each illustration has its own camera and equipment positions. Coordinates are
// fractions of the original 1586 × 992 artwork, independent of viewport size.
const SCENES = {
	dark: {
		cameraDepth: 300,
		origin: { x: 0.785, y: 0.92 },
		vanishing: { x: 0.865, y: 0.08 },
	},
	light: {
		cameraDepth: 450,
		origin: { x: 0.775, y: 0.92 },
		vanishing: { x: 0.779, y: 0.27 },
	},
} as const;

const headingBetween = (from: Point, to: Point): number => Math.atan2(from.x - to.x, to.y - from.y);
const ease = (value: number): number => value ** 2 * (3 - 2 * value);
const turn = (from: number, to: number, progress: number): number =>
	from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * ease(progress);

const imagePointToWorld = (point: Point, theme: CrawlerTheme, z = 0): WorldPoint => {
	const { cameraDepth, origin, vanishing } = SCENES[theme];
	const x = point.x - vanishing.x;
	const y = point.y - vanishing.y;
	const depthScale =
		(y - FLOOR_SLOPE * x) /
		(origin.y - vanishing.y - FLOOR_SLOPE * (origin.x - vanishing.x) - z / FLOOR_WIDTH);
	return {
		x: FLOOR_WIDTH * (x / depthScale - origin.x + vanishing.x),
		y: cameraDepth * (1 / depthScale - 1),
		z,
	};
};

const turnDuration = (from: number, to: number): number =>
	(Math.abs(Math.atan2(Math.sin(to - from), Math.cos(to - from))) * 1.5) / TURN_SPEED;

const createRoute = (
	serviceStops: readonly { position: Point; port: Point }[],
	theme: CrawlerTheme
): CrawlerRoute => {
	const stations = serviceStops.map(({ position, port }) => ({
		station: imagePointToWorld(position, theme),
		target: imagePointToWorld(port, theme, PORT_HEIGHT),
	}));
	const stops = stations.map(({ station, target }, index) => {
		const { station: next } = stations[(index + 1) % stations.length];
		const { station: previous } = stations[(index + stations.length - 1) % stations.length];
		const arrivalAngle = headingBetween(previous, station);
		const departureAngle = headingBetween(station, next);
		const inspectionAngle = headingBetween(station, target);
		const arrivalSeconds = turnDuration(arrivalAngle, inspectionAngle);
		const departureSeconds = turnDuration(inspectionAngle, departureAngle);
		return {
			arrivalAngle,
			arrivalSeconds,
			departureAngle,
			departureSeconds,
			inspectionAngle,
			next,
			station,
			stopSeconds: arrivalSeconds + INSPECTION_SECONDS + departureSeconds,
			target,
			// Smooth acceleration has a peak derivative of 1.5.
			travelSeconds: (Math.hypot(next.x - station.x, next.y - station.y) * 1.5) / WALK_SPEED,
		};
	});
	return {
		durationSeconds: stops.reduce(
			(total, stop) => total + stop.stopSeconds + stop.travelSeconds,
			0
		),
		stops,
	};
};

// Distinct routes and cycle lengths prevent the fleet from gathering in one aisle
// or falling into synchronized inspections and direction changes.
export const CRAWLER_AGENTS: readonly CrawlerAgent[] = CRAWLER_SERVICE_ROUTES.light.map(
	(stops, index) => ({
		id: `maintenance-${index + 1}`,
		phase: (0.25 + index * GOLDEN_PHASE_STEP) % 1,
		routes: {
			dark: createRoute(CRAWLER_SERVICE_ROUTES.dark[index], 'dark'),
			light: createRoute(stops, 'light'),
		},
	})
);

export const CRAWLER_LEGS = [-1, 1].flatMap((side) =>
	[-12, -4, 4, 12].map((reach, index) => ({
		hip: { x: side * 4, y: (index - 1.5) * 4, z: BODY_HEIGHT },
		id: `${side}-${index}`,
		rest: { x: side * (Math.abs(reach) > 10 ? 12 : 16), y: reach, z: 0 },
		side,
	}))
);

export const getCrawlerAgentPose = (
	seconds: number,
	theme: CrawlerTheme,
	agent: CrawlerAgent
): CrawlerPose => {
	const { durationSeconds, stops } = agent.routes[theme];
	let remaining = (seconds + agent.phase * durationSeconds) % durationSeconds;
	for (const {
		station,
		next,
		arrivalAngle,
		arrivalSeconds,
		departureAngle,
		departureSeconds,
		inspectionAngle,
		stopSeconds,
		target,
		travelSeconds,
	} of stops) {
		const duration = stopSeconds + travelSeconds;
		if (remaining >= duration) {
			remaining -= duration;
			continue;
		}
		if (remaining < arrivalSeconds) {
			return {
				...station,
				angle: turn(arrivalAngle, inspectionAngle, remaining / arrivalSeconds),
				inspection: 0,
			};
		}
		if (remaining < arrivalSeconds + INSPECTION_SECONDS) {
			const progress = (remaining - arrivalSeconds) / INSPECTION_SECONDS;
			return {
				...station,
				angle: inspectionAngle,
				inspection: ease(Math.min(1, progress / 0.2, (1 - progress) / 0.2)),
				maintenance: { progress, target },
			};
		}
		if (remaining < stopSeconds) {
			return {
				...station,
				angle: turn(
					inspectionAngle,
					departureAngle,
					(remaining - arrivalSeconds - INSPECTION_SECONDS) / departureSeconds
				),
				inspection: 0,
			};
		}
		const progress = ease((remaining - stopSeconds) / travelSeconds);
		return {
			angle: departureAngle,
			inspection: 0,
			x: station.x + (next.x - station.x) * progress,
			y: station.y + (next.y - station.y) * progress,
		};
	}
	return { ...stops[0].station, angle: stops[0].arrivalAngle, inspection: 0 };
};

// The telescoping probe reaches an authored hardware port and retracts before
// walking. Its contact point remains fixed while the diagnostic light pulses.
export const getCrawlerProbe = (pose: CrawlerPose): readonly WorldPoint[] => {
	const mount = toWorldPoint({ x: 0, y: 7, z: 6 }, pose);
	const folded = toWorldPoint({ x: 0, y: 10, z: 8 }, pose);
	const target = pose.maintenance?.target ?? folded;
	const extension = pose.inspection;
	const tip = {
		x: folded.x + (target.x - folded.x) * extension,
		y: folded.y + (target.y - folded.y) * extension,
		z: folded.z + (target.z - folded.z) * extension,
	};
	const elbow = {
		x: (mount.x + tip.x) / 2,
		y: (mount.y + tip.y) / 2,
		z: Math.max(mount.z, tip.z) + 4 * extension,
	};
	return [mount, elbow, tip];
};

// Project every foot, joint, chassis corner, and light onto the same camera.
// Elevated parts rise above the floor; all dimensions shrink toward the vanishing point.
export const projectCrawlerPoint = (point: WorldPoint, theme: CrawlerTheme): Point => {
	const { cameraDepth, origin, vanishing } = SCENES[theme];
	const depthScale = cameraDepth / (cameraDepth + point.y);
	return {
		x:
			(vanishing.x + (origin.x - vanishing.x + point.x / FLOOR_WIDTH) * depthScale) *
			CRAWLER_IMAGE.width,
		y:
			(vanishing.y +
				(origin.y - vanishing.y + (point.x * FLOOR_SLOPE - point.z) / FLOOR_WIDTH) *
					depthScale) *
			CRAWLER_IMAGE.height,
	};
};

export const toWorldPoint = (point: WorldPoint, pose: CrawlerPose): WorldPoint => ({
	x: pose.x + point.x * Math.cos(pose.angle) - point.y * Math.sin(pose.angle),
	y: pose.y + point.x * Math.sin(pose.angle) + point.y * Math.cos(pose.angle),
	z: point.z,
});

export const createCrawlerLegs = (pose: CrawlerPose): CrawlerLeg[] =>
	CRAWLER_LEGS.map(({ rest }) => {
		const foot = toWorldPoint(rest, pose);
		return { foot, from: foot, progress: 1, target: foot };
	});

export const advanceCrawlerLegs = (
	legs: CrawlerLeg[],
	pose: CrawlerPose,
	nextPose: CrawlerPose,
	delta: number
): void => {
	for (const [index, config] of CRAWLER_LEGS.entries()) {
		const leg = legs[index];
		const rest = toWorldPoint(config.rest, pose);
		const distance = Math.hypot(rest.x - leg.foot.x, rest.y - leg.foot.y);
		const neighborIsStepping = CRAWLER_LEGS.some(
			(neighbor, neighborIndex) =>
				neighbor.side === config.side &&
				Math.abs(neighborIndex - index) === 1 &&
				legs[neighborIndex].progress < 1
		);
		if (distance > STEP_DISTANCE && leg.progress === 1 && !neighborIsStepping) {
			leg.from = leg.foot;
			leg.target = toWorldPoint(config.rest, nextPose);
			leg.progress = 0;
		}
		leg.progress = Math.min(1, leg.progress + delta / STEP_DURATION_SECONDS);
		const eased = ease(leg.progress);
		leg.foot = {
			x: leg.from.x + (leg.target.x - leg.from.x) * eased,
			y: leg.from.y + (leg.target.y - leg.from.y) * eased,
			z: Math.sin(leg.progress * Math.PI) * STEP_LIFT,
		};
	}
};

// A three-dimensional two-bone solve keeps the short rigid legs grounded while turning.
export const getKnee = (hip: WorldPoint, foot: WorldPoint, side: number): WorldPoint => {
	const dx = foot.x - hip.x;
	const dy = foot.y - hip.y;
	const dz = foot.z - hip.z;
	const distance = Math.max(REACH_EPSILON, Math.hypot(dx, dy, dz));
	const reach = Math.max(
		LOWER_LEG_LENGTH - UPPER_LEG_LENGTH + REACH_EPSILON,
		Math.min(UPPER_LEG_LENGTH + LOWER_LEG_LENGTH - REACH_EPSILON, distance)
	);
	const along = (UPPER_LEG_LENGTH ** 2 - LOWER_LEG_LENGTH ** 2 + reach ** 2) / (2 * reach);
	const bend = Math.sqrt(Math.max(0, UPPER_LEG_LENGTH ** 2 - along ** 2));
	const pole = { x: (-dy * side) / distance, y: (dx * side) / distance, z: 0.45 };
	const dot = (pole.x * dx + pole.y * dy + pole.z * dz) / distance;
	const perpendicular = {
		x: pole.x - (dot * dx) / distance,
		y: pole.y - (dot * dy) / distance,
		z: pole.z - (dot * dz) / distance,
	};
	const magnitude = Math.max(
		REACH_EPSILON,
		Math.hypot(perpendicular.x, perpendicular.y, perpendicular.z)
	);
	return {
		x: hip.x + (dx * along) / distance + (perpendicular.x * bend) / magnitude,
		y: hip.y + (dy * along) / distance + (perpendicular.y * bend) / magnitude,
		z: hip.z + (dz * along) / distance + (perpendicular.z * bend) / magnitude,
	};
};
