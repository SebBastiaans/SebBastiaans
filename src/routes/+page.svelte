<script>
    import Checkbox from '$lib/components/checkbox.svelte';
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
    font-size: 10vw;
    white-space: nowrap;
    width: max-content;

    @media (prefers-reduced-motion: no-preference) {
        @supports (animation-timeline: view()) {
            animation-timeline: view();
            animation-range: entry 100lvh exit 0%;
            animation-name: extended-animation;
            animation-fill-mode: forwards;
            --translate: calc(-100% + 100vw);
        }
    }
}

.marquee{
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
