<script>
    import { onMount } from 'svelte';
    import { replaceState } from '$app/navigation';

    let hidden = $state(false);

    onMount(() => {
        let lastScrollY = window.scrollY;
        let currentSection = window.location.hash.slice(1);
        const sections = document.querySelectorAll('section[id]');

        // a section counts as "current" when it crosses a thin line in the middle of the screen
        const sectionObserver = new IntersectionObserver(handleSections, {
            rootMargin: '-50% 0px -50% 0px'
        });

        window.addEventListener('scroll', handleScroll);
        sections.forEach((section) => sectionObserver.observe(section));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            sectionObserver.disconnect();
        };

        function handleScroll() {
            const currentScrollY = window.scrollY;
            hidden = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;
        }

        function handleSections(entries) {
            for (const { target, isIntersecting } of entries) {
                if (isIntersecting) {
                    updateUrl(target.id);
                } else if (target.id === currentSection) {
                    // left the current section without entering a new one, for example back up to the hero
                    updateUrl('');
                }
            }
        }

        // replaceState and not pushState: the url follows along, but scrolling adds no steps to the back button
        function updateUrl(id) {
            if (id === currentSection) return;

            currentSection = id;
            replaceState(id ? `#${id}` : window.location.pathname, {});
        }
    });
</script>

<nav class:nav-hidden={hidden}>
    <a href="#biography">Biography</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
</nav>

<style>
nav{
    display: flex;
    border-top: solid var(--color-text) 2px;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--color-glass);
    z-index: 10;
    /* the glow of the outer links reaches past the screen edge, cut it off there */
    overflow: clip;

    transform: translateY(0);
    transition: transform .3s ease;

    &.nav-hidden{
        transform: translateY(100%);
    }

    a{
        text-decoration: none;
        color: var(--color-text);
        padding: .5rem;
        scroll-behavior: smooth;

        &::after{
            bottom: .5rem;
        }

        /* glow behind the link: a lying oval, solid right behind the text, fading out to the see-through nav */
        /* the edges are transparent and not --color-glass, the nav background already shows through there */
        &::before{
            content: '';
            position: absolute;
            /* 3rem wider than the link on both sides, that is where it fades out */
            inset-block: 0;
            inset-inline: -3rem;
            /* behind the text, but still in front of the nav background */
            z-index: -1;
            /* closest-side: an ellipse touching the edges of this wide box, so a lying oval */
            /* solid up to halfway, so right behind the text it's fully opaque, then it fades out */
            background: radial-gradient(closest-side, var(--color-background) 50%, transparent);
            /* a gradient can't transition, so it fades in with opacity */
            opacity: 0;
            transition: opacity .2s;
        }

        &:hover::before,
        &:focus-visible::before{
            opacity: 1;
        }
    }
}
</style>
