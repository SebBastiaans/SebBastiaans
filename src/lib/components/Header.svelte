<header class="site-header">
    <h1>Portfolio of Seb Bastiaans</h1>
</header>

<style>
.site-header{
    /* same padding as the sections */
    padding-inline: var(--page-padding);
    /* cqi in the h1 is the width inside this padding (without the scrollbar, unlike vw) */
    container-type: inline-size;
    overflow: clip;
}

h1{
    /* the title is about 11.4em wide in Roboto Flex Bold, so this makes it exactly as wide as the page */
    /* measured in the browser: width of the h1 / its font-size. Change it when the text or font changes */
    font-size: calc(100cqi / 11.4);
    /* Roboto Flex makes its letters wider at small sizes (optical size). Fixed on the display size,
       so the title is the same number of ems wide on every screen. Otherwise it's too wide on mobile */
    font-variation-settings: "opsz" 144;
    font-weight: bold;
    line-height: 1;
    color: var(--color-primary);
    white-space: nowrap;

    /* stretched vertically from the bottom, the margin makes room for the extra height above it */
    transform: scaleY(var(--header-title-stretch));
    transform-origin: bottom;
    margin-top: calc((var(--header-title-stretch) - 1) * 1em);

    /* while you scroll the first bit, the title shrinks back to scale 1 and turns from the primary color
       to the text color. The scroll distance is exactly
       the extra height, so the top of the title stays at the top of the screen. After that it scrolls away */
    @media (prefers-reduced-motion: no-preference) {
        @supports (animation-timeline: scroll()) {
            animation: header-title-shrink linear both;
            animation-timeline: scroll(root);
            animation-range: 0 calc((var(--header-title-stretch) - 1) * 1em);
        }
    }
}

@keyframes header-title-shrink {
    to {
        transform: scaleY(1);
        color: var(--color-text);
    }
}
</style>
