<script>
    import Header from '$lib/components/Header.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import Nav from '$lib/components/Nav.svelte';
    import Biography from '$lib/components/Biography.svelte';
    import Projects from '$lib/components/Projects.svelte';
    import Contact from '$lib/components/Contact.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { data } = $props();
    const { projects, favoriteSong } = $derived(data);
</script>

<!-- the sticky profile photo in the hero stays inside this, so it stops above projects -->
<div class="page-start">
    <Header />

    <Hero />
    
    <Biography {favoriteSong} />
</div>

<Projects {projects} />

<Contact />

<Footer />

<Nav />

<style>
    .page-start{
        min-height: 100dvh;
        /* the photo counts as 0px high for sticky (negative margin), so its top would stop right at the edge
           of projects and the round icon would hang over it. A sticky element never moves into the padding
           of its parent, so this room for the icon makes it stop above projects */
        padding-bottom: calc(var(--profile-photo-size) * var(--profile-icon-scale));
    }
</style>