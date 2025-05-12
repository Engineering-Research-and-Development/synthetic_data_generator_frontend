<script lang="ts">
    import { Img, Button } from 'flowbite-svelte';
    import UploadModal from "./components/UploadModal.svelte";

    const createEndpoint = '/create';
    const checkResults ='/checkResults';
    let showPopup: boolean = false;
    let uploadedFile: File | null = null;
</script>

<div class="text-center relative z-10">
    <Img src="ENG-LOGO-LIGHT.png" alt="ENG logo" size="max-w-xs" alignment="mx-auto"/>
    <h1 class="text-white text-4xl md:text-6xl font-bold mb-6"> Synthetic Data Generator</h1>
    <div class="flex justify-center space-x-4">
        <Button
                on:click={() => (showPopup = true)}
                class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
            Enhance Existing dataset
        </Button>
        <Button
                href={createEndpoint}
                class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
            Create a dataset from scratch
        </Button>
        <Button
            href={checkResults}
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
            Check the results
        </Button>
    </div>
</div>

<UploadModal bind:showPopup bind:uploadedFile />
