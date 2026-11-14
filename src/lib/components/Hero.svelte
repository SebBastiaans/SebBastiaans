<script>
    // AVIF and WebP in 420px (the photo is at most 420px wide) and 840px for sharp screens, with a fallback
    import profilePhoto from '$lib/assets/pics/IMG_7841-face.png?enhanced&w=840;420';
</script>

<!-- grid: the two lists under each other on the left, the photo on the right.
     On small screens one column, in the order of the HTML: photo, intro, skills -->
<div class="hero">
    <picture>
        <source type="image/avif" srcset={profilePhoto.sources.avif} sizes="420px">
        <source type="image/webp" srcset={profilePhoto.sources.webp} sizes="420px">
        <img class="profile-photo" src={profilePhoto.img.src} alt="">
    </picture>

    <!-- .line: the text of a list item lights up letter by letter on scroll, see the styles.
         --i is the place of the item over both lists (0 to 6), so they light up one after another.
         Add or remove an item: change the numbers and --lines in the styles -->
    <ul class="intro">
        <li style="--i: 0"><span class="line">Student Front-end development & Design</span></li>
        <li style="--i: 1"><span class="line">Utrecht, The Netherlands</span></li>
    </ul>

    <ul class="skills">
        <li style="--i: 3"><span class="line">Specializing in <span class="hint" data-tooltip="Try different view width's in your dev tools ;)">responsive</span>, accesible, performing, progressive enhanced websites</span></li>
        <li style="--i: 4"><span class="line">Understanding design, translating it to code</span></li>
        <li style="--i: 5"><span class="line">Scrumming, communicating, collaborating</span></li>
        <li style="--i: 6"><span class="line">Soon to be AI prompt whisperer</span></li>
    </ul>
</div>

<style>
.hero{
    display: grid;
    grid-template-areas:
        "photo"
        "intro"
        "skills";
    gap: 2rem;
    padding-inline: var(--hero-padding);

    /* lists on the left, photo on the right over the height of both lists */
    @media (width >= 800px){
        /* the photo column is 420px (the size of the photo), the lists get the rest of the width */
        grid-template-columns: 1fr 420px;
        /* the photo is taller than the lists: the second row gets all the extra height,
           so the skills stay right under the intro instead of halfway down */
        grid-template-rows: auto 1fr;
        grid-template-areas:
            "intro  photo"
            "skills photo";
    }
}

picture{
    grid-area: photo;
}

.profile-photo{
    display: block;
    width: var(--profile-photo-size);
    aspect-ratio: 1/1;

    /* fills its 420px grid column. With an auto column the percentage in --profile-photo-size would make it smaller */
    @media (width >= 800px){
        width: 100%;
    }
}

.intro{
    grid-area: intro;
}

.skills{
    grid-area: skills;
}

.intro,
.skills{
    font-size: var(--hero-text-size);
}

/* the text lights up letter by letter from left to right while you scroll, as if you read it.
   Without support or with reduced motion the text is just visible in the normal color */
@media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: scroll()) and ((background-clip: text) or (-webkit-background-clip: text)) {
        .line{
            /* all items share one timeline: the scroll of the page. The first --read-distance of scrolling is
               split into equal parts, one per item, so an item only starts when the one above it is done */
            --lines: 7;
            --read-distance: 40vh;
            --step: calc(var(--read-distance) / var(--lines));
            /* width of the soft edge of the light, about 2 letters */
            --edge: 1.5em;
            /* the text itself is see-through, the backgrounds below are only painted inside the letters */
            color: transparent;
            background-image:
                /* on top: the lit text, grows from the left. Its right end fades out, so letters light up one by one */
                linear-gradient(to right, var(--color-text) calc(100% - var(--edge)), transparent),
                /* below: the dim text that isn't read yet */
                linear-gradient(color-mix(in srgb, var(--color-text) 15%, transparent));
            background-repeat: no-repeat;
            background-size: 0% 100%, 100% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            /* default, but needed for the effect: when the text wraps, the background runs on over the next line
               as if all lines were one long line, so the light goes line by line */
            box-decoration-break: slice;
            animation: read-line linear both;
            animation-timeline: scroll(root);
            /* item --i lights up between --i and --i + 1 steps of scrolling */
            animation-range: calc(var(--i) * var(--step)) calc((var(--i) + 1) * var(--step));
        }
    }
}

@keyframes read-line {
    to {
        /* past 100% by the soft edge, so the last letter is fully lit too */
        background-size: calc(100% + var(--edge)) 100%, 100% 100%;
    }
}
</style>
