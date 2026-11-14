// Logos from simple-icons (CC0). One import per icon, so only these end up in the build, not all 3000+.
// Find the name of an icon on https://simpleicons.org: the import is si + the slug, for example siNodedotjs
import {
	siHtml5, siCss, siGithub, siJavascript, siSvelte, siNodedotjs, siExpress, siJson, siFigma, siClaude,
	siNotion, siShopify, siReact, siNextdotjs, siEleventy, siNunjucks, siFramer, siGit, siGsap
} from 'simple-icons';

// own logos, for what isn't in simple-icons. ?raw gives the svg as text, so it's put in the page and can follow
// the text color of its tile. Keep them one color: no fill colors, gradients or images (npm test checks it)
import restApi from '$lib/assets/logos/REST.svg?raw';
import illustrator from '$lib/assets/logos/illustrator.svg?raw';
import lovable from '$lib/assets/logos/lovable.svg?raw';
import vsCode from '$lib/assets/logos/VSCode.svg?raw';

// The tech stack section, see TechStack.svelte. The bigger the tile, the better I master it.
// The order of this list is the order in the grid: the browser places every tile in the first spot where it fits
// (dense). Levels are mixed on purpose, so the same shapes don't end up together. Move a line to move a tile.
// level: 3 = masters it well, 2 = reasonably, 1 = basics
// logo: an icon from simple-icons, drawn in the text color (black, or light in dark mode). Not in there? Put an SVG in src/lib/assets/logos/ and add it as
//   svg: import illustrator from '$lib/assets/logos/illustrator.svg?raw' (at the top), then { svg: illustrator }
//   Without logo and svg the tile shows the name in big letters, give it shape: 'pill' so the name fits.
//   Keep shape: 'pill' when you add a logo later: without it the tile takes a turn and all shapes after it shift
// shape (optional): overrides the automatic shape, one of the keys of shapeSpans below
export const techStack = [
	{ name: 'HTML', logo: siHtml5, level: 3 },
	{ name: 'CSS', logo: siCss, level: 3 },
	{ name: 'GitHub', logo: siGithub, level: 3 },

	{ name: 'JavaScript', logo: siJavascript, level: 2 },
	// SvelteKit has no logo of its own, it uses the Svelte logo
	{ name: 'SvelteKit', logo: siSvelte, level: 2 },
	{ name: 'React', logo: siReact, level: 1 },
	{ name: 'Svelte', logo: siSvelte, level: 2 },
	{ name: 'Node.js', logo: siNodedotjs, level: 2 },
	{ name: 'Express.js', logo: siExpress, level: 2 },
	{ name: "REST API's", svg: restApi, level: 2, shape: 'pill' },
	{ name: 'Next.js', logo: siNextdotjs, level: 1 },
	{ name: 'JSON', logo: siJson, level: 2 },
	// Adobe had its logos removed from simple-icons
	{ name: 'Adobe Illustrator', svg: illustrator, level: 2, shape: 'pill' },
	// Liquid is the template language of Shopify, it has no logo of its own
	{ name: 'Liquid', logo: siShopify, level: 2, shape: 'pill' },
	{ name: '11ty', logo: siEleventy, level: 1 },
	{ name: 'Figma', logo: siFigma, level: 2 },
	{ name: 'Claude', logo: siClaude, level: 2 },
	{ name: 'Lovable', svg: lovable, level: 2, shape: 'pill' },
	{ name: 'Notion', logo: siNotion, level: 2 },
	{ name: 'Shopify', logo: siShopify, level: 2 },
	// Microsoft had its logos removed from simple-icons
	{ name: 'VS Code', svg: vsCode, level: 2, shape: 'pill' },

	{ name: 'Git', logo: siGit, level: 1 },
	{ name: 'GSAP', logo: siGsap, level: 1 },
	{ name: 'Nunjucks', logo: siNunjucks, level: 1 },
	{ name: 'Framer', logo: siFramer, level: 1 }
];

// read out by screen readers after the name, for example "HTML, masters it well"
export const levelLabels = { 3: 'masters it well', 2: 'reasonably', 1: 'basics' };

// size of every shape in grid cells: [columns, rows]. The area shows the level
export const shapeSpans = {
	square: [2, 2],
	wide: [3, 2],
	pill: [2, 1],
	tall: [1, 2],
	small: [1, 1]
};

// the shapes of a level take turns, so tiles of the same level don't all look the same
const shapesPerLevel = { 3: ['square', 'wide'], 2: ['pill', 'tall'], 1: ['small'] };

// gives every item a shape: the next one in the turn of its level, unless it has its own shape.
// An own shape doesn't take a turn, so the automatic shapes of the others keep alternating
export function withShapes(items) {
	const turns = {};
	return items.map((item) => {
		if (item.shape) return item;
		const turn = turns[item.level] ?? 0;
		turns[item.level] = turn + 1;
		const shapes = shapesPerLevel[item.level];
		return { ...item, shape: shapes[turn % shapes.length] };
	});
}
