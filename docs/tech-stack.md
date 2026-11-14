# Tech stack

The tech stack section ([`TechStack.svelte`](../src/lib/components/TechStack.svelte)), between projects and contact, shows the techniques I work with as a playful bento grid of logos. **The bigger the tile, the better I master it.** It's made for teachers, internship companies and clients: they see at a glance what I'm good at, without percentages or bars.

## Adding a technique

Everything is in [`src/lib/tech-stack.js`](../src/lib/tech-stack.js). One line per technique:

```js
{ name: 'Astro', logo: siAstro, level: 2 },
```

1. Find the logo on [simpleicons.org](https://simpleicons.org). The import is `si` + the slug with a capital: `astro` → `siAstro`, `nodedotjs` → `siNodedotjs`. Add it to the `import { ... } from 'simple-icons'` at the top.
2. Add the line to `techStack`, with a `level`:
   - `3`: masters it well (big tile)
   - `2`: reasonably (medium tile)
   - `1`: basics (small tile, only the logo)
3. Run `npm test` to check that every technique still has a shape.
4. Look at the section at 1440px and 375px. See [The grid](#the-grid) for the bottom row.

**The order in the list is the order in the grid**, so put the line where you want the tile. Mix the levels, so the same shapes don't end up together.

### A logo that isn't in simple-icons

Some big brands had their logos removed (Adobe, Microsoft), and some are not in there yet. Now this goes for REST API's, Adobe Illustrator, Lovable and VS Code: their SVGs are in [`src/lib/assets/logos/`](../src/lib/assets/logos/). Liquid uses the Shopify logo, it's the template language of Shopify and has no logo of its own.

1. Put the SVG in `src/lib/assets/logos/`.
2. Import it as text at the top of `tech-stack.js`. `?raw` puts the svg in the page itself, so it can follow the text color of its tile:
   ```js
   import illustrator from '$lib/assets/logos/illustrator.svg?raw';
   ```
3. Add it to the technique: `{ name: 'Adobe Illustrator', svg: illustrator, level: 2, shape: 'pill' }`. Keep a `shape` that was already there: without it the tile takes a turn in the shapes and all shapes after it shift.

**Make the SVG one color**, like the logos of simple-icons. `npm test` checks it. An SVG from the internet often needs some cleaning up:

- Remove the `fill="#..."` colors: the logo gets `fill: currentColor` from `TechStack.svelte` (black, light in dark mode, the background color on a filled tile).
- No `<style>`, `<image>` or gradients. A `<style>` with a class like `.st0` would end up in the whole page.
- A logo with two colors on top of each other (like the "Ai" on a dark square): make it one path with `fill-rule="evenodd"`, then the inner shape becomes a hole in the outer one.
- No ids like `id="a"`: two SVGs with the same id on one page break each other's masks and clip-paths.
- Keep the `viewBox`, so the logo scales.

Without `logo` and `svg`, the tile shows the name in big letters. Give it `shape: 'pill'`, so the name fits.

## How it works

### Shapes

The area of a tile shows the level. Within a level the shapes take turns, so it looks playful instead of rows of the same blocks (`withShapes()` in `tech-stack.js`):

| Level | Shapes (columns × rows), taking turns |
|---|---|
| 3 | `square` 2×2, `wide` 3×2 |
| 2 | `pill` 2×1 (round ends), `tall` 1×2 |
| 1 | `small` 1×1 |

An item can have its own `shape`, which wins from the turn. It doesn't take a turn itself, so the automatic shapes of the others keep alternating (the five tiles without a logo are pills, otherwise level 2 would be almost only pills).

### The grid

- A `ul` with `grid-auto-flow: dense`: the browser places every tile in the first spot where it fits, and fills a gap with a later tile that fits.
- The cells are square: `--stack-cell` is the width of the grid (`100cqi`, the grid's div is a container) minus the gaps, divided over the columns. `grid-auto-rows` is the same size, so a 2×2 tile is really square.
- Columns, by the width of the grid: 4 below 600px, 8 from 600px, **13 from 900px**. 13 because the 25 tiles together are 51 cells: 4 full rows of 13 are 52 cells, so there's only one empty cell (bottom right). With 12 columns there was a fifth row with only 3 tiles.
- When you add techniques, the number of cells changes and the bottom row can get ragged. Count the cells (square 4, wide 6, pill and tall 2, small 1) and pick a number of columns that the total (almost) fills, or change the order.
- The shape is a `data-shape` attribute on the `li`, not a class: `.pill` is already the global round button in `app.css`.

### Colors

- Plain white tiles on the grid paper, without a border. A few tiles are filled with the primary color (the `filled` set in `TechStack.svelte`) and a few others have a border in the primary color (the `bordered` set), chosen so you don't see a pattern. The other tiles have a transparent border, so every tile is the same size.
- Every logo is in the text color of its tile (`fill: currentColor`): black, light in dark mode, and the background color on a filled tile. That's more consistent than 25 brand colors next to each other.
- In dark mode `--color-primary` is pink, so the borders and the filled tiles turn pink by themselves.

### Hover

A tile tilts 2 degrees (every other one the other way) and grows to 1.05. With reduced motion nothing moves.

### Screen readers

The section has a heading "Tech stack" (`aria-labelledby`). Logos are `aria-hidden`. Every tile has its name and level as text, for example "HTML, masters it well". Small tiles only show the logo: the name is there for screen readers (`.visually-hidden`) and shows as a tooltip on hover (`title`).
