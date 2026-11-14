<script>
    import { techStack, withShapes, shapeSpans, levelLabels } from '$lib/tech-stack.js';

    // in the order of the list in tech-stack.js
    const items = withShapes(techStack);

    // these tiles are filled with the primary color, and these few have a border: now and then,
    // without a pattern you can see. The rest is a plain white tile on the grid paper
    const filled = new Set(['CSS', 'Svelte', 'Figma', 'Shopify', 'Git']);
    const bordered = new Set(['GitHub', 'Node.js', "REST API's", 'Lovable', 'Nunjucks']);
</script>

<!-- a bento grid of the tech stack: the bigger the tile, the better I master it. Data and shapes in src/lib/tech-stack.js -->
<section id="tech-stack" aria-labelledby="tech-stack-title">
    <h2 id="tech-stack-title">Tech stack</h2>
    <p class="tech-stack-intro">The bigger the tile, the better I know it.</p>

    <div class="tech-stack">
        <ul>
            {#each items as { name, logo, svg, level, shape } (name)}
                {@const [columns, rows] = shapeSpans[shape]}
                <li class="tile" data-shape={shape} class:filled={filled.has(name)} class:bordered={bordered.has(name)}
                    class:text-only={!logo && !svg}
                    style:grid-column="span {columns}" style:grid-row="span {rows}"
                    title={shape === 'small' ? name : undefined}>
                    {#if logo}
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={logo.path}/></svg>
                    {:else if svg}
                        <span class="own-logo" aria-hidden="true">{@html svg}</span>
                    {/if}
                    <!-- small tiles only show the logo, the name is still there for screen readers -->
                    <span class="name" class:visually-hidden={shape === 'small'}>{name}</span><span class="visually-hidden">, {levelLabels[level]}</span>
                </li>
            {/each}
        </ul>
    </div>
</section>

<style>
.tech-stack{
    /* cqi below is the width of this div, so the cells always fill the width exactly */
    container-type: inline-size;
}

.tech-stack-intro{
    margin-bottom: 1rem;
}

ul{
    /* 4 columns on small screens, 8 from 600px, 13 from 900px. A cell is square: the width divided over the columns.
       13 because the 25 tiles together are 51 cells: that's 4 full rows of 13 with only one empty cell */
    --stack-columns: 4;
    --stack-gap: .625rem;
    --stack-cell: calc((100cqi - (var(--stack-columns) - 1) * var(--stack-gap)) / var(--stack-columns));
    display: grid;
    grid-template-columns: repeat(var(--stack-columns), var(--stack-cell));
    grid-auto-rows: var(--stack-cell);
    /* fills the gaps with later tiles that fit, so the grid looks mixed up and has no holes */
    grid-auto-flow: dense;
    gap: var(--stack-gap);

    @container (width >= 600px){
        --stack-columns: 8;
    }

    @container (width >= 900px){
        --stack-columns: 13;
    }
}

.tile{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    min-width: 0;
    padding: .5rem;
    /* no border, only the .bordered ones: a plain white tile on the grid paper is enough */
    border: 2px solid transparent;
    border-radius: 1.25rem;
    background: var(--color-background);
    color: var(--color-text);
    font-family: inter, sans-serif;
    line-height: 1.1;
    text-align: center;
    overflow: hidden;

    svg,
    .own-logo{
        flex: none;
        width: calc(var(--stack-cell) * .5);
        height: calc(var(--stack-cell) * .5);
    }

    /* every logo in the text color of its tile (black, light in dark mode, or the background color on a filled tile),
       so they look consistent instead of 25 brand colors next to each other */
    svg{
        fill: currentColor;
    }

    /* own logos come in with {@html}, so the scoped svg rule above doesn't reach them: :global */
    :global(.own-logo svg){
        width: 100%;
        height: 100%;
        fill: currentColor;
    }
}

.filled{
    background: var(--color-primary);
    color: var(--color-background);
}

.bordered{
    border-color: var(--color-primary);
}

/* the big ones: logo above the name */
[data-shape="square"],
[data-shape="wide"]{
    flex-direction: column;
    font-size: 1.125rem;
    font-weight: 600;

    svg,
    .own-logo{
        width: calc(var(--stack-cell) * .8);
        height: calc(var(--stack-cell) * .8);
    }
}

[data-shape="pill"]{
    border-radius: 999px;
    font-size: .875rem;

    svg,
    .own-logo{
        width: calc(var(--stack-cell) * .45);
        height: calc(var(--stack-cell) * .45);
    }
}

/* one column wide: logo above a small name */
[data-shape="tall"]{
    flex-direction: column;
    font-size: .7rem;
}

/* no logo: the name is the logo */
.text-only{
    font-weight: 700;
    font-size: 1rem;
}

/* playful: a tile tilts a bit and grows on hover, every other one the other way.
   with rotate and scale, every tile keeps its own place in the grid */
@media (prefers-reduced-motion: no-preference) {
    .tile{
        transition: rotate .2s, scale .2s;

        &:hover{
            /* above its neighbours while it's bigger */
            position: relative;
            z-index: 1;
            scale: 1.05;
            rotate: -2deg;
        }

        &:nth-child(even):hover{
            rotate: 2deg;
        }
    }
}
</style>
