<script>
    import { fade } from 'svelte/transition';
    import ArrowIcon from '$lib/components/ArrowIcon.svelte';
    import { stackCarousel } from '$lib/stack-carousel.js';
    import { autoplayVideo } from '$lib/autoplay-video.js';

    let { projects } = $props();

    const hasPersonalProjects = $derived(projects.some(({ category }) => category === 'personal'));
    const hasVideos = $derived(projects.some(({ video }) => video));

    // the pause button only works with JS, so it's only shown once JS runs
    let canControlVideos = $state(false);
    // paused until JS knows whether the visitor prefers reduced motion
    let videosPaused = $state(true);

    $effect(() => {
        canControlVideos = true;
        videosPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    // { index, total, projectIndex } of the project in the middle of the screen, set by stack-carousel.js
    let active = $state(null);

    const formatNumber = (number) => String(number).padStart(2, '0');

    // how wide the project images are shown, so the browser can pick a width from the srcset (--project-image-width is 55cqi)
    const sizes = '(min-width: 48rem) 55vw, 100vw';
</script>

<section id="projects" class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">Projects</h2>

    <div class="project-toolbar">
        <fieldset class="switch">
            <!-- still read by screen readers, the buttons speak for themselves visually -->
            <legend class="visually-hidden">Show projects</legend>
            <label>
                <input type="radio" name="project-category" value="all" checked>
                All
            </label>
            <label>
                <input type="radio" name="project-category" value="school">
                School
            </label>
            <label>
                <input type="radio" name="project-category" value="personal">
                Personal
            </label>
        </fieldset>

        {#if hasVideos && canControlVideos}
            <!-- WCAG 2.2.2: moving video that plays longer than 5 seconds must be pausable -->
            <!-- the text says what the button does, so no aria-pressed: "Play videos, pressed" would be confusing -->
            <button
                type="button"
                class="pill project-video-toggle"
                onclick={() => (videosPaused = !videosPaused)}
            >
                {videosPaused ? 'Play videos' : 'Pause videos'}
            </button>
        {/if}

        {#if active}
            <!-- visual only: screen readers already hear "list, 8 items" and the position in the list -->
            <p class="project-counter" aria-hidden="true">
                {formatNumber(active.index + 1)} / {formatNumber(active.total)}
            </p>
        {/if}
    </div>

    <div class="project-stage">
        {#if active}
            {@const { title, description, live, github } = projects[active.projectIndex]}
            <!-- visual only: screen readers and the keyboard get the same title, description and links from the card itself -->
            <div class="project-details" aria-hidden="true">
                <div class="project-details-content">
                    {#key active.projectIndex}
                        <div in:fade={{ duration: 300 }}>
                            <!-- tabindex -1: clickable with the mouse, but no duplicate stop for the keyboard -->
                            <a class="project-details-link" href={live ?? github} target="_blank" rel="noopener" tabindex="-1">
                                <p class="project-details-title">{title}</p>
                                <p>{description}</p>
                            </a>
                            <a class="project-github" href={github} target="_blank" rel="noopener" tabindex="-1">GitHub <ArrowIcon /></a>
                        </div>
                    {/key}
                </div>
            </div>
        {/if}

        <ol class="project-list" {@attach (list) => stackCarousel(list, (newActive) => (active = newActive))}>
            {#each projects as { title, description, live, github, image, video, width, height, category }}
                <li class="project-card" data-category={category}>
                    <!-- the browser takes the first format it supports, in the width that fits: AVIF, then WebP, then the JPG or PNG of the img -->
                    <!-- sizes: full width on small screens, 55% next to the text when the stage is 48rem or wider -->
                    <!-- with a video this is its still: shown without JS, with reduced motion and while loading -->
                    <picture>
                        <source type="image/avif" srcset={image.sources.avif} {sizes}>
                        <source type="image/webp" srcset={image.sources.webp} {sizes}>
                        <img class="project-media" src={image.img.src} alt="" {width} {height} loading="lazy">
                    </picture>
                    {#if video}
                        <!-- lies on top of the image in the same grid cell. No poster: a poster can't be responsive, so
                             mobile would load a 1600px image. Without poster the video stays transparent until it plays -->
                        <!-- decorative like the images: muted, no controls, the title is the link -->
                        <video
                            class="project-media"
                            src={video}
                            {width}
                            {height}
                            muted
                            loop
                            playsinline
                            preload="none"
                            aria-hidden="true"
                            {@attach (element) => autoplayVideo(element, videosPaused)}
                        ></video>
                    {/if}
                    <!-- a new tab can be disorienting, so screen readers hear it beforehand -->
                    <h3><a href={live ?? github} target="_blank" rel="noopener">{title} <span class="visually-hidden">(opens in a new tab)</span></a></h3>
                    <p>{description}</p>
                    <!-- the visually hidden part tells the links apart when screen readers list all links on the page -->
                    <a class="project-github" href={github} target="_blank" rel="noopener">GitHub <span class="visually-hidden">repository of {title} (opens in a new tab)</span> <ArrowIcon /></a>
                </li>
            {/each}
        </ol>
    </div>

    {#if !hasPersonalProjects}
        <!-- hidden by default, only shown by CSS when "Personal" is chosen -->
        <p class="project-empty" hidden>No personal projects yet, check back soon.</p>
    {/if}
</section>

<style>
#projects{
    /* straight against the hero, which sits at the bottom of the first screen */
    margin-top: 0;
    /* the carousel goes edge to edge, the parts inside get --page-padding themselves */
    padding-inline: 0;

    h2{
        margin-inline: var(--page-padding);
    }

    /* the card and the details panel both have this link */
    .project-github{
        /* 44px touch target */
        min-height: 2.75rem;
        display: inline-flex;
        align-items: center;
        gap: .25rem;

        /* no underline on hover like the other links (app.css), the arrow moves instead */
        &::after{
            content: none;
        }

        &:focus-visible{
            outline: 3px solid var(--color-text);
            outline-offset: 2px;
        }
    }

    .project-toolbar{
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* on small screens the video button and counter go to a second line when they don't fit */
        flex-wrap: wrap;
        gap: .5rem;
        padding: .75rem var(--page-padding);
        background-color: var(--color-glass);
    }

    .project-video-toggle{
        /* pushes the button and the counter to the right */
        margin-inline-start: auto;
    }

    .project-counter{
        font-family: 'ibm', serif;
        font-size: 1.25rem;
        /* all digits the same width, so the counter doesn't wiggle */
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    .project-stage{
        /* the cards and the details respond to the width of the stage, not the screen */
        container-type: inline-size;
        /* .project-details is placed over the left side of the list */
        position: relative;
    }

    /* only shown on wide screens, see the container query */
    .project-details{
        display: none;
    }

    .project-list{
        /* stack-carousel.js measures the cards from the top of the list */
        position: relative;

        /* JS moves and scales the cards, from the right top so they stay aligned right */
        /* :global because Svelte can't see that JS adds data-enhanced, it would remove this rule */
        &:global([data-enhanced]) .project-card{
            transform-origin: right top;
            will-change: transform;
        }
    }

    /* mobile: only the image, the text is still there for screen readers */
    .project-card{
        position: relative;
        display: grid;
        /* settle a card in the middle of the screen when you stop scrolling near it */
        scroll-snap-align: center;
        /* timeline that runs while the card scrolls through the screen, used by the image and text */
        view-timeline: --project-card block;

        /* no box of its own, so the img inside is the grid item, just like the video */
        picture{
            display: contents;
        }

        .project-media{
            /* own aspect ratio, from the width and height attributes */
            display: block;
            width: 100%;
            height: auto;
            object-fit: cover;
            /* same cell, so a video lies exactly on top of its image */
            grid-area: 1 / 1;
            /* shrink towards the right edge, so the carousel is aligned right */
            transform-origin: right center;
        }

        h3{
            /* invisible, but laid over the whole card so the link is the click and focus area */
            position: absolute;
            inset: 0;
            opacity: 0;
            font-size: clamp(1.5rem, 4cqi, 3rem);
            line-height: 1.1;
            /* long words may never push into the image column */
            hyphens: auto;
            overflow-wrap: break-word;

            a{
                /* stretch the link over the whole card, so the image is clickable too */
                position: static;

                &::before{
                    content: '';
                    position: absolute;
                    inset: 0;
                }
            }
        }

        p{
            /* visually hidden, still read by screen readers */
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
            max-width: 60ch;
            font-size: 1rem;
            line-height: 1.5;
        }

        /* mobile only shows the image, so the GitHub link lies on it, above the stretched link of the title */
        .project-github{
            position: absolute;
            inset-block-end: .5rem;
            inset-inline-end: .5rem;
            z-index: 1;
            padding-inline: .75rem;
            /* images can have any color, the background keeps the text readable */
            background-color: var(--color-background);
            border-radius: var(--radius-pill);
        }

        /* focus ring on the image, the same area as the clickable link (the h3 itself can be invisible) */
        &:has(h3 a:focus-visible) .project-media{
            outline: 3px solid var(--color-primary);
            outline-offset: -3px;
        }
    }

    /* text next to the image, only when there is room for both */
    @container (min-width: 48rem){
        /* with JS: one fixed panel in the middle of the screen, showing the project in the middle */
        .project-details{
            display: block;
            position: absolute;
            inset-block: 0;
            inset-inline-start: 0;
            z-index: 1;
            width: calc(var(--page-padding) + var(--project-text-width));
            padding-inline-start: var(--page-padding);
            /* clicks go through to the card link underneath */
            pointer-events: none;
        }

        .project-details-content{
            /* sticks while the list scrolls by, with the text in the middle of the screen */
            position: sticky;
            top: 0;
            height: 100svh;
            display: grid;
            align-content: center;

            a{
                /* the panel lets clicks through, only the text and the GitHub link are clickable */
                pointer-events: auto;
            }

            .project-details-link{
                display: block;
                width: fit-content;
            }

            p{
                max-width: 60ch;
                line-height: 1.5;
            }

            .project-details-title{
                margin-bottom: .75rem;
                font-family: 'ibm', serif;
                /* follows the text column: a long word like "Frankendael" (about 6em wide) still fits on one line */
                font-size: clamp(1.5rem, calc(var(--project-text-width) * .14), 4.5rem);
                line-height: 1.05;
                /* safety net for even longer words: hyphenate, and break if that's not enough */
                hyphens: auto;
                overflow-wrap: break-word;
            }
        }

        .project-card{
            /* text on the left, image on the right edge */
            grid-template-columns: minmax(0, 1fr) var(--project-image-width);
            grid-template-rows: 1fr auto auto;
            column-gap: var(--project-gap);
            padding-inline-start: var(--page-padding);

            .project-media{
                grid-column: 2;
                grid-row: 1 / -1;
            }

            /* the stretched link only covers the image column, not the empty space next to it */
            h3 a::before{
                inset-inline-start: auto;
                width: var(--project-image-width);
            }
        }

        /* without JS the text sits next to its own image, with JS it stays hidden and .project-details shows it */
        .project-list:not([data-enhanced]) .project-card{
            h3{
                position: static;
                opacity: 1;
                align-self: end;
            }

            p{
                position: static;
                width: auto;
                height: auto;
                overflow: visible;
                clip-path: none;
                white-space: normal;
                padding-block: .5rem 1rem;
            }

            .project-github{
                position: static;
                grid-column: 1;
                justify-self: start;
                margin-bottom: 2rem;
                /* next to the image it needs no background of its own */
                padding-inline: 0;
                background: none;
            }
        }

        /* with JS the panel shows this link, the one in the card only appears for the keyboard, on top of the image */
        .project-list:global([data-enhanced]) .project-github:not(:focus-visible){
            clip-path: inset(50%);
            opacity: 0;
        }
    }

    /* carousel: the card in the middle of the screen is big, cards at the edges shrink */
    @media (prefers-reduced-motion: no-preference) {
        @supports (animation-timeline: view()) {
            /* fallback without JS, with JS the cards are scaled by stack-carousel.js */
            .project-list:not([data-enhanced]) .project-card .project-media{
                animation: project-scale linear both;
                animation-timeline: --project-card;
            }

            /* only fade the text when it is visible: not on mobile, and not when .project-details shows it */
            @container (min-width: 48rem){
                .project-list:not([data-enhanced]) .project-card h3,
                .project-list:not([data-enhanced]) .project-card p,
                .project-list:not([data-enhanced]) .project-card .project-github{
                    animation: project-fade linear both;
                    animation-timeline: --project-card;
                }
            }
        }
    }

    /* filter: hide the cards that don't match the chosen category */
    &:has(input[value="school"]:checked) .project-card:not([data-category="school"]),
    &:has(input[value="personal"]:checked) .project-card:not([data-category="personal"]){
        display: none;
    }

    &:has(input[value="personal"]:checked) .project-empty{
        display: block;
        padding: 2rem var(--page-padding);
    }
}

/* 0% = card enters at the bottom, 50% = card in the middle, 100% = card leaves at the top */
@keyframes project-scale{
    0%{
        transform: scale(.72);
        animation-timing-function: ease-in-out;
    }
    50%{
        transform: scale(1);
        animation-timing-function: ease-in-out;
    }
    100%{
        transform: scale(.72);
    }
}

@keyframes project-fade{
    0%, 25%{
        opacity: 0;
    }
    40%, 60%{
        opacity: 1;
    }
    75%, 100%{
        opacity: 0;
    }
}
</style>
