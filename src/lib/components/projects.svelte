<script>
    import { stackCarousel } from '$lib/stack-carousel.js';

    let { projects } = $props();

    const hasPersonalProjects = $derived(projects.some(({ category }) => category === 'personal'));
</script>

<section id="projects" class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">Projects</h2>

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

    <ol class="project-list" {@attach stackCarousel}>
        {#each projects as { title, description, href, image, width, height, category }}
            <li class="project-card" data-category={category}>
                <img src={image} alt="" {width} {height} loading="lazy">
                <h3><a {href}>{title}</a></h3>
                <p>{description}</p>
            </li>
        {/each}
    </ol>

    {#if !hasPersonalProjects}
        <!-- hidden by default, only shown by CSS when "Personal" is chosen -->
        <p class="project-empty" hidden>No personal projects yet, check back soon.</p>
    {/if}
</section>

<style>
#projects{
    /* same side padding as the other sections, but the carousel goes edge to edge */
    --_pad: clamp(.5rem, calc(.5rem + (100vw - 375px) * 2.5rem / 1065px), 3rem);

    padding-inline: 0;

    h2{
        margin-inline: var(--_pad);
    }

    .project-filter{
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        gap: .5rem;
        padding: .75rem var(--_pad);
        border: none;
        background: white;

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
            --_background: white;
            --_color: black;

            /* 44px touch target */
            min-height: 2.75rem;
            display: inline-flex;
            align-items: center;
            padding-inline: 1rem;
            border: 2px solid blue;
            border-radius: 2rem;
            background: var(--_background);
            color: var(--_color);
            cursor: pointer;
            transition: background .2s, color .2s;

            &:has(input:checked){
                --_background: blue;
                --_color: white;
            }

            /* the input is still there for keyboard and screen readers, the label shows the focus */
            &:has(input:focus-visible){
                outline: 3px solid black;
                outline-offset: 2px;
            }

            input{
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }
        }
    }

    .project-list{
        /* the cards respond to the width of the list, not the screen */
        container-type: inline-size;
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

        img{
            /* own aspect ratio, from the width and height attributes */
            width: 100%;
            height: auto;
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

        &:has(a:focus-visible){
            outline: 3px solid blue;
            outline-offset: -3px;
        }
    }

    /* text next to the image, only when there is room for both */
    @container (min-width: 48rem){
        .project-card{
            /* text on the left, image on the right edge */
            grid-template-columns: minmax(16rem, 24rem) minmax(0, 1fr);
            grid-template-rows: 1fr auto;
            column-gap: 2rem;
            padding-inline-start: var(--_pad);

            img{
                grid-column: 2;
                grid-row: 1 / -1;
            }

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
            .project-list:not([data-enhanced]) .project-card img{
                animation: project-scale linear both;
                animation-timeline: --project-card;
            }

            /* only fade the text when it is visible, on mobile it has to stay invisible */
            @container (min-width: 48rem){
                .project-card h3,
                .project-card p{
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
        padding: 2rem var(--_pad);
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
