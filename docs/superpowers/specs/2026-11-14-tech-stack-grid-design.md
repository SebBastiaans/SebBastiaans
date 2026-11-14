# Tech stack grid in the hero — design

Date: 2026-11-14 · Size: small feature (short design)

## Intent

Teachers, internship companies and clients see at a glance which techniques Seb works with and how well he masters each one. Visual: the logos of the tech stack, no percentages or bars. Bigger tile = better mastery. Playful, mixed up, like a bento grid (inspiration: a screenshot of a widget grid with tiles of different shapes).

## Goals

- One tile per technique with its logo. The area of the tile shows the level: 3 = masters it well, 2 = reasonably, 1 = basics.
- Playful: shapes alternate (square, tall, wide, pill) and the grid packs itself without gaps.
- Easy to extend: Seb adds more techniques later, one line per technique.
- In the style of the site (option B): white tiles with a `--color-primary` border on the grid paper, now and then a filled tile. In dark mode it follows along (blue becomes pink).

## Non-goals

- No "currently learning" status (dropped on purpose).
- No percentages, stars or bars.
- No colorful gradients or dark tiles like in the screenshot (option A was not picked).

## Approaches

1. **List in code, shape picked automatically (picked).** Every technique has a name, a logo and a level. The grid alternates the shapes within a level itself. Adding something is one line and the grid stays playful by itself. An optional `shape` can override the automatic choice for one item.
2. List in code, shape chosen by hand per item. Full control, but every change means thinking about the whole composition again.
3. Everything by hand in the HTML. Quick at first, hard to keep up, and it doesn't match how the projects are set up (a list in `+page.server.js`).

## Decided

- **Place (option C):** the grid goes on the right of the hero, where the profile photo is now. The photo becomes a big tile in the grid itself. The intro and skills lists stay on the left, with the reading animation.
- **Techniques and levels:**
  - Level 3: HTML, CSS, GitHub
  - Level 2: JavaScript, SvelteKit, Svelte, Node.js, Express.js, REST API's, JSON, Adobe Illustrator, Liquid, Figma, Claude, Lovable, Notion, VS Code, Shopify
  - Level 1: React, Next.js, 11ty, Nunjucks, Framer, Git, GSAP
- **Logos:** the `simple-icons` package (CC0), imported per icon so only the logos that are used end up in the build. Each logo is drawn in its own brand color.

## Calls made by Claude (correct where needed)

- **Data** in `src/lib/tech-stack.js` (`{ name, logo, level, shape? }`), imported by `Hero.svelte`. It's not page data like the projects, so it doesn't go through `+page.server.js`.
- **Shapes per level** (in grid cells): level 3 alternates 2×2 and 3×2; level 2 alternates 2×1 (pill) and 1×2 (tall); level 1 is 1×1. The photo is 3×3. `grid-auto-flow: dense` fills the gaps.
- **Missing logos:** Adobe Illustrator, VS Code, Liquid and Lovable are not in simple-icons, and REST API's has no logo. The data also accepts an SVG of your own (`src/lib/assets/logos/`). Until there is one, the tile shows the name in big letters. The logos can be added later.
- **SvelteKit** uses the Svelte logo with the name "SvelteKit".
- **Names:** big and medium tiles show the name next to the logo. On small tiles the name is only there for screen readers, and shows as a tooltip (`title`) on hover.
- **Accessibility:** the grid is a `ul` with an `li` per technique. Logos are `aria-hidden`. Every item has text with the level for screen readers ("HTML, masters it well").
- **Playful hover:** a tile tilts a little and grows a bit on hover. Not with reduced motion.
- **Fitting on the first screen:** with 25 techniques plus the photo the grid gets taller than the free space on a laptop screen. The hero then grows along, and projects still starts right under it (the `min-height` of `.page-start` allows that). When everything on the first screen is no longer possible, that's accepted, because more techniques are coming.
- **Mobile (below 800px):** one column: intro, skills, then the grid (with the photo as a tile) in 4 columns.

## Left to the builder

- Exact cell size and gap, as long as the photo tile is about as big as the photo is now.
- Which tiles are filled with the primary color (now and then, not in a visible pattern).
- Updating the README and docs as usual.
