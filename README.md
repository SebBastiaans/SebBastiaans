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

## Conventions

This project follows the [FDND code conventions](fdnd-code-conventies.md).
