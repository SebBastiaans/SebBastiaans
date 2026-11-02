# Project carousel

How the projects section works, from the HTML base to the JavaScript enhancement.

Inspired by the projects page of [Mainly Photography Studio](https://mainlyphotography.com/projects). That site takes over the wheel and touch events and loops forever. This version keeps native scrolling, ends after the last project and works without JavaScript.

**Files**

- [`src/routes/+page.server.js`](../src/routes/+page.server.js): the project data
- [`src/lib/components/projects.svelte`](../src/lib/components/projects.svelte): HTML and CSS
- [`src/lib/stack-carousel.js`](../src/lib/stack-carousel.js): the JavaScript enhancement
- [`src/app.css`](../src/app.css): scroll snapping on `html`

---

## 1. Data

The projects live in `+page.server.js`, so the page component only passes data on (FDND convention). Because of `prerender = true` in `+layout.js`, this runs at build time and the data ends up in the static HTML.

Every project has `width` and `height`, the real pixel size of its image. They end up as attributes on the `<img>`, so the browser reserves the right space before a lazy loaded image arrives. Without them the image is 0px high until it loads, the page jumps (layout shift) and both the snapping and the carousel would measure the wrong positions.

## 2. HTML: the base layer

```html
<fieldset class="project-filter">
	<legend>Show projects</legend>
	<label><input type="radio" name="project-category" value="all" checked> All</label>
	…
</fieldset>

<ol class="project-list">
	<li class="project-card" data-category="school">
		<img src="…" alt="" width="2880" height="1984" loading="lazy">
		<h3><a href="…">Milledoni</a></h3>
		<p>Designing and building an interactive website.</p>
	</li>
</ol>
```

- **Radio buttons in a `fieldset`**: keyboard support (arrow keys) and screen reader announcements for free.
- **`<ol>`**: the order means something, you go through the projects one by one.
- **The link is in the `h3`**: one link per project, and screen reader users can jump from heading to heading.
- **`alt=""`**: the title is right next to the image, a description would be read twice.
- **Empty message with `hidden`**: "No personal projects yet" only shows when CSS can show it (see below). Without `:has()` support it stays hidden, because then the filter doesn't work either.

Without CSS and JS this is a plain list of links with images: everything works.

## 3. CSS

### Filter with `:has()`

```css
#projects:has(input[value="school"]:checked) .project-card:not([data-category="school"]) {
	display: none;
}
```

"When School is checked in this section, hide every card that isn't a school project." `display: none` also removes the cards for screen readers. Browsers without `:has()` show all projects.

The radio input itself is invisible (`opacity: 0`) but still on the page, so the keyboard and screen readers keep using the native control. The label shows the state: `label:has(input:checked)` for the chosen one and `label:has(input:focus-visible)` for the focus ring. Each label is at least 44px high, the WCAG touch target size.

The filter sits in `.project-toolbar` with `position: sticky`, so you can switch while scrolling through the projects. The same bar holds the counter (see JavaScript).

### Mobile first: only the image

On small screens a card shows only its image, like Mainly.

- The **title** is not removed but made invisible: the `h3` gets `position: absolute; inset: 0; opacity: 0`, so it lies over the whole card. Screen readers still read the link and the link is still the click and focus area.
- The **description** is visually hidden with the `clip-path: inset(50%)` technique, so screen readers still read it.

Never `display: none` here: then the only thing left is an image with `alt=""`, and the link would have no name.

**Stretched link**: the link gets a `::before` with `position: absolute; inset: 0`, so the whole card is clickable while there is only one link per project in the tab order. The global `a { position: relative }` from `app.css` is set back to `static` on this link, otherwise the `::before` would only cover the title. Keyboard focus gives the image an outline via `.project-card:has(a:focus-visible) img`, so the focus ring shows exactly the clickable area. It's on the image and not on the link itself, because the `h3` (and so the link and its `::before`) has `opacity: 0` on mobile and with JS.

On wide screens the `::before` only covers the image column (`inset-inline-start: auto; width: var(--_image-width)`). Otherwise the empty space next to the image would be one big link, and it's easy to click it by accident.

### Container query: text next to the image when it fits

```css
.project-stage {
	container-type: inline-size;
	--_gap: 2rem;
	--_image-width: 55cqi;
	--_text-width: calc(100cqi - var(--_image-width) - var(--_gap) - var(--_pad));
}

@container (min-width: 48rem) {
	.project-card {
		grid-template-columns: minmax(0, 1fr) var(--_image-width);
	}
}
```

The cards respond to the width of `.project-stage` (the wrapper around the list), not the screen. When the stage is at least 48rem wide, the text goes in a column on the left and the image stays on the right edge. If the list is ever placed somewhere narrower, the text stays hidden as long as it doesn't fit.

**The images get a fixed part of the width, the text gets the rest.** `cqi` is 1% of the width of the stage, so the images are always 55% of it, and `--_text-width` is what's left after the gap and the side padding. The other way around (a fixed text column and images filling the rest) made the images huge on wide screens, so they came far into the left half and under the title.

The custom properties are only substituted where they are used, so `cqi` is measured against the container of the element that uses them: the stage, for the cards, the panel and the title alike.

### Scroll snapping

```css
html { scroll-snap-type: y proximity; }
.project-card { scroll-snap-align: center; }
```

`proximity` instead of `mandatory`: the page only snaps when you stop near a project. Above and below the carousel you scroll freely, so after the last project you simply continue to Contact.

### Scroll-driven animations (fallback without JS)

```css
.project-card { view-timeline: --project-card block; }
```

Every card gets its own timeline that runs while the card scrolls through the screen: 0% when it enters at the bottom, 50% in the middle, 100% when it leaves at the top. Animations linked with `animation-timeline: --project-card` follow the scroll position instead of time.

- **`project-scale`**: the image goes from `scale(.72)` at the edges to `scale(1)` in the middle, with `ease-in-out` between the keyframes. It shrinks from `right center`, so the carousel is aligned right. Only used when JS hasn't enhanced the list (`.project-list:not([data-enhanced])`).
- **`project-fade`**: on wider screens the title and description fade in when their project is in the middle. This sits inside the container query, otherwise the animation would make the invisible mobile text visible again.

Both are wrapped in:

```css
@media (prefers-reduced-motion: no-preference) {
	@supports (animation-timeline: view()) { … }
}
```

The downside of `transform: scale()` is that a card keeps its space in the page, so shrunk cards leave gaps. The JavaScript layer fixes that.

## 4. JavaScript: `stack-carousel.js`

A [Svelte attachment](https://svelte.dev/docs/svelte/@attach), used as `<ol {@attach stackCarousel}>`. Svelte runs it only in the browser and calls the returned function to clean up.

### The idea

The cards keep their place in the page, so scroll length, snapping, keyboard and screen readers are untouched. JS only moves and scales them **visually** with `transform`, so they stay glued together:

```
 page layout (unchanged)        what you see
┌──────────────────┐                ┌──────────────┐
│     card 1       │                │   card 1     │ ← scale .8, moved down
├──────────────────┤          ──────┼──────────────┴───┐
│     card 2       │   middle │     card 2 (anchor)    │ ← scale 1
├──────────────────┤   of the ──────┼──────────────┬───┘
│     card 3       │   screen       │   card 3     │ ← scale .8, moved up
└──────────────────┘                └──────────────┘
```

### Every frame

1. **Measure** the visible cards: `offsetTop` and `offsetHeight` relative to the list (the list has `position: relative`). Cards hidden by the filter have no `offsetParent` and are skipped. `offsetTop` ignores transforms, so the measurements are the original page positions.
2. **Find the anchor**: the card under the middle of the screen. `progress` tells how far the middle of the screen is through that card (0 = top, 1 = bottom). The anchor is placed so the same point of the card stays under the middle, also when it is scaled. Because of that nothing jumps when the anchor switches to the next card: at `progress = 1` the bottom of the old anchor is in the middle, at `progress = 0` the top of the new anchor is.
3. **Stack below**: every next card starts exactly where the previous one ends.
4. **Stack above**: every previous card ends exactly where the next one starts.
5. **Place** each card with `translate3d(0, newTop - originalTop, 0) scale(scale)` and `transform-origin: right top`.

### Scale

```js
distance = min(1, |card centre - screen centre| / half the screen height)
scale = 1 - (1 - 0.72) * smoothstep(distance)
smoothstep(x) = x * x * (3 - 2 * x)
```

The scale depends on where the card ends up, and where it ends up depends on the scale. `solveScale` guesses, calculates the position, corrects the scale and repeats this five times, which is close enough.

### Start and end of the list

- **Above the list**: the first card stays at its own top.
- **Below the list**: the last card stays at its own bottom, so it lines up with the next section instead of sliding over it.

### Performance

- Scroll and resize events only request an update. `requestAnimationFrame` makes sure there is at most one calculation per frame.
- Only `transform` changes, which doesn't trigger layout. Reading `offsetTop` is cheap because nothing dirtied the layout.
- `will-change: transform` puts the cards on their own layer.
- A `ResizeObserver` on the list recalculates when the filter hides or shows cards.

### Progressive enhancement and reduced motion

- On start the attachment sets `data-enhanced` on the list. The CSS uses that to turn off its own scroll-driven scale, so the cards are not scaled twice.
- With `prefers-reduced-motion: reduce` it doesn't start. When the setting changes during the visit, it starts or stops, and stopping removes every transform.
- Without JS the CSS layer stays: scaling with gaps where `animation-timeline` is supported, a plain list everywhere else.

### Counter

The sticky bar shows the position of the project in the middle of the screen, like `03 / 08`.

```svelte
<ol {@attach (list) => stackCarousel(list, (newActive) => (active = newActive))}>
```

`stackCarousel` takes a second argument, `onActiveChange`. It is called with `{ index, total, projectIndex }` of the anchor card (only the visible cards count, so the filter is taken into account), and with `null` when the carousel stops or no card is visible. It only calls back when the value changes, not every frame, so Svelte doesn't re-render while scrolling.

The counter is `aria-hidden="true"`: screen readers already announce "list, 8 items" and the position of each item, and announcing every change while scrolling would be noise. Because the counter only exists when the JS is running, it is not there without JS or with reduced motion. `font-variant-numeric: tabular-nums` gives all digits the same width, so the counter doesn't wiggle.

### Details panel on wide screens

When the text fits next to the images, the title and description don't move with the cards. They sit in one fixed panel on the left, in the middle of the screen, and the content changes to the project in the middle.

```
┌──────────── .project-stage ─────────────────────┐
│ ┌ .project-details ┐┌ .project-list ──────────┐ │
│ │ (absolute, full  ││  card 1                 │ │
│ │  height of list) ││                         │ │
│ │ ┌──────────────┐ ││  card 2  ← middle       │ │
│ │ │sticky, 100svh│ ││                         │ │
│ │ │  title        │ ││  card 3                 │ │
│ │ │  description  │ ││                         │ │
│ │ └──────────────┘ ││                         │ │
│ └──────────────────┘└─────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

- `.project-details` is `position: absolute` over the left column of the list, as high as the whole list. It has `pointer-events: none`, so clicks go through to the card links.
- Inside it, `.project-details-content` is `position: sticky; top: 0; height: 100svh` with the text centred. It stays in the middle of the screen while the list scrolls by, and leaves with the list at the end.
- `stackCarousel` reports `projectIndex`, the position of the middle card in the **whole** list. The counter's `index` only counts visible cards, so it can't be used to look up the project when the filter is on.
- The title may never overlap the images. The panel is exactly `--_pad + --_text-width` wide, the same as the text column of the cards, and the title size is `clamp(1.5rem, calc(var(--_text-width) * .14), 4.5rem)`. A long word like "Frankendael" is about 6em wide in IBM Plex Serif, so at 14% of the column it still fits on one line. For even longer words, `hyphens: auto` (works because of `<html lang="en">`) and `overflow-wrap: break-word` break the word instead of letting it run into the images. The title inside the cards (without JS) has the same safety net.
- `{#key active.projectIndex}` with `in:fade` fades the new title and description in when the project changes.
- The panel is `aria-hidden="true"`: screen readers already read the title and description in the card itself, which stays in the HTML (visually hidden, like on mobile).
- The title and description in the panel are wrapped in a link to the same project, so the text is clickable like the image. The panel has `pointer-events: none` and only the link sets it back to `auto`, so the empty space around the text is not clickable. The link has `tabindex="-1"`: the keyboard already reaches the project through the link in the card, and a focusable element inside `aria-hidden` would be focusable without a name for screen readers.

**Layers:** the panel only exists when the JS runs. The CSS that puts the text next to its own image is limited to `.project-list:not([data-enhanced])`, and so is the text fade. So without JS or with reduced motion you get the text next to each image as before, and with JS you get the fixed panel.

### Why `:global` in the CSS

```css
.project-list:global([data-enhanced]) .project-card { … }
```

Svelte removes selectors it can't find in the markup. `data-enhanced` is added later by JS, so only that attribute is marked `:global`. The rest of the rule stays scoped to the component.

## Accessibility checklist

- [x] Filter is a native radio group with a (visually hidden) `legend`
- [x] Visible focus on the filter labels and the cards
- [x] Touch targets of at least 44px
- [x] One link per project, with the project title as its name
- [x] Title and description are read on every screen size
- [x] Native scrolling: keyboard, zoom and assistive technology keep working
- [x] No motion with `prefers-reduced-motion: reduce`
- [x] Works without JavaScript and without modern CSS
- [x] Counter and details panel are decorative (`aria-hidden`), no announcements while scrolling

## Settings to tweak

| What | Where |
| --- | --- |
| Smallest scale at the edges | `edgeScale` in `stack-carousel.js` and `scale(.72)` in the `project-scale` keyframes |
| When the text goes next to the image | `@container (min-width: 48rem)` in `projects.svelte` |
| Width of the images on wide screens (the text gets the rest) | `--_image-width` on `.project-stage` in `projects.svelte` |
| Space between text and images | `--_gap` on `.project-stage` in `projects.svelte` |
| Size of the title in the details panel | `* .14` in `.project-details-title` in `projects.svelte`. Higher means bigger, but check that the longest word still fits |
| Fade between projects in the details panel | `in:fade={{ duration: 300 }}` in `projects.svelte` |
| Snap strength | `scroll-snap-type` in `app.css` (`proximity` or `mandatory`) |
