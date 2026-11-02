<script>
    // the toggle only works with JS, so it's only shown once JS runs
    let canToggleTheme = $state(false);
    let isDark = $state(false);

    $effect(() => {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

        updateIsDark();
        canToggleTheme = true;

        // when the visitor hasn't chosen yet, the theme follows the device, also when that changes
        systemDark.addEventListener('change', updateIsDark);

        return () => systemDark.removeEventListener('change', updateIsDark);

        function updateIsDark() {
            const chosenTheme = document.documentElement.dataset.theme;
            isDark = chosenTheme ? chosenTheme === 'dark' : systemDark.matches;
        }
    });

    function toggleTheme() {
        const theme = isDark ? 'light' : 'dark';

        // app.css switches color-scheme on this, and the script in app.html sets it again on the next visit
        document.documentElement.dataset.theme = theme;
        isDark = !isDark;

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
        <button type="button" class="pill" onclick={toggleTheme}>
            {#if isDark}
                <span aria-hidden="true">☀</span>
                Light mode
            {:else}
                <span aria-hidden="true">☾</span>
                Dark mode
            {/if}
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
</style>
