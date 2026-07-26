import { minify } from 'vite';

const minifiedScriptCache = new Map<string, Promise<string>>();

export const minifyInlineScript = async (source: string): Promise<string> => {
	const cachedScript = minifiedScriptCache.get(source);
	if (cachedScript) {
		return await cachedScript;
	}

	const minifiedScript = minify('inline-script.js', source).then(({ code }) => code.trim());

	minifiedScriptCache.set(source, minifiedScript);

	return await minifiedScript;
};
