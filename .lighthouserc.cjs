const LIGHTHOUSE_NUMBER_OF_RUNS = 2;
const LIGHTHOUSE_PAGE_PATHS = ['/', '/pricing/', '/quick-start/', '/mi300x/'];
const LIGHTHOUSE_BASE_URL = 'http://localhost';
const LIGHTHOUSE_OUTPUT_DIRECTORY = './dist-static/lighthouse';

const createMedianAssertion = (level, options) => [
	level,
	{
		aggregationMethod: 'median',
		...options,
	},
];
// CI decides whether Lighthouse assertion failures are blocking.
const coreMetricAssertionLevel = 'error';
const collect = {
	numberOfRuns: LIGHTHOUSE_NUMBER_OF_RUNS,
	url: LIGHTHOUSE_PAGE_PATHS.map((pagePath) => new URL(pagePath, LIGHTHOUSE_BASE_URL).toString()),
	staticDistDir: './dist-static',
	settings: {
		preset: 'desktop',
		chromeFlags: '--no-sandbox',
	},
};

module.exports = {
	ci: {
		collect,
		assert: {
			includePassedAssertions: true,
			preset: 'lighthouse:recommended',
			assertions: {
				'categories:accessibility': [
					coreMetricAssertionLevel,
					{
						minScore: 0.9,
					},
				],
				'categories:best-practices': [
					coreMetricAssertionLevel,
					{
						minScore: 0.9,
					},
				],
				'categories:seo': [
					coreMetricAssertionLevel,
					{
						minScore: 0.9,
					},
				],
				// Keep performance warning-only until we decide to promote the threshold.
				'categories:performance': createMedianAssertion('warn', {
					minScore: 0.7,
				}),
				// These phase-1 warnings seed concrete metrics now so we can promote stable thresholds later.
				'largest-contentful-paint': createMedianAssertion(coreMetricAssertionLevel, {
					maxNumericValue: 2500,
				}),
				'image-delivery-insight': 'warn',
				'cumulative-layout-shift': createMedianAssertion(coreMetricAssertionLevel, {
					maxNumericValue: 0.1,
				}),
				'total-blocking-time': createMedianAssertion(coreMetricAssertionLevel, {
					maxNumericValue: 200,
				}),
				'uses-responsive-images': 'warn',
				'lcp-discovery-insight': 'warn',
				'network-dependency-tree-insight': 'warn',
				'color-contrast': 'warn',
				'render-blocking-insight': 'warn',
				'render-blocking-resources': 'warn',
			},
		},
		upload: {
			target: 'filesystem',
			outputDir: LIGHTHOUSE_OUTPUT_DIRECTORY,
		},
	},
};
