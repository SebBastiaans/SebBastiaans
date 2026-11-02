<script>
    import Header from '$lib/components/header.svelte';
    import Hero from '$lib/components/hero.svelte';
    import Nav from '$lib/components/nav.svelte';
    import Biography from '$lib/components/biography.svelte';
    import Projects from '$lib/components/projects.svelte';
    import Contact from '$lib/components/contact.svelte';
    import Footer from '$lib/components/footer.svelte';

    let { data } = $props();
    const { projects } = $derived(data);
</script>

<!-- the sticky profile photo in the hero stays inside this, so it stops above projects -->
<div class="page-start">
    <Header />

    <Hero />
    
    <Biography />
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