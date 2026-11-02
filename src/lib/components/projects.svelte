<script>
    let { projects } = $props();

    const hasPersonalProjects = $derived(projects.some(({ category }) => category === 'personal'));
</script>

<section id="projects" class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">Projects</h2>

    <fieldset class="project-filter">
        <legend>Show projects</legend>
        <label>
            <input type="radio" name="project-category" value="all" checked>
            All
        </label>
        <label>
            <input type="radio" name="project-category" value="school">
            School
        </label>
        <label>
            <input type="radio" name="project-category" value="personal">
            Personal
        </label>
    </fieldset>

    <ol class="project-list">
        {#each projects as { title, description, href, image, category }}
            <li class="project-card" data-category={category}>
                <img src={image} alt="" loading="lazy">
                <h3><a {href}>{title}</a></h3>
                <p>{description}</p>
            </li>
        {/each}
    </ol>

    {#if !hasPersonalProjects}
        <!-- hidden by default, only shown by CSS when "Personal" is chosen -->
        <p class="project-empty" hidden>No personal projects yet, check back soon.</p>
    {/if}
</section>
