<script>
    import Header from '$lib/components/Header.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import Biography from '$lib/components/Biography.svelte';
    import Projects from '$lib/components/Projects.svelte';
    import TechStack from '$lib/components/TechStack.svelte';
    import Contact from '$lib/components/Contact.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
    const { projects, favoriteSong } = $derived(data);
</script>

<!-- main: the content of the page, so screen readers can skip straight to it (Footer and Nav stay outside) -->
<main>
    <!-- the first screen: header at the top, hero at the bottom against projects -->
    <div class="page-start">
        <Header />

        <Hero />

        <!-- <Biography {favoriteSong} /> -->
    </div>

    <Projects {projects} />

    <TechStack />

    <Contact />
</main>

<Footer />

<!-- <Nav /> -->

<style>
    .page-start{
        display: flex;
        gap: 5rem;
        flex-direction: column;
        justify-content: space-between;
    }
</style>