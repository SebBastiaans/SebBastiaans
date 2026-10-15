<script>
    import Hero from '$lib/components/hero.svelte';
    import Nav from '$lib/components/nav.svelte';
    import Biography from '$lib/components/biography.svelte';
    import Projects from '$lib/components/projects.svelte';
    import Contact from '$lib/components/contact.svelte';
</script>

<div class="marquee">
    <div class="marquee__inner">
        <h1>Portfolio of Seb Bastiaans</h1>
    </div>
</div>

<Hero />

<Nav />

<Biography />

<Projects />

<Contact />

<style>
h1{
    --stretch: clamp(.5, calc(1.5 - 0.5 * (100vw - 375px) / 825px), 1.5);
    @media (prefers-reduced-motion: reduce) {
        transform: scaleY(var(--stretch));
    }
    transform-origin: top;
    /* grows with the screen, but never bigger than 7rem */
    font-size: min(10vw, 7rem);
    white-space: nowrap;
    width: max-content;

    @media (prefers-reduced-motion: no-preference) {
        @supports (animation-timeline: view()) {
            animation-timeline: view();
            animation-range: entry 100lvh exit 0%;
            animation-name: extended-animation;
            animation-fill-mode: forwards;
            /* min() so it doesn't move right when the h1 is narrower than the screen */
            --translate: min(0px, calc(-100% + 100vw - 2 * var(--pad)));
        }
    }
}

.marquee{
    /* same padding as the sections */
    --pad: clamp(.5rem, calc(.5rem + (100vw - 375px) * 2.5rem / 1065px), 3rem);
    padding-inline: var(--pad);
    width: 100%;
    height: clamp(10lvh, calc(10lvh + (40lvh - 10lvh) * (100vw - 375px) / 1065px), 40lvh);
    overflow: clip;

    .marquee__inner{
        width: max-content;
        position: sticky;
        top: 0;
    }
}

@keyframes translate-to{
    from{
        transform: translateX(0);
    }
    to{
        transform: translateX(var(--translate));
    }
}

@keyframes extended-animation {
  from {
    font-weight: 300;
    transform: translateX(0);
  }
  to {
    font-weight: 900;
    transform: translateX(var(--translate));
    color: blue;
  }
}
</style>
