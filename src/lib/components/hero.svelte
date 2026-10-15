<script>
    import profilePhoto from '$lib/assets/pics/IMG_7841-face.png';
</script>

<!-- The img sits outside .hero so it can stay sticky over the whole page.
     .photo-slot keeps its place in the hero layout. -->
<img class="profile-photo" src={profilePhoto} alt="">

<div class="hero">
    <div class="photo-slot"></div>
    <ul class="intro">
        <li>Student Front-end development & Design</li>
        <li>Utrecht, The Netherlands</li>
        <li>scroll down to see more</li>
    </ul>
</div>

<style>
:global(body){
    /* lets the img use the --hero timeline even though it isn't inside .hero */
    timeline-scope: --hero;
}

.profile-photo, .hero{
    --pad: 0px;

    @media (width>=420px){
        --pad: clamp(.5rem, calc(.5rem + (100vw - 375px) * 2.5rem / 1065px), 3rem);
    }
}

.profile-photo{
    --size: min(420px, 100% - 2 * var(--pad));
    display: block;
    width: var(--size);
    aspect-ratio: 1/1;
    margin-inline-start: var(--pad);
    /* takes up no space, the img lays on top of .photo-slot */
    margin-bottom: calc(-1 * var(--size));
    position: relative;
    z-index: 5;

    @media (prefers-reduced-motion: no-preference) {
        /* without support the img just stays a normal square photo in the hero */
        @supports (animation-timeline: view()) and (animation-range: exit 0% exit 50%) and (timeline-scope: --hero) {
            position: sticky;
            top: var(--pad);
            /* shrinks towards the right, where it ends up */
            transform-origin: top right;
            animation-name: photo-morph;
            animation-timing-function: linear;
            animation-fill-mode: both;
            /* starts when the img sticks, at --pad from the top of the viewport */
            animation-timeline: --hero;
            animation-range: exit calc(0% - var(--pad)) exit 50%;
        }
    }
}

.hero{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding-inline: var(--pad);
    view-timeline: --hero;

    /* photo and intro always side by side, so the intro can slide into the photo's place */
    @media (width>=800px){
        flex-wrap: nowrap;
    }

    .photo-slot{
        flex: none;
        width: min(420px, 100%);
        aspect-ratio: 1/1;
    }

    .intro{
        flex: 1 1 auto;

        @media (width>=800px) and (prefers-reduced-motion: no-preference) {
            /* same check as the img, so they always animate together or not at all */
            @supports (animation-timeline: view()) and (animation-range: exit 0% exit 50%) and (timeline-scope: --hero) {
                /* top aligned with the photo, so both stick at the same moment */
                align-self: flex-end;
                /* sticks until the bottom of .hero, where the next section starts */
                position: sticky;
                top: var(--pad);
                animation-name: intro-slide;
                animation-timing-function: linear;
                animation-fill-mode: both;
                animation-timeline: --hero;
                animation-range: exit calc(0% - var(--pad)) exit 50%;
            }
        }
    }
}

@keyframes intro-slide {
    to {
        /* width of .photo-slot (always 420px from 800px) + gap */
        translate: calc(-420px - 1rem) 0;
    }
}

/* Every shape has 12 points, starting bottom-left and going clockwise, so they can morph into each other */
@keyframes photo-morph {
    0% {
        scale: 1;
        margin-inline-start: var(--pad);
        clip-path: polygon(0% 100%, 0% 0%, 20% 0%, 50% 0%, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 65% 100%, 50% 100%, 35% 100%, 20% 100%);
    }
    25%, 35% {
        /* M */
        clip-path: polygon(0% 100%, 0% 0%, 20% 0%, 50% 45%, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 80% 35%, 50% 80%, 20% 35%, 20% 100%);
    }
    55%, 65% {
        /* E */
        clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 20%, 25% 20%, 25% 40%, 80% 40%, 80% 60%, 25% 60%, 25% 80%, 100% 80%, 100% 100%);
    }
    90% {
        /* circle made of 12 points, so the E can morph into it */
        clip-path: polygon(14.64% 85.36%, 1.7% 62.94%, 1.7% 37.06%, 14.64% 14.64%, 37.06% 1.7%, 62.94% 1.7%, 85.36% 14.64%, 98.3% 37.06%, 98.3% 62.94%, 85.36% 85.36%, 62.94% 98.3%, 37.06% 98.3%);
    }
    100% {
        /* real circle, small as an icon (a polygon can't morph into circle(), so it switches at the very end) */
        scale: .12;
        /* right side of the screen, same padding as on the left */
        margin-inline-start: calc(100% - var(--pad) - var(--size));
        clip-path: circle(50%);
    }
}
</style>
