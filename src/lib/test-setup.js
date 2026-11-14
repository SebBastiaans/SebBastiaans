// Loaded before the tests (npm test). The tests run in plain Node, without Vite, so two Vite things are taught here:
// - $lib/... is src/lib/... (the SvelteKit alias)
// - an import ending in ?raw gives the file as a string, like Vite does (used for the own logo svgs in tech-stack.js)
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';

const lib = new URL('./', import.meta.url);

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith('$lib/')) {
			const [path, query] = specifier.slice('$lib/'.length).split('?');
			return { url: new URL(path, lib).href + (query ? `?${query}` : ''), shortCircuit: true };
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url.endsWith('?raw')) {
			const text = readFileSync(new URL(url.slice(0, -'?raw'.length)), 'utf8');
			return { format: 'module', source: `export default ${JSON.stringify(text)};`, shortCircuit: true };
		}
		return nextLoad(url, context);
	}
});
