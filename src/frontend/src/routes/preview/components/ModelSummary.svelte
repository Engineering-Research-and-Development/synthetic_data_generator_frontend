<script lang="ts">
    import PreviewSection from "./PreviewSection.svelte";
    import type {SelectedModel} from "../../../types/ambient";

    let {selectedModel}: {selectedModel : SelectedModel} =$props();
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold mb-2">AI Model</h2>
    {#if selectedModel.new}
        <p>New model using the {selectedModel.name} blueprint</p>
        <p>Future model name: {selectedModel.version} </p>
    {:else}
        <p>Will be using the {selectedModel.name} model {selectedModel.version}</p>
    {/if}
</PreviewSection>
