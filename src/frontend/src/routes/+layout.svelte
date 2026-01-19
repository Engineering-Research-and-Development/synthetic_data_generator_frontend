<script lang="ts">
	import '../app.css';
    import NavBar from "./components/layout/NavBar.svelte";
    import BreadCrumbs from "./components/layout/BreadCrumbs.svelte";
</script>

<svelte:head>
    <title>ENG - Synthetic Data Generator</title>
</svelte:head>


<NavBar/>
<div class="min-h-screen flex flex-col items-center justify-center pt-20 relative" style="background-image: url('Dark-Purple-Backgrounds.png');">
    <div class="absolute left-4" style="top: 5.5rem;">
        <BreadCrumbs />
    </div>

    <slot/>
</div>
