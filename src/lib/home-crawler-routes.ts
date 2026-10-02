// Positions and hardware ports are fractions of each original illustration.
// Keep each path alongside its equipment; ports anchor the diagnostic probe.
export const CRAWLER_SERVICE_ROUTES = {
	dark: [
		// Front compute chassis.
		[
			{ port: { x: 0.12, y: 0.49 }, position: { x: 0.085, y: 0.53 } },
			{ port: { x: 0.146, y: 0.54 }, position: { x: 0.1, y: 0.59 } },
		],
		// Compute cooling panels.
		[
			{ port: { x: 0.276, y: 0.525 }, position: { x: 0.31, y: 0.58 } },
			{ port: { x: 0.403, y: 0.457 }, position: { x: 0.405, y: 0.51 } },
		],
		// Console side connections.
		[
			{ port: { x: 0.274, y: 0.751 }, position: { x: 0.325, y: 0.755 } },
			{ port: { x: 0.285, y: 0.792 }, position: { x: 0.32, y: 0.82 } },
		],
		// Console controls.
		[
			{ port: { x: 0.1, y: 0.727 }, position: { x: 0.063, y: 0.696 } },
			{ port: { x: 0.13, y: 0.656 }, position: { x: 0.08, y: 0.64 } },
		],
		// Middle compute units.
		[
			{ port: { x: 0.48, y: 0.379 }, position: { x: 0.5, y: 0.405 } },
			{ port: { x: 0.563, y: 0.317 }, position: { x: 0.57, y: 0.356 } },
		],
		// Distant compute units.
		[
			{ port: { x: 0.632, y: 0.266 }, position: { x: 0.643, y: 0.303 } },
			{ port: { x: 0.684, y: 0.218 }, position: { x: 0.698, y: 0.253 } },
		],
		// Foreground interconnect.
		[
			{ port: { x: 0.47, y: 0.834 }, position: { x: 0.475, y: 0.874 } },
			{ port: { x: 0.548, y: 0.729 }, position: { x: 0.522, y: 0.795 } },
		],
		// Middle interconnect.
		[
			{ port: { x: 0.678, y: 0.567 }, position: { x: 0.678, y: 0.625 } },
			{ port: { x: 0.719, y: 0.48 }, position: { x: 0.739, y: 0.531 } },
		],
		// Outer service connections.
		[
			{ port: { x: 0.858, y: 0.535 }, position: { x: 0.89, y: 0.56 } },
			{ port: { x: 0.857, y: 0.375 }, position: { x: 0.875, y: 0.43 } },
		],
		// Distant interconnect.
		[
			{ port: { x: 0.783, y: 0.328 }, position: { x: 0.806, y: 0.358 } },
			{ port: { x: 0.809, y: 0.259 }, position: { x: 0.839, y: 0.264 } },
		],
	],
	light: [
		// Front compute chassis.
		[
			{ port: { x: 0.105, y: 0.46 }, position: { x: 0.1, y: 0.52 } },
			{ port: { x: 0.14, y: 0.425 }, position: { x: 0.16, y: 0.54 } },
		],
		// Compute cooling panels.
		[
			{ port: { x: 0.37, y: 0.475 }, position: { x: 0.37, y: 0.55 } },
			{ port: { x: 0.425, y: 0.423 }, position: { x: 0.43, y: 0.51 } },
		],
		// Console side connections.
		[
			{ port: { x: 0.33, y: 0.805 }, position: { x: 0.385, y: 0.815 } },
			{ port: { x: 0.3, y: 0.875 }, position: { x: 0.37, y: 0.895 } },
		],
		// Console controls.
		[
			{ port: { x: 0.116, y: 0.686 }, position: { x: 0.085, y: 0.745 } },
			{ port: { x: 0.136, y: 0.65 }, position: { x: 0.085, y: 0.64 } },
		],
		// Middle compute units.
		[
			{ port: { x: 0.505, y: 0.409 }, position: { x: 0.51, y: 0.44 } },
			{ port: { x: 0.555, y: 0.368 }, position: { x: 0.558, y: 0.406 } },
		],
		// Distant compute units.
		[
			{ port: { x: 0.615, y: 0.336 }, position: { x: 0.625, y: 0.367 } },
			{ port: { x: 0.658, y: 0.315 }, position: { x: 0.67, y: 0.342 } },
		],
		// Foreground interconnect.
		[
			{ port: { x: 0.681, y: 0.57 }, position: { x: 0.642, y: 0.6 } },
			{ port: { x: 0.67, y: 0.65 }, position: { x: 0.644, y: 0.663 } },
		],
		// Middle interconnect.
		[
			{ port: { x: 0.76, y: 0.57 }, position: { x: 0.807, y: 0.604 } },
			{ port: { x: 0.752, y: 0.51 }, position: { x: 0.8, y: 0.525 } },
		],
		// Outer service connections.
		[
			{ port: { x: 0.921, y: 0.424 }, position: { x: 0.92, y: 0.477 } },
			{ port: { x: 0.853, y: 0.439 }, position: { x: 0.86, y: 0.482 } },
		],
		// Distant interconnect.
		[
			{ port: { x: 0.731, y: 0.386 }, position: { x: 0.714, y: 0.419 } },
			{ port: { x: 0.721, y: 0.453 }, position: { x: 0.704, y: 0.462 } },
		],
	],
} as const;
