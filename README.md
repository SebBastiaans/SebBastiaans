# Portfolio of Seb Bastiaans

My personal portfolio, live at [sebbastiaans.com](https://sebbastiaans.com). Built with SvelteKit as a static site: mobile first, accessible and progressively enhanced.

## Getting started

```bash
npm install
npm run dev      # development server on http://localhost:5173
npm run build    # static site in /build
npm run preview  # preview the build
```

## Structure

```
src/
├── app.css                     global styles, fonts and scroll snapping
├── routes/
│   ├── +layout.js              prerenders every page (adapter-static)
│   ├── +page.server.js         project data, passed to the page at build time
│   └── +page.svelte            the home page, puts the components together
└── lib/
    ├── stack-carousel.js       JS enhancement for the project carousel
    ├── autoplay-video.js       plays project videos only while they are on screen
    └── components/
        ├── Header.svelte       scroll-driven title marquee
        ├── Hero.svelte
        ├── Nav.svelte
        ├── Biography.svelte
        ├── MusicalText.svelte  text that bounces on the beat of a song
        ├── Projects.svelte     project filter and carousel
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
| JavaScript | Cards stack without gaps, like a real carousel, with a counter (`03 / 08`). On wide screens the title and description stay fixed in the middle of the screen and change with the project |

Reduced motion turns off all scaling.

➡️ **[Read how the project carousel works](docs/project-carousel.md)**

### Hero

The profile photo in [`Hero.svelte`](src/lib/components/Hero.svelte) is `position: sticky` and morphs while you scroll (square → M → E → circle), with a CSS scroll-driven animation on the `--hero` view timeline. Without support or with reduced motion it stays a normal square photo.

- The `<img>` sits outside `.hero`, so it isn't part of the flex layout and can lay on top of `.photo-slot`.
- A sticky element only sticks until the end of its parent. The photo's parent is `.page-start` in [`+page.svelte`](src/routes/+page.svelte), around header, hero and biography. So after morphing into a round icon, it scrolls along through biography and stops above projects.
- The photo has a negative `margin-bottom` of its own size (to lay on top of `.photo-slot`), so for sticky it counts as 0px high: its *top* would stop right at the edge of projects, and the icon would hang over it. `.page-start` has a `padding-bottom` of exactly the icon's size (`--profile-photo-size` × `--profile-icon-scale`), and a sticky element never moves into its parent's padding, so the icon stops above projects.
- `--profile-icon-scale` (`.12` in `app.css`) is used both by the end of the morph animation and by that padding, so they always match.
- `timeline-scope: --hero` on `body` (in `app.css`) lets the img use the `--hero` timeline of `.hero`, even though it isn't inside `.hero`.

### Musical text

In the biography you can play my favorite song, *What Goes Around...Comes Around* by Justin Timberlake, and the text bounces along on the beat. [`MusicalText.svelte`](src/lib/components/MusicalText.svelte) measures the bass of the song live with the Web Audio API, and the variable font Inter (weight 100 to 900) makes the weight change smoothly.

- The song is the 30 second preview from Apple. [`+page.server.js`](src/routes/+page.server.js) looks up its url at build time, with a link to the song in Apple Music next to the button.
- Two animations, with a switch next to the play button:
  - **Weight**: every letter gets bolder and taller on the kick, a few frames later than the one before it, so the beat rolls through the text like a wave.
  - **Equalizer**: every letter is a bar of an equalizer, like the lights on a studio panel: the first letter shows the deep bass, the last one the highest sounds, and every letter shoots up as loud as its band is. The letters are bolder, closer together and already a bit stretched. Inter has no height axis (only weight and optical size), so this is `scale` on the y-axis.
- On screens from 1024px wide it's a column on the right of the biography, aligned to the bottom and sticky at the bottom of the screen while the biography is in view.
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
	href: 'https://github.com/SebBastiaans/project',
	image: projectImage
	width: 2880, // real pixel size of the image
	height: 1984,
	category: 'school' // or 'personal'
}
```

On macOS you can find the image size with `sips -g pixelWidth -g pixelHeight image.png`.

Just add the PNG or JPG as it is, big is fine. `?enhanced` (from [`@sveltejs/enhanced-img`](https://svelte.dev/docs/kit/images)) makes small versions while building, see [Images and fonts](#images-and-fonts).

#### With a video instead of a photo

Add a `video` and a `poster` next to the `image`. The poster is shown as the first frame without JavaScript, with reduced motion and while the video loads. A poster can't be a `<picture>`, so it's one WebP made from the same image.

```js
import projectVideo from '$lib/assets/videos/project.mp4'
import projectPoster from '$lib/assets/pics/project.png?w=1600&format=webp'

{
	// …same as above
	image: projectImage, // a still from the video
	video: projectVideo,
	poster: projectPoster,
	width: 1920, // real pixel size of the video
	height: 1080
}
```

- Use an **MP4 (H.264)** without sound, so it plays in every browser. Keep it short and small: a few seconds and preferably under 5 MB.
- Make the poster image with the same size as the video, for example a screenshot of the first frame.
- On macOS you can find the video size with `mdls -name kMDItemPixelWidth -name kMDItemPixelHeight project.mp4`.

Videos play muted and on a loop, only while they are on screen. A "Pause videos" button appears in the bar above the projects as soon as there is at least one video. [More about videos](docs/project-carousel.md#videos).

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

**Fonts** are WOFF2, the compressed format for the web: about 70% smaller than TTF (Inter: 875 KB → 349 KB). Only the IBM Plex Serif weights the site uses are there: Light to Bold, no italics. To convert a new font: [`wawoff2`](https://www.npmjs.com/package/wawoff2), or an online converter.

## Conventions

This project follows the [FDND code conventions](fdnd-code-conventies.md).

All custom properties (colors, page padding, sizes) live in `:root` in [`src/app.css`](src/app.css), so there is one place to change them. Components only use them with `var()`.

Two global classes in `app.css` are shared by the components, so their styles only exist once:

- `.visually-hidden`: hidden, but still read by screen readers. For example the `legend` of the project filter and the animation switch.
- `.pill`: the round button with a border, at least 44px high. Used for the theme toggle, the play button, the "Pause videos" button and the labels of the project filter. A label with a checked radio button inside, or a button with `aria-pressed="true"`, gets the filled look.

Fonts, line height and text color are set once on `body` and inherited by everything. Links set them again: browsers give links their own color, and links in a heading (like the project titles) stay Inter.
