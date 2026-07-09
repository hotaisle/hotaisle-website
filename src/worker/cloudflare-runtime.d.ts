interface DurableObjectState {
	acceptWebSocket: (webSocket: WebSocket, tags?: string[]) => void;
	getWebSockets: (tag?: string) => WebSocket[];
}

type DurableObjectId = object;

interface DurableObjectNamespaceLike {
	get: (id: DurableObjectId) => FetcherLike;
	idFromName: (name: string) => DurableObjectId;
}

interface FetcherLike {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

interface ResponseInit {
	webSocket?: WebSocket | null;
}

declare const WebSocketPair: {
	new (): [WebSocket, WebSocket];
};
