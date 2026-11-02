<script>
    import Header from '$lib/components/header.svelte';
    import Hero from '$lib/components/hero.svelte';
    import Nav from '$lib/components/nav.svelte';
    import Biography from '$lib/components/biography.svelte';
    import Projects from '$lib/components/projects.svelte';
    import Contact from '$lib/components/contact.svelte';

    let { data } = $props();
    const { projects } = $derived(data);
</script>

<!-- <div> -->
    <Header />

    <Hero />
<!-- </div> -->

<!-- <Nav /> -->

<Biography />

<Projects {projects} />

<Contact />

<style>
    div{
        height: 100dvh;
    }
</style>