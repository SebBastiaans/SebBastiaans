<script>
	import favicon from '$lib/assets/favicon.png';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Portfolio of Seb Bastiaans</title>
	<meta name="description" content="Portfolio of Seb Bastiaans, front-end developer: school and personal projects, biography and contact." />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
