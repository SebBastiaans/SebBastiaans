<header class="marquee">
    <div class="marquee__inner">
        <h1>Portfolio of Seb Bastiaans</h1>
    </div>
</header>

<style>
h1{
    @media (prefers-reduced-motion: reduce) {
        transform: scaleY(var(--header-title-stretch));
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
        }
    }
}

.marquee{
    /* same padding as the sections */
    padding-inline: var(--page-padding);
    width: 100%;
    height: clamp(10lvh, calc(10lvh + (40lvh - 10lvh) * (100vw - 375px) / 1065px), 40lvh);
    overflow: clip;

    .marquee__inner{
        width: max-content;
        position: sticky;
        top: 0;
    }
}

@keyframes extended-animation {
  from {
    font-weight: 300;
    transform: translateX(0);
  }
  to {
    font-weight: 900;
    transform: translateX(var(--header-title-translate));
    color: var(--color-primary);
  }
}
</style>
