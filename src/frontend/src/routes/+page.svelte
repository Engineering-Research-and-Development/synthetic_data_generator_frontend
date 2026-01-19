<script lang="ts">
    import {Img} from 'flowbite-svelte';
    import HomeSection from "./components/HomeSection.svelte";
    import {Section} from "flowbite-svelte-blocks";
</script>

<Section>
    <div class="text-center relative z-10">
        <Img src="ENG-LOGO-LIGHT.png" alt="ENG logo" size="max-w-xs" alignment="mx-auto"/>
        <h1 class="text-white text-4xl md:text-6xl font-bold mb-6"> Synthetic Data Generator</h1>
    </div>
    <HomeSection/>
</Section>