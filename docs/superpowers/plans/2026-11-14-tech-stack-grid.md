# Tech Stack Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A playful bento grid of tech stack logos on the right of the hero, where the tile area shows the level, with the profile photo as a big tile.

**Architecture:** The data and the pure shape logic live in `src/lib/tech-stack.js` (tested with `node --test`, no new test dependency). `src/lib/components/TechStack.svelte` renders a `ul` grid with `grid-auto-flow: dense`, with the photo as its first item. `Hero.svelte` puts the lists on the left and `TechStack` where the photo was.

**Tech Stack:** SvelteKit 2 / Svelte 5 (runes), plain CSS (nesting, custom properties in `:root`), `simple-icons` (CC0), `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-14-tech-stack-grid-design.md`

## Global Constraints

- Levels: 3 = "masters it well", 2 = "reasonably", 1 = "basics".
- Shapes in grid cells: level 3 alternates 2×2 (`square`) and 3×2 (`wide`); level 2 alternates 2×1 (`pill`) and 1×2 (`tall`); level 1 is 1×1 (`small`); the photo is 3×3. An item's optional `shape` overrides the automatic choice.
- Style B: white tiles (`--color-background`) with a 2px `--color-primary` border on the grid paper, now and then a tile filled with `--color-primary`. No gradients, no dark tiles.
- Logos: one import per icon from `simple-icons` (never the whole set), drawn in the brand color (`#` + `hex`). Own SVGs go in `src/lib/assets/logos/`. Without a logo the tile shows the name big.
- Custom properties that are shared go in `:root` in `src/app.css` (project convention).
- Respect `prefers-reduced-motion` (no hover tilt).
- Comments in the codebase style: plain English, explaining why.
- Don't commit: the user commits themselves.

## Review Focus

- A white/black brand color (Notion, Next.js, JSON, GitHub, Eleventy: hex `000000`/`181717`/`222222`) on a filled tile, or in dark mode: the logo must stay visible → a dark logo gets `currentColor` instead of its brand color (test in Task 1: `logoColor`).
- An item without a logo (Illustrator, VS Code, Liquid, Lovable, REST API's) → shows the name big, no empty tile and no crash (Task 2 browser check).
- Adding a technique later with only `{ name, logo, level }` → gets a shape automatically and the grid has no gaps (test in Task 1, and the dense check in Task 2).
- Mobile 375px: no horizontal scroll, the grid in 4 columns under the lists (Task 2 check).
- Reduced motion → no tilt/scale on hover, the reading animation of the lists keeps working as before (Task 3 check).

---

### Task 1: Data and shape logic

**Files:**
- Create: `src/lib/tech-stack.js`
- Create: `src/lib/tech-stack.test.js`
- Modify: `package.json` (devDependency `simple-icons`, script `"test": "node --test src/lib/"`)

**Interfaces:**
- Produces:
  - `export const techStack: Array<{ name: string, level: 1|2|3, logo?: { path: string, hex: string }, svg?: string, shape?: Shape }>`: the 25 techniques of the spec, in the order of the spec (level 3, then 2, then 1).
  - `export const levelLabels = { 3: 'masters it well', 2: 'reasonably', 1: 'basics' }`
  - `export const shapeSpans = { square: [2, 2], wide: [3, 2], pill: [2, 1], tall: [1, 2], small: [1, 1], photo: [3, 3] }` as `[columns, rows]`
  - `export function withShapes(items) → items with .shape filled in`: per level cycles through `{3: ['square', 'wide'], 2: ['pill', 'tall'], 1: ['small']}` by the index *within that level*. An item with its own `shape` keeps it, and still counts for the cycle.
  - `export function logoColor(hex: string) → string`: `'#' + hex`, or `'currentColor'` when the color is very dark (relative luminance < 0.1).

- [ ] **Step 1: Install simple-icons**

Run: `npm install -D simple-icons`
Expected: `simple-icons` in `devDependencies` (16.x). Add `"test": "node --test src/lib/"` to the scripts.

- [ ] **Step 2: Write the failing tests** in `src/lib/tech-stack.test.js` (`node:test` + `node:assert/strict`)

```js
test('alternates shapes within a level', () => {
  const items = withShapes([{ level: 3 }, { level: 2 }, { level: 3 }, { level: 2 }, { level: 1 }, { level: 3 }]);
  assert.deepEqual(items.map(i => i.shape), ['square', 'pill', 'wide', 'tall', 'small', 'square']);
});
test('own shape wins and still counts for the cycle', () => {
  const items = withShapes([{ level: 2, shape: 'tall' }, { level: 2 }]);
  assert.deepEqual(items.map(i => i.shape), ['tall', 'tall']);
});
test('every technique of the spec is there with its level', () => {
  assert.equal(techStack.length, 25);
  assert.deepEqual(techStack.filter(t => t.level === 3).map(t => t.name), ['HTML', 'CSS', 'GitHub']);
  assert.equal(techStack.filter(t => t.level === 1).length, 7);
});
test('every shape has a span', () => {
  for (const t of withShapes(techStack)) assert.ok(shapeSpans[t.shape]);
});
test('dark logos follow the text color', () => {
  assert.equal(logoColor('000000'), 'currentColor');
  assert.equal(logoColor('FF3E00'), '#FF3E00');
});
```

- [ ] **Step 3: Run to see it fail**

Run: `npm test`
Expected: FAIL, `Cannot find module` / missing exports.

- [ ] **Step 4: Implement `src/lib/tech-stack.js`**

Imports from `simple-icons`: `siHtml5, siCss, siGithub, siJavascript, siSvelte (for Svelte and SvelteKit), siNodedotjs, siExpress, siJson, siFigma, siClaude, siNotion, siShopify, siReact, siNextdotjs, siEleventy, siNunjucks, siFramer, siGit, siGsap`. No `logo` for Adobe Illustrator, Liquid, Lovable, VS Code, REST API's. Names exactly as in the spec ("Express.js", "REST API's", "11ty", "VS Code", "Next.js", "Node.js"). A comment above the list explains how to add a technique and an own SVG (`import svg from '$lib/assets/logos/x.svg?raw'` → `svg` field).

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: 5 tests PASS.

---

### Task 2: TechStack component in the hero

**Files:**
- Create: `src/lib/components/TechStack.svelte`
- Modify: `src/lib/components/Hero.svelte` (photo moves into TechStack, grid areas)
- Modify: `src/app.css` (`--stack-cell`, `--stack-gap` in `:root`)

**Interfaces:**
- Consumes: `techStack`, `withShapes`, `shapeSpans`, `levelLabels`, `logoColor` from Task 1.
- Produces: `<TechStack>` with a snippet prop `photo` (Svelte 5 `{#snippet}`), so the `<picture>` with the dodge handler stays in `Hero.svelte` and becomes the first `li` (3×3) of the grid.

- [ ] **Step 1: Build `TechStack.svelte`**

`<ul class="tech-stack">`: first `<li class="tile photo">{@render photo()}</li>`, then per item an `li` with `style:grid-column="span {cols}"`, `style:grid-row="span {rows}"`.
- With a logo: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d={logo.path} fill={logoColor(logo.hex)}/></svg>`. With `svg`: `{@html svg}` in an `aria-hidden` span. Without either: the name big.
- Names: visible on `square`, `wide`, `pill`, `tall`. On `small` the name is in `.visually-hidden`, plus `title={name}`.
- Screen readers: every li has text "{name}, {levelLabels[level]}" (the level part `.visually-hidden`).
- Grid: `grid-template-columns: repeat(auto-fill, var(--stack-cell))`, `grid-auto-rows: var(--stack-cell)`, `grid-auto-flow: dense`, `gap: var(--stack-gap)`.
- Tiles: border-radius about `1.25rem`, `pill` fully round. Now and then a tile filled with `--color-primary` (the logo and text then in `--color-background`), not in a visible pattern (for example a fixed set of indexes).

- [ ] **Step 2: Hook it into `Hero.svelte`**

From 800px: `grid-template-areas: "intro stack" "skills stack"`, rows `auto 1fr`. The photo tile is about the size of the current photo (3 cells ≈ 420px, so `--stack-cell` ≈ calc((420px - 2 * gap) / 3)). Below 800px: `"intro" "skills" "stack"`, the grid in 4 columns. The `.profile-photo` fills its tile (`width: 100%; height: 100%; object-fit: cover`, rounded like the tiles).

- [ ] **Step 3: Check in the browser** (dev server + Playwright, 1440×800 and 375×800)

Expected:
- 26 `li` in `.tech-stack` (photo + 25).
- `document.documentElement.scrollWidth === innerWidth` at both widths.
- The photo tile ≥ 380px wide at 1440.
- On a filled tile, Notion/GitHub are visible (not black on blue).
- A tile without a logo shows its name.
- A screenshot at both widths, looked at: a playful layout with no big gaps.

---

### Task 3: Hover, dark mode and docs

**Files:**
- Modify: `src/lib/components/TechStack.svelte`
- Modify: `README.md` (Hero section + project tree), create `docs/tech-stack.md`

- [ ] **Step 1: Playful hover**

Inside `@media (prefers-reduced-motion: no-preference)`: on `:hover`, `rotate` of a few degrees (alternating left/right) + `scale: 1.05`, with a `transition` of about `.2s`. Use `rotate`/`scale` and not `transform`, so it doesn't fight the photo dodge (`translate`).

- [ ] **Step 2: Check**

At 1440 in the browser: hover a tile → `getComputedStyle(tile).scale === '1.05'`. With `emulateMedia({ reducedMotion: 'reduce' })` → stays `none`. Dark mode (`data-theme="dark"`): the borders/fill are pink, dark logos light.

- [ ] **Step 3: Docs**

`docs/tech-stack.md`: how it works (levels → shapes, dense, data file), and how to add a technique / own logo. README: the Hero section mentions the grid with a link to that doc, `TechStack.svelte` and `tech-stack.js` in the project tree, `npm test` in the scripts.

- [ ] **Step 4: Last run**

Run: `npm test && npm run build`
Expected: tests PASS, build without errors.
