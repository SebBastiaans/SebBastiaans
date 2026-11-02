<script>
    // the toggle only works with JS, so it's only shown once JS runs
    let canToggleTheme = $state(false);

    $effect(() => {
        canToggleTheme = true;
    });

    function toggleTheme() {
        // the chosen theme, or when the visitor hasn't chosen yet, the theme of the device
        const chosenTheme = document.documentElement.dataset.theme;
        const isDark = chosenTheme ? chosenTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDark ? 'light' : 'dark';

        // app.css switches color-scheme on this, and the script in app.html sets it again on the next visit
        document.documentElement.dataset.theme = theme;

        try {
            localStorage.setItem('theme', theme);
        } catch {
            // blocked storage: the choice just isn't remembered
        }
    }
</script>

<footer class="page-footer">
    {#if canToggleTheme}
        <!-- the text says what the button does, so no aria-pressed: "Light mode, pressed" would be confusing -->
        <!-- both texts are there, the CSS shows the one that fits the current theme -->
        <!-- display: none also takes the other one out of the name screen readers hear -->
        <button type="button" class="pill" onclick={toggleTheme}>
            <span class="to-dark">
                <span aria-hidden="true">☾</span>
                Dark mode
            </span>
            <span class="to-light">
                <span aria-hidden="true">☀</span>
                Light mode
            </span>
        </button>
    {/if}
</footer>

<style>
.page-footer{
    display: flex;
    justify-content: flex-end;
    padding: 2rem var(--page-padding);
    /* room for the fixed nav at the bottom of the screen */
    margin-bottom: 2.8rem;
}

.to-dark,
.to-light{
    display: inline-flex;
    align-items: center;
    gap: .5rem;
}

/* light: offer dark mode */
.to-light{
    display: none;
}

/* dark, chosen with the toggle or following the device when nothing is chosen: offer light mode */
/* the same conditions as color-scheme in app.css */
:global(:root[data-theme="dark"]) .to-dark{
    display: none;
}

:global(:root[data-theme="dark"]) .to-light{
    display: inline-flex;
}

@media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme="light"])) .to-dark{
        display: none;
    }

    :global(:root:not([data-theme="light"])) .to-light{
        display: inline-flex;
    }
}
</style>
