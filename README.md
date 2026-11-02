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
        ├── header.svelte       scroll-driven title marquee
        ├── hero.svelte
        ├── nav.svelte
        ├── biography.svelte
        ├── projects.svelte     project filter and carousel
        └── contact.svelte
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

### Adding a project

Add an object to the `projects` array in [`src/routes/+page.server.js`](src/routes/+page.server.js):

```js
{
	title: 'Project name',
	description: 'One or two sentences about the project.',
	href: 'https://github.com/SebBastiaans/project',
	image: projectImage, // imported at the top of the file
	width: 2880, // real pixel size of the image
	height: 1984,
	category: 'school' // or 'personal'
}
```

On macOS you can find the image size with `sips -g pixelWidth -g pixelHeight image.png`.

#### With a video instead of a photo

Add a `video` next to the `image`. The image is still required: it is shown as the first frame (poster) without JavaScript, with reduced motion and while the video loads.

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
- Make the poster image with the same size as the video, for example a screenshot of the first frame.
- On macOS you can find the video size with `mdls -name kMDItemPixelWidth -name kMDItemPixelHeight project.mp4`.

Videos play muted and on a loop, only while they are on screen. A "Pause videos" button appears in the bar above the projects as soon as there is at least one video. [More about videos](docs/project-carousel.md#videos).

## Conventions

This project follows the [FDND code conventions](fdnd-code-conventies.md).

All custom properties (colors, page padding, sizes) live in `:root` in [`src/app.css`](src/app.css), so there is one place to change them. Components only use them with `var()`.
