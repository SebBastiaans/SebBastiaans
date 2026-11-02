<script>
    import MusicalText from '$lib/components/MusicalText.svelte';

    let { favoriteSong } = $props();
</script>

<section id="biography">
    <h2>Biography</h2>

    <h3>Web</h3>
    <ul>
        <li>Specializing in <span class="hint" data-tooltip="Try different view width's in your dev tools ;)">responsive</span>, accesible, performing, progressive enhanced websites</li>
        <li>Understanding design, translating it to code</li>
        <li>Scrumming, communicating, collaborating</li>
        <li>Soon to be AI prompt whisperer</li>
    </ul>

    <!-- <h3>Just like creating stuff</h3> -->

    {#if favoriteSong}
        <!-- at the bottom of the section, sticky at the bottom of the screen -->
        <div class="biography-music">
            <div class="biography-music-sticky">
                <h3>My favourite song</h3>
                <MusicalText
                    text="What goes around comes around"
                    song={favoriteSong.previewUrl}
                    songTitle="What Goes Around...Comes Around"
                    songUrl={favoriteSong.appleMusicUrl}
                />
            </div>
        </div>
    {/if}
</section>

<style>
#biography{
    min-height: 100dvh;
    /* .biography-music fills the rest of the section below the text */
    display: flex;
    flex-direction: column;

    /* an empty line between the lists and the next heading */
    ul{
        margin-bottom: 1lh;
    }

    /* from below the text down to the bottom of the section */
    /* a sticky element stays inside its parent, so the musical text can't move over the text */
    .biography-music{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    /* at the bottom of the section, and while the section is on screen it sticks to the bottom of the screen */
    .biography-music-sticky{
        position: sticky;
        /* above the fixed nav */
        bottom: 4rem;
    }

    .hint{
        position: relative;
        cursor: help;

        &::after{
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: .35rem;
            white-space: nowrap;
            background: var(--color-text);
            color: var(--color-background);
            font-size: .75rem;
            padding: .25rem .5rem;
            border-radius: .25rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity .2s;
            z-index: 20;
        }

        &:hover::after{
            opacity: 1;
        }
    }
}
</style>
