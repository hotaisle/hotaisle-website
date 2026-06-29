export function initializeWebMcpScript(): void {
	const internalPagePaths = {
		about: '/about/',
		apiDocs: '/docs/api/',
		blog: '/blog/',
		cluster: '/cluster/',
		compute: '/compute/',
		contact: '/contact/',
		datacenter: '/datacenter/',
		home: '/',
		mi300x: '/mi300x/',
		mi355x: '/mi355x/',
		networking: '/networking/',
		partnerships: '/partners/',
		pricing: '/pricing/',
		quickStart: '/quick-start/',
	} as const;
	const externalApiDocsUrl = 'https://admin.hotaisle.app/api/docs/' as const;
	const toolNamePrefix = 'hotaisle_' as const;
	const modelContext = (
		navigator as Navigator & {
			modelContext?: {
				provideContext?: (context: {
					tools: Array<{
						description: string;
						execute: (input: unknown) => Promise<{ content: string }>;
						inputSchema: Record<string, unknown>;
						name: string;
					}>;
				}) => void;
				registerTool?: (tool: {
					description: string;
					execute: (input: unknown) => Promise<{ content: string }>;
					inputSchema: Record<string, unknown>;
					name: string;
				}) => void;
			};
		}
	).modelContext;

	if (!modelContext) {
		return;
	}

	const navigateTo = (path: string): { content: string } => {
		window.location.assign(path);

		return {
			content: `Navigating to ${new URL(path, window.location.origin).toString()}.`,
		};
	};

	const isInternalPageKey = (value: unknown): value is keyof typeof internalPagePaths =>
		typeof value === 'string' && value in internalPagePaths;

	const tools = [
		{
			name: `${toolNamePrefix}navigate_page`,
			description:
				'Navigate the current browser tab to an important Hot Aisle page such as pricing, quick start, compute, contact, or API docs.',
			inputSchema: {
				type: 'object',
				properties: {
					page: {
						type: 'string',
						description: 'The Hot Aisle page to open in the current browser tab.',
						enum: Object.keys(internalPagePaths),
					},
				},
				required: ['page'],
				additionalProperties: false,
			},
			execute: (input: unknown) => {
				const page =
					input && typeof input === 'object' ? (input as { page?: unknown }).page : null;
				if (!isInternalPageKey(page)) {
					throw new Error('Expected a valid Hot Aisle page key.');
				}

				return Promise.resolve(navigateTo(internalPagePaths[page]));
			},
		},
		{
			name: `${toolNamePrefix}open_api_reference`,
			description:
				'Open the live Hot Aisle API reference in the current browser tab for endpoint and schema inspection.',
			inputSchema: {
				type: 'object',
				properties: {},
				additionalProperties: false,
			},
			execute: () => {
				window.location.assign(externalApiDocsUrl);

				return Promise.resolve({
					content: `Opening ${externalApiDocsUrl}.`,
				});
			},
		},
		{
			name: `${toolNamePrefix}contact_team`,
			description:
				'Navigate to the Hot Aisle contact page so the user can reach sales or support.',
			inputSchema: {
				type: 'object',
				properties: {},
				additionalProperties: false,
			},
			execute: () => Promise.resolve(navigateTo(internalPagePaths.contact)),
		},
	];

	if (typeof modelContext.provideContext === 'function') {
		modelContext.provideContext({ tools });
		return;
	}

	if (typeof modelContext.registerTool !== 'function') {
		return;
	}

	for (const tool of tools) {
		try {
			modelContext.registerTool(tool);
		} catch {
			// Ignore duplicate registration or unsupported tool registration errors.
		}
	}
}
