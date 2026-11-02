<script>
    import { fade } from 'svelte/transition';
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
</script>

<section id="projects" class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">Projects</h2>

    <div class="project-toolbar">
        <fieldset class="project-filter">
            <legend>Show projects</legend>
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
            <button
                type="button"
                class="project-video-toggle"
                aria-pressed={videosPaused}
                onclick={() => (videosPaused = !videosPaused)}
            >
                Pause videos
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
            {@const { title, description, href } = projects[active.projectIndex]}
            <!-- visual only: screen readers and the keyboard get the same title, description and link from the card itself -->
            <div class="project-details" aria-hidden="true">
                <div class="project-details-content">
                    {#key active.projectIndex}
                        <!-- tabindex -1: clickable with the mouse, but no duplicate stop for the keyboard -->
                        <a {href} tabindex="-1" in:fade={{ duration: 300 }}>
                            <p class="project-details-title">{title}</p>
                            <p>{description}</p>
                        </a>
                    {/key}
                </div>
            </div>
        {/if}

        <ol class="project-list" {@attach (list) => stackCarousel(list, (newActive) => (active = newActive))}>
            {#each projects as { title, description, href, image, video, width, height, category }}
                <li class="project-card" data-category={category}>
                    {#if video}
                        <!-- decorative like the images: muted, no controls, the title is the link -->
                        <!-- the image is the poster: shown without JS, with reduced motion and while loading -->
                        <video
                            class="project-media"
                            src={video}
                            poster={image}
                            {width}
                            {height}
                            muted
                            loop
                            playsinline
                            preload="none"
                            aria-hidden="true"
                            {@attach (element) => autoplayVideo(element, videosPaused)}
                        ></video>
                    {:else}
                        <img class="project-media" src={image} alt="" {width} {height} loading="lazy">
                    {/if}
                    <h3><a {href}>{title}</a></h3>
                    <p>{description}</p>
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
    /* the carousel goes edge to edge, the parts inside get --page-padding themselves */
    padding-inline: 0;

    h2{
        margin-inline: var(--page-padding);
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
        background-color: rgba(255, 255, 255, 0.414);
    }

    .project-video-toggle{
        /* pushes the button and the counter to the right */
        margin-inline-start: auto;
        /* 44px touch target, same look as the filter */
        min-height: 2.75rem;
        padding-inline: 1rem;
        border: 2px solid var(--color-primary);
        border-radius: 2rem;
        background: var(--color-background);
        color: var(--color-text);
        font: inherit;
        cursor: pointer;
        transition: background .2s, color .2s;

        &[aria-pressed="true"]{
            background: var(--color-primary);
            color: var(--color-background);
        }

        &:focus-visible{
            outline: 3px solid var(--color-text);
            outline-offset: 2px;
        }
    }

    .project-counter{
        font-family: 'ibm', serif;
        font-size: 1.25rem;
        /* all digits the same width, so the counter doesn't wiggle */
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    .project-filter{
        display: flex;
        gap: .5rem;
        border: none;

        legend{
            /* still read by screen readers, the buttons speak for themselves visually */
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
        }

        label{
            /* 44px touch target */
            min-height: 2.75rem;
            display: inline-flex;
            align-items: center;
            padding-inline: 1rem;
            border: 2px solid var(--color-primary);
            border-radius: 2rem;
            background: var(--color-background);
            color: var(--color-text);
            cursor: pointer;
            transition: background .2s, color .2s;

            &:has(input:checked){
                background: var(--color-primary);
                color: var(--color-background);
            }

            /* the input is still there for keyboard and screen readers, the label shows the focus */
            &:has(input:focus-visible){
                outline: 3px solid var(--color-text);
                outline-offset: 2px;
            }

            input{
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }
        }
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

        .project-media{
            /* own aspect ratio, from the width and height attributes */
            display: block;
            width: 100%;
            height: auto;
            object-fit: cover;
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

        /* focus ring on the image, the same area as the clickable link (the h3 itself can be invisible) */
        &:has(a:focus-visible) .project-media{
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
                display: block;
                /* the panel lets clicks through, only the text itself is clickable */
                pointer-events: auto;
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
            grid-template-rows: 1fr auto;
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
                padding-block: .5rem 2rem;
            }
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
                .project-list:not([data-enhanced]) .project-card p{
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
