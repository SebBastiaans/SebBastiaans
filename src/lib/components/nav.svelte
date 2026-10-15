<script>
    import { onMount } from 'svelte';

    let hidden = $state(false);

    onMount(() => {
        let lastScrollY = window.scrollY;

        function handleScroll() {
            const currentScrollY = window.scrollY;
            hidden = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
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
    border-block: solid black 2px;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.414);
    z-index: 10;

    transform: translateY(0);
    transition: transform .3s ease;

    &.nav-hidden{
        transform: translateY(100%);
    }

    a{
        text-decoration: none;
        color: black;
        padding: .5rem;
        scroll-behavior: smooth;

        &::after{
            bottom: .5rem;
        }
    }
}
</style>
