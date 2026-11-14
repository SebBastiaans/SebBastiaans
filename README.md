# Portfolio of Seb Bastiaans

My personal portfolio, live at [sebbastiaans.com](https://sebbastiaans.com). Built with SvelteKit as a static site: mobile first, accessible and progressively enhanced.

## Getting started

```bash
npm install
npm run dev      # development server on http://localhost:5173
npm run build    # static site in /build
npm run preview  # preview the build
npm test         # tests of the tech stack data (node --test)
```

## Structure

```
src/
├── app.css                     global styles, fonts and scroll snapping
├── routes/
│   ├── +layout.js              prerenders every page (adapter-static)
│   ├── +layout.svelte          page <title>, meta description and favicon
│   ├── +page.server.js         project data, passed to the page at build time
│   └── +page.svelte            the home page, puts the components together inside <main> (footer and nav stay outside)
└── lib/
    ├── stack-carousel.js       JS enhancement for the project carousel
    ├── autoplay-video.js       plays project videos only while they are on screen
    ├── tech-stack.js           tech stack data: logo and level per technique, shapes of the tiles
    ├── tech-stack.test.js      tests for tech-stack.js (npm test)
    ├── test-setup.js           lets the tests (plain Node) understand $lib/ and ?raw, like Vite
    ├── assets/logos/           own svg logos for the tech stack (one color)
    └── components/
        ├── Header.svelte       full width title, stretched until you scroll
        ├── Hero.svelte         intro, skills and the profile photo
        ├── Nav.svelte
        ├── Biography.svelte
        ├── MusicalText.svelte  text that bounces on the beat of a song
        ├── ArrowIcon.svelte    arrow for links, moves on hover
        ├── Projects.svelte     project filter and carousel
        ├── TechStack.svelte    tech stack section: bento grid of logos, bigger tile = better mastered
        ├── Contact.svelte
        └── Footer.svelte       dark mode toggle
```

## Features

### Project carousel

A full width carousel of my projects, with a filter for school and personal projects. The project in the middle of the screen is full size and projects towards the edges shrink, while they stay glued together. Scrolling stays native: after the last project the page simply continues to the next section.

It is built in layers, so it works for everyone:

| Layer | What you get |
| --- | --- |
| HTML | A list of projects with a filter made of radio buttons |
| CSS | Full width cards, a working filter with `:has()`, text next to the image when it fits (container query) and scroll snapping |
| CSS scroll-driven animations | Cards scale with the scroll position |
| JavaScript | Cards stack without gaps, like a real carousel, with a counter (`03 / 08`). On wide screens the title, description and GitHub link stay fixed in the middle of the screen and change with the project |

Reduced motion turns off all scaling.

➡️ **[Read how the project carousel works](docs/project-carousel.md)**

### Header

The title in [`Header.svelte`](src/lib/components/Header.svelte) is exactly as wide as the page and starts stretched vertically (`--header-title-stretch` in `app.css`: 4× on a 375px screen, 2× on a 1440px screen). It starts in the primary color. While you scroll the first bit it shrinks back to scale 1 and turns into the text color, then it simply scrolls out of view.

- **Full width**: `font-size: calc(100cqi / 11.4)`. The title is about 11.4em wide in Roboto Flex Bold (measured in the browser). Roboto Flex has an optical size axis: the browser makes the letters wider at small font sizes, so on mobile the title was 11.8em and went off the screen. `font-variation-settings: "opsz" 144` fixes it on the display size, so the title is the same number of ems wide on every screen, and `cqi` is the width inside the header's padding. When the text changes, measure it again: width of the h1 ÷ its font-size.
- **Stretch**: `scaleY` with `transform-origin: bottom`, and a `margin-top` of the extra height so the stretched title doesn't overlap anything.
- **Shrink**: a CSS scroll-driven animation on `scroll(root)` to `scaleY(1)`. Its range is exactly the extra height (`(stretch - 1) * 1em`), so the top of the title stays at the top of the screen while it shrinks.
- Without support or with reduced motion the title stays stretched and in the primary color, and scrolls away normally.

### Hero

[`Hero.svelte`](src/lib/components/Hero.svelte) is a grid with the profile photo and two lists: the intro (who, where) and the skills.

- **From 800px**: two columns, `1fr 420px`. The intro and the skills are under each other on the left, the photo is on the right over the height of both lists (`grid-template-areas`).
- `grid-template-rows: auto 1fr`: the photo is taller than the lists, so the second row gets all the extra height. Otherwise both rows would grow and the skills would end up halfway down instead of right under the intro. The `gap` is 2rem.
- **Against projects**: `.page-start` in [`+page.svelte`](src/routes/+page.svelte) (header and hero) is at least as tall as the screen, a flex column with `justify-content: space-between`. The header is at the top, the hero at the bottom, and the space that's left goes in between. `#projects` has no `margin-top`, so it starts right under the hero.
- The photo column is a fixed 420px and the img fills it. With an `auto` column, the percentage in `--profile-photo-size` would make the photo smaller than 420px.
- **Below 800px**: one column in the order of the HTML: photo, intro, skills.

### Tech stack

A section between projects and contact ([`TechStack.svelte`](src/lib/components/TechStack.svelte)) with a playful bento grid of the logos of the techniques I work with. The bigger the tile, the better I master it.

➡️ **[Read how the tech stack works and how to add a technique](docs/tech-stack.md)**
- **Text size**: `--hero-text-size` in `app.css` grows with the screen, from 1rem on a 375px screen to 2rem on a 1440px screen.
- **Text lights up while you read**: while you scroll, the text lights up letter by letter from left to right, line by line. CSS only, no JavaScript and no span per letter:
  - The text of every `li` is in a `<span class="line">` with a transparent `color` and two backgrounds that are only painted inside the letters (`background-clip: text`): the dim text (15% of the text color) and on top the lit text, whose `background-size` grows from 0% to 100%.
  - The lit layer fades out at its right end (`--edge`, 1.5em), so the letters light up one by one instead of being cut in half.
  - The span is inline: when the text wraps, its background runs on over the next line as if all lines were one long line (`box-decoration-break: slice`). So the light goes to the end of a line and then continues on the next one.
  - The items light up one after another, from top to bottom. All of them share one timeline, the scroll of the page (`scroll(root)`). The first `--read-distance` (40vh) of scrolling is split into `--lines` (7) equal steps. Every `li` has its place over both lists as `--i` (0 to 6, inline in the HTML) and lights up between `--i` and `--i + 1` steps, so an item only starts when the one above it is done. When you add or remove an item, change the `--i` numbers and `--lines`.
  - Every item gets the same scroll distance, so a long item that wraps over 3 lines lights up faster per line than a short one.
  - Without support or with reduced motion the text is just visible in the normal color.

### Musical text

In the biography you can play my favorite song, *What Goes Around...Comes Around* by Justin Timberlake, and the text bounces along on the beat. [`MusicalText.svelte`](src/lib/components/MusicalText.svelte) measures the bass of the song live with the Web Audio API, and the variable font Inter (weight 100 to 900) makes the weight change smoothly.

- The song is the 30 second preview from Apple. [`+page.server.js`](src/routes/+page.server.js) looks up its url at build time, with a link to the song in Apple Music next to the button.
- Two animations, with a switch next to the play button:
  - **Weight**: every letter gets bolder and taller on the kick, a few frames later than the one before it, so the beat rolls through the text like a wave.
  - **Equalizer**: every letter is a bar of an equalizer, like the lights on a studio panel: the first letter shows the deep bass, the last one the highest sounds, and every letter shoots up as loud as its band is. The letters are bolder, closer together and already a bit stretched. Inter has no height axis (only weight and optical size), so this is `scale` on the y-axis.
- It's below the text, aligned to the bottom of the biography, and sticky at the bottom of the screen while the biography is in view.
- The text is always one line and gets smaller when the page isn't wide enough: `font-size: min(5rem, 100cqi / var(--text-ems))`, where JS measures the width of the text in em once.
- **Without JS** the play button isn't shown and the text stays thin and still. Without internet while building, the site builds without the song.
- **Reduced motion**: the song still plays, but the text doesn't move.
- Screen readers read the text in one go: the letters are `aria-hidden` and a visually hidden copy holds the whole text.

➡️ **[Read how the musical text works](docs/musical-text.md)**

### Navigation

A fixed bar at the bottom of the screen ([`Nav.svelte`](src/lib/components/Nav.svelte)) with a see-through background (`--color-glass`). It slides away when you scroll down and comes back when you scroll up.

**The URL follows the scroll position.** While you scroll, the URL changes to the section you are in (`/#biography`, `/#projects`, `/#contact`), so a copied link opens at the same spot. Above the first section (header and hero) the hash is removed.

- An `IntersectionObserver` watches every `section[id]` with `rootMargin: '-50% 0px -50% 0px'`: that shrinks the viewport to a thin line in the middle of the screen, and the section crossing that line is the current one.
- It uses `replaceState` and not `pushState`, so scrolling doesn't add steps to the back button, and changing the hash this way doesn't make the page jump.
- It's the `replaceState` from `$app/navigation`: SvelteKit keeps its own history state, and calling `history.replaceState` directly would get in its way.
- The URL only changes when the section changes, not on every scroll event.
- Without JS nothing changes: the nav links still go to `#biography` and so on.
- Clicking a nav link scrolls smoothly to the section: `scroll-behavior: smooth` on `html` in `app.css`, only inside `prefers-reduced-motion: no-preference`, so with reduced motion it jumps straight there.

On hover and keyboard focus a link gets a glow behind it: a `::before` that is 3rem wider than the link on both sides (`inset-inline: -3rem`), with `radial-gradient(closest-side, var(--color-background) 50%, transparent)`. `closest-side` makes an ellipse that touches the edges of this wide box, so it's a lying oval. It is solid up to halfway, right behind the text, and fades out to the nav from there. The nav has `overflow: clip`, so the glow of the outer links stops at the screen edge. The edge is `transparent` and not `--color-glass`, because the nav's own background already shows through there: two layers of glass would make a visible edge. A gradient can't transition, so the `::before` fades in with `opacity`. `z-index: -1` puts it behind the text but in front of the nav background, because the fixed nav with its `z-index` is its own stacking context.

### Dark mode

The site follows the color scheme of the device (`prefers-color-scheme`), and the "Dark mode" button in the footer lets visitors choose themselves. Dark mode turns the colors around: a near black background, broken white text (`#f3efe6`, softer than pure white) and a light pink accent (`#ffb3c7`) instead of blue.

- All colors are tokens in `:root` in [`src/app.css`](src/app.css), written as `light-dark(light value, dark value)`. The browser picks one based on `color-scheme`, so every color is defined once and the components don't need to know about dark mode at all.
- `color-scheme: light dark` on `:root` follows the device, and also makes the browser's own parts, like scrollbars, follow along.
- `light-dark()` only works for colors, so `--line-height` uses a `prefers-color-scheme` media query and the `data-theme` rules instead.

#### Theme toggle

The button in [`Footer.svelte`](src/lib/components/Footer.svelte) sets `data-theme="light"` or `"dark"` on `<html>`. In `app.css`, `:root[data-theme="dark"]` sets `color-scheme: dark` (and the light one `light`), which overrides the device setting, so every `light-dark()` color switches along.

- **Remembered**: the choice is saved in `localStorage`. Until a visitor chooses, the site follows the device, also when the device changes.
- **No flash of the wrong colors**: a small inline script in the `<head>` of [`src/app.html`](src/app.html) sets `data-theme` from `localStorage` before the page is drawn. In the component it would come too late, after the first paint.
- **The text comes from CSS**: both texts are in the button, and the CSS hides the one that doesn't fit with `display: none`, using the same conditions as `color-scheme` in `app.css` (`[data-theme]`, and `prefers-color-scheme` when nothing is chosen). So JS doesn't need to keep track of the theme or listen to changes of the device. Only on click, JS looks up the current theme to switch to the other one.
- **Accessible**: the text says what the button does: "Dark mode" in light mode, "Light mode" in dark mode. `display: none` also takes the hidden text out of the name screen readers hear. Because the label describes the action, there is no `aria-pressed`: together with a changing label, screen readers would announce something confusing like "Light mode, pressed". The ☾ / ☀ icon matches the text and is `aria-hidden`. 44px touch target and a visible focus ring.
- **Without JS** the button isn't shown (it couldn't do anything) and the site follows the device.
- `try/catch` around `localStorage`, because it can be blocked (for example in some private modes): then the choice simply isn't remembered.
- The social media icons in [`Contact.svelte`](src/lib/components/Contact.svelte) are not `<img>`s but a `<span>` with the SVG as a CSS `mask-image` and `background-color: currentColor`. The SVG only gives the shape, the color is the text color, so the icons follow dark mode (an `<img>` can't use the text color). The `url()` needs quotes, because Vite inlines small SVGs as data URLs that contain `'`. The icons are `aria-hidden`, because the name next to them is already the link text.
- Dark mode gets a slightly bigger line height (`--line-height`: 1.5 instead of 1.4), because light text on a dark background looks thinner and tighter.
- Every text and background combination passes WCAG AAA (at least 7:1): broken white on the background is 16.3:1, pink on the background 11.2:1.

To test the device setting: DevTools → Rendering → Emulate CSS media feature `prefers-color-scheme: dark`, or switch your system to dark mode. To reset a choice made with the button: remove `theme` in DevTools → Application → Local storage.

### Adding a project

Import the image at the top of [`src/routes/+page.server.js`](src/routes/+page.server.js) with `?enhanced`, and add an object to the `projects` array:

```js
import projectImage from '$lib/assets/pics/project.png?enhanced&w=2400;1600;1080;640'

{
	title: 'Project name',
	description: 'One or two sentences about the project.',
	live: 'https://project.example.com/', // optional, leave out when there is no live site
	github: 'https://github.com/SebBastiaans/project',
	image: projectImage,
	width: 2880, // real pixel size of the image
	height: 1984,
	category: 'school' // or 'personal'
}
```

The card links to `live`, or to `github` when there is no live site. All project links open in a new tab. The GitHub link is always shown as well: under the description on wide screens, and on the image on small screens.

On macOS you can find the image size with `sips -g pixelWidth -g pixelHeight image.png`.

Just add the PNG or JPG as it is, big is fine. `?enhanced` (from [`@sveltejs/enhanced-img`](https://svelte.dev/docs/kit/images)) makes small versions while building, see [Images and fonts](#images-and-fonts).

#### With a video instead of a photo

Add a `video` next to the `image`. The image is the still of the video: it lies under the video and is shown without JavaScript, with reduced motion and while the video loads. There is no `poster`: a poster can't be a `<picture>`, so mobile would load a big image it doesn't need.

```js
import projectVideo from '$lib/assets/videos/project.mp4'

{
	// …same as above
	image: projectImage, // a still from the video
	video: projectVideo,
	width: 1920, // real pixel size of the video
	height: 1080
}
```

- Use an **MP4 (H.264)** without sound, so it plays in every browser. Keep it short and small: a few seconds and preferably under 5 MB.
- Make the image the same size as the video, for example a screenshot of the first frame.
- On macOS you can find the video size with `mdls -name kMDItemPixelWidth -name kMDItemPixelHeight project.mp4`.

Videos play muted and on a loop, only while they are on screen. A "Pause videos" button appears in the bar above the projects as soon as there is at least one video, it changes to "Play videos" while they are paused. [More about videos](docs/project-carousel.md#videos).

## Images and fonts

**Images** are imported with `?enhanced` from [`@sveltejs/enhanced-img`](https://svelte.dev/docs/kit/images) (plugin in [`vite.config.js`](vite.config.js)). While building it makes AVIF and WebP versions in a few widths, and a JPG fallback (PNG when the image is transparent). The import gives an object, which the components put in a `<picture>`:

```svelte
<picture>
	<source type="image/avif" srcset={image.sources.avif} {sizes}>
	<source type="image/webp" srcset={image.sources.webp} {sizes}>
	<img src={image.img.src} alt="" {width} {height} loading="lazy">
</picture>
```

- The browser takes the first `<source>` with a format it supports, and from its `srcset` the width that fits `sizes` and the pixel density of the screen. Browsers without AVIF or WebP get the `<img>`.
- The `<picture>` has `display: contents`: it has no box of its own, so for the layout, sticky and the CSS the `<img>` still sits where it was.
- The originals stay in `src/lib/assets/pics`, the small versions only exist in the build. The first build after adding an image is slower, because AVIF takes a while.
- Result: the project images went from up to 6 MB per PNG to 10 to 70 KB per AVIF. A full visit on a sharp laptop screen loads about 875 KB of images and fonts.

**Fonts** are WOFF2, the compressed format for the web: about 70% smaller than TTF (Inter: 875 KB → 349 KB). Only the IBM Plex Serif weights the site uses are there: Light to Bold, no italics.

The headings (`h1` to `h5`) use **Roboto Flex**, with regular **Roboto** as the fallback: `font-family: 'roboto-flex', 'roboto', sans-serif`. Both are variable fonts, so one file covers every weight and width. Roboto Flex is the biggest font on the site (1.7 MB TTF → 747 KB WOFF2, it has 13 axes); Roboto is 488 KB → 221 KB. Body text stays IBM Plex Serif, links stay Inter.

To convert a new font: [`wawoff2`](https://www.npmjs.com/package/wawoff2), or an online converter.

## Conventions

This project follows the [FDND code conventions](fdnd-code-conventies.md).

All custom properties (colors, page padding, sizes, the rounding of buttons and switches) live in `:root` in [`src/app.css`](src/app.css), so there is one place to change them. Components only use them with `var()`.

Four global classes in `app.css` are shared by the components, so their styles only exist once:

- `.visually-hidden`: hidden, but still read by screen readers. For example the `legend` of the project filter and the animation switch.
- `.pill`: the round button with a border, at least 44px high. Used for the theme toggle, the play button and the "Pause videos" / "Play videos" button.
- `.arrow-icon`: the diagonal arrow in a link ([`ArrowIcon.svelte`](src/lib/components/ArrowIcon.svelte)), which moves in its own direction on hover and focus. Used for the Apple Music link and the GitHub links of the projects.
- `.switch`: a `fieldset` with 2 or 3 radio buttons in one pill, with a knob that slides behind the chosen option. Used for the project filter (All, School, Personal) and the animation switch of the musical text (Weight, Equalizer).
  - The knob is a `::before` as wide as one option: `(100% - padding) / --switch-options`. `--switch-options` is 2, or 3 when there is a third label (`:has(label:nth-of-type(3))`).
  - `translate: 100%` or `200%` moves the knob exactly one or two options to the right, when the second or third radio button is checked. With reduced motion it jumps instead of sliding.
  - The options are a grid with `grid-auto-columns: 1fr`, so every option is as wide as the widest one, and as wide as the knob.
  - The radio buttons are invisible but still there, so the arrow keys and screen readers work as usual. The label shows the focus.
  - It's radio buttons and not a `role="switch"`: a switch is on or off, this is a choice between options.

Fonts, line height and text color are set once on `body` and inherited by everything. Headings get Roboto Flex. Links set font and color again: browsers give links their own color, and links in a heading (like the project titles) stay Inter.
