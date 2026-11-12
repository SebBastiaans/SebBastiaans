# Project carousel

How the projects section works, from the HTML base to the JavaScript enhancement.

Inspired by the projects page of [Mainly Photography Studio](https://mainlyphotography.com/projects). That site takes over the wheel and touch events and loops forever. This version keeps native scrolling, ends after the last project and works without JavaScript.

**Files**

- [`src/routes/+page.server.js`](../src/routes/+page.server.js): the project data
- [`src/lib/components/Projects.svelte`](../src/lib/components/Projects.svelte): HTML and CSS
- [`src/lib/stack-carousel.js`](../src/lib/stack-carousel.js): the JavaScript enhancement
- [`src/lib/autoplay-video.js`](../src/lib/autoplay-video.js): plays videos only while they are on screen
- [`src/app.css`](../src/app.css): scroll snapping on `html`

---

## 1. Data

The projects live in `+page.server.js`, so the page component only passes data on (FDND convention). Because of `prerender = true` in `+layout.js`, this runs at build time and the data ends up in the static HTML.

A project has a `github` url and, if it is online, a `live` url. The title and image link to `live ?? github`, so a project without a live site still links somewhere. The GitHub link is always there as a separate link, so visitors who want to read the code don't have to look for it on the live site.

Every project has `width` and `height`, the real pixel size of its image. They end up as attributes on the `<img>`, so the browser reserves the right space before a lazy loaded image arrives. Without them the image is 0px high until it loads, the page jumps (layout shift) and both the snapping and the carousel would measure the wrong positions.

## 2. HTML: the base layer

```html
<fieldset class="switch">
	<legend class="visually-hidden">Show projects</legend>
	<label><input type="radio" name="project-category" value="all" checked> All</label>
	…
</fieldset>

<ol class="project-list">
	<li class="project-card" data-category="school">
		<picture>
			<source type="image/avif" srcset="…">
			<source type="image/webp" srcset="…">
			<img src="…" alt="" width="2880" height="1984" loading="lazy">
		</picture>
		<h3><a href="…" target="_blank" rel="noopener">Milledoni <span class="visually-hidden">(opens in a new tab)</span></a></h3>
		<p>Designing and building an interactive website.</p>
		<a class="project-github" href="…" target="_blank" rel="noopener">GitHub <span class="visually-hidden">repository of Milledoni (opens in a new tab)</span> <svg aria-hidden="true">…</svg></a>
	</li>
</ol>
```

- **Radio buttons in a `fieldset`**: keyboard support (arrow keys) and screen reader announcements for free.
- **`<ol>`**: the order means something, you go through the projects one by one.
- **The link is in the `h3`**: the main link of the project, and screen reader users can jump from heading to heading.
- **Project links open in a new tab** (`target="_blank"`), so visitors don't lose their place in the carousel. The visually hidden "(opens in a new tab)" tells screen reader users beforehand, because a new tab without warning is disorienting. `rel="noopener"` keeps the opened page away from this page through `window.opener`; modern browsers already do this for `target="_blank"`, older ones don't.
- **The GitHub link comes after the description**: the text says "GitHub", the visually hidden part makes it unique ("GitHub repository of Milledoni") in a screen reader's list of links.
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

The filter uses the global `.switch` class from `app.css`, the same as the animation switch of the musical text: one pill with the three options, and a knob that slides behind the chosen one (see [Conventions](../README.md#conventions)). The radio input itself is invisible (`opacity: 0`) but still on the page, so the keyboard and screen readers keep using the native control. The label shows the focus ring with `:has(input:focus-visible)`. The switch is 44px high, the WCAG touch target size.

The filter sits in `.project-toolbar` with `position: sticky`, so you can switch while scrolling through the projects. The same bar holds the counter (see JavaScript).

### Mobile first: only the image

On small screens a card shows only its image, like Mainly.

- The **title** is not removed but made invisible: the `h3` gets `position: absolute; inset: 0; opacity: 0`, so it lies over the whole card. Screen readers still read the link and the link is still the click and focus area.
- The **description** is visually hidden with the `clip-path: inset(50%)` technique, so screen readers still read it.

Never `display: none` here: then the only thing left is an image with `alt=""`, and the link would have no name.

**Stretched link**: the link gets a `::before` with `position: absolute; inset: 0`, so the whole card is clickable while there is only one link per project in the tab order. The global `a { position: relative }` from `app.css` is set back to `static` on this link, otherwise the `::before` would only cover the title. Keyboard focus gives the image an outline via `.project-card:has(a:focus-visible) img`, so the focus ring shows exactly the clickable area. It's on the image and not on the link itself, because the `h3` (and so the link and its `::before`) has `opacity: 0` on mobile and with JS.

**GitHub link on mobile**: the text is hidden there, but the link can't be, or touch users could never reach it. So it lies on the bottom right of the image (44px touch target, solid background, so it stays readable on any image). `z-index: 1` keeps it above the stretched link. The focus ring on the image is limited to `h3 a:focus-visible`, because focus on the GitHub link has its own ring and doesn't mean the whole image.

On wide screens the `::before` only covers the image column (`inset-inline-start: auto; width: var(--project-image-width)`). Otherwise the empty space next to the image would be one big link, and it's easy to click it by accident.

### Container query: text next to the image when it fits

```css
/* app.css */
:root {
	--project-gap: 2rem;
	--project-image-width: 55cqi;
	--project-text-width: calc(100cqi - var(--project-image-width) - var(--project-gap) - var(--page-padding));
}

/* Projects.svelte */
.project-stage { container-type: inline-size; }

@container (min-width: 48rem) {
	.project-card {
		grid-template-columns: minmax(0, 1fr) var(--project-image-width);
	}
}
```

The cards respond to the width of `.project-stage` (the wrapper around the list), not the screen. When the stage is at least 48rem wide, the text goes in a column on the left and the image stays on the right edge. If the list is ever placed somewhere narrower, the text stays hidden as long as it doesn't fit.

**The images get a fixed part of the width, the text gets the rest.** `cqi` is 1% of the width of the stage, so the images are always 55% of it, and `--project-text-width` is what's left after the gap and the side padding. The other way around (a fixed text column and images filling the rest) made the images huge on wide screens, so they came far into the left half and under the title.

**Why `cqi` works in `:root`.** The properties are declared on `:root`, but `:root` is not a container. That's fine: a custom property without `@property` keeps its value as text, and units like `cqi` and `%` are only calculated where the property is used with `var()`. So `55cqi` is measured against the container of the element that uses it: the stage, for the cards, the panel and the title alike. Other `var()` references inside a custom property (like `--page-padding`) are filled in on `:root` itself.

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
- The title may never overlap the images. The panel is exactly `--page-padding + --project-text-width` wide, the same as the text column of the cards, and the title size is `clamp(1.5rem, calc(var(--project-text-width) * .14), 4.5rem)`. A long word like "Frankendael" is about 6em wide in IBM Plex Serif, so at 14% of the column it still fits on one line. For even longer words, `hyphens: auto` (works because of `<html lang="en">`) and `overflow-wrap: break-word` break the word instead of letting it run into the images. The title inside the cards (without JS) has the same safety net.
- `{#key active.projectIndex}` with `in:fade` fades the new title and description in when the project changes.
- The panel is `aria-hidden="true"`: screen readers already read the title, description and GitHub link in the card itself, which stay in the HTML (visually hidden, like on mobile).
- The title and description in the panel are wrapped in a link to the same project, so the text is clickable like the image. The panel has `pointer-events: none` and only the link sets it back to `auto`, so the empty space around the text is not clickable. The link has `tabindex="-1"`: the keyboard already reaches the project through the link in the card, and a focusable element inside `aria-hidden` would be focusable without a name for screen readers.
- The GitHub link has the same arrow as the Apple Music link ([`ArrowIcon.svelte`](../src/lib/components/ArrowIcon.svelte)) and no border. Like there, the arrow moves on hover and keyboard focus instead of the underline of the other links.
- The GitHub link in the panel sits next to that link and not inside it, because a link can't contain another link. It has `tabindex="-1"` for the same reason. The one in the card stays in the tab order: it is hidden with `clip-path` and `opacity` until it has keyboard focus, then it appears on the image, so focus is never invisible. It has to stay a focusable element, so no `display: none`.

**Layers:** the panel only exists when the JS runs. The CSS that puts the text next to its own image is limited to `.project-list:not([data-enhanced])`, and so is the text fade. So without JS or with reduced motion you get the text next to each image as before, and with JS you get the fixed panel.

### Why `:global` in the CSS

```css
.project-list:global([data-enhanced]) .project-card { … }
```

Svelte removes selectors it can't find in the markup. `data-enhanced` is added later by JS, so only that attribute is marked `:global`. The rest of the rule stays scoped to the component.

## 5. Videos

A project can have a `video` instead of only an `image`. How to add one is in the [README](../README.md#with-a-video-instead-of-a-photo).

### Markup

```svelte
<picture>
	<source type="image/avif" srcset={image.sources.avif} {sizes}>
	<source type="image/webp" srcset={image.sources.webp} {sizes}>
	<img class="project-media" src={image.img.src} alt="" {width} {height} loading="lazy">
</picture>
{#if video}
	<video class="project-media" src={video} {width} {height}
		muted loop playsinline preload="none" aria-hidden="true"
		{@attach (element) => autoplayVideo(element, videosPaused)}></video>
{/if}
```

- **The image is the still**: every card has the `<picture>`, and a video lies on top of it in the same grid cell (`grid-area: 1 / 1`, on wide screens both get the image column). That's what you see without JS, with reduced motion, when the browser blocks autoplay and while the video loads. So a video project never shows an empty box.
- **No `poster`**: a `poster` can't have a `srcset`, so it was one 1600px WebP, also on mobile. Lighthouse flagged that as "Improve image delivery". The `<picture>` picks the width that fits. Without a poster a video is transparent until its first frame, so the image underneath stays visible.
- **`width` and `height`** work on `<video>` just like on `<img>`: the browser uses them for the aspect ratio before anything is loaded, so there is no layout shift.
- **`preload="none"`**: nothing of the video is downloaded until it plays. With a few videos on the page, that keeps the first load light.
- **`muted` and `playsinline`**: browsers only allow autoplay for muted videos, and `playsinline` stops iOS from opening the video full screen.
- **`aria-hidden="true"`**: the video is decorative, like the images with `alt=""`. The project title in the card is the link and its name. Because it is muted, it needs no captions.
- The `<picture>` has `display: contents`, so the `<img>` inside is the grid item, just like the `<video>`.
- Both elements share the class `.project-media`, so all the CSS (aspect ratio, `object-fit`, the image column on wide screens, the focus ring and the scroll-driven scale) works for images and videos alike.

### Playing only on screen: `autoplay-video.js`

A Svelte attachment with an `IntersectionObserver`: the video plays when at least a quarter of it is on screen and pauses when it scrolls away. Videos outside the screen don't use battery and data, and you see the video in the middle move, like on Mainly.

`play()` returns a promise that fails when the browser blocks autoplay (for example in low power mode). The `.catch()` ignores that, and the image underneath simply stays visible.

### Pause button

[WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html): moving content that starts by itself and lasts longer than 5 seconds must be pausable. So when at least one project has a video, the bar above the projects gets a button:

```svelte
<button type="button" onclick={() => (videosPaused = !videosPaused)}>
	{videosPaused ? 'Play videos' : 'Pause videos'}
</button>
```

- **The text says what the button does**: "Pause videos" while they play, "Play videos" while they are paused, just like the play button of the musical text and the theme toggle. Because the label describes the action, there is no `aria-pressed`: together with a changing label, screen readers would announce something confusing like "Play videos, pressed".
- The attachment reads `videosPaused`, so Svelte runs it again when the button is pressed: the cleanup pauses the video and disconnects the observer, and the new run either stays paused or starts observing again.
- **The button only appears when JS runs** (`canControlVideos` is set in an `$effect`), because without JS it can't do anything. Without JS the videos don't play anyway: there is no `autoplay` attribute, so only the image is shown.
- **Reduced motion**: `videosPaused` starts as `true` and the `$effect` only sets it to `false` when the visitor doesn't prefer reduced motion. So videos never start for those visitors, and they can still choose to play them with the button.

## Accessibility checklist

- [x] Filter is a native radio group with a (visually hidden) `legend`
- [x] Visible focus on the filter labels and the cards
- [x] Touch targets of at least 44px
- [x] Main link of a project has the project title as its name, the GitHub link has "GitHub repository of" + the title
- [x] Screen readers hear that project links open in a new tab
- [x] Title and description are read on every screen size
- [x] Native scrolling: keyboard, zoom and assistive technology keep working
- [x] No motion with `prefers-reduced-motion: reduce`
- [x] Works without JavaScript and without modern CSS
- [x] Counter and details panel are decorative (`aria-hidden`), no announcements while scrolling
- [x] Videos are muted, can be paused with a button (WCAG 2.2.2) and don't start with reduced motion

## Settings to tweak

| What | Where |
| --- | --- |
| Smallest scale at the edges | `edgeScale` in `stack-carousel.js` and `scale(.72)` in the `project-scale` keyframes |
| When the text goes next to the image | `@container (min-width: 48rem)` in `Projects.svelte` |
| Width of the images on wide screens (the text gets the rest) | `--project-image-width` in `:root` in `app.css` |
| Space between text and images | `--project-gap` in `:root` in `app.css` |
| Size of the title in the details panel | `* .14` in `.project-details-title` in `Projects.svelte`. Higher means bigger, but check that the longest word still fits |
| Fade between projects in the details panel | `in:fade={{ duration: 300 }}` in `Projects.svelte` |
| Snap strength | `scroll-snap-type` in `app.css` (`proximity` or `mandatory`) |
| How much of a video must be on screen before it plays | `threshold: 0.25` in `autoplay-video.js` |
