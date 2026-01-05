<script lang="ts">
	import '../app.css';
    import NavBar from "./components/layout/NavBar.svelte";
</script>

<svelte:head>
    <title>ENG - Synthetic Data Generator</title>
</svelte:head>


<NavBar/>
<div class="min-h-screen flex items-center justify-center pt-20"
    style="background-image: url('Dark-Purple-Backgrounds.png');">
    <slot/>
</div>
