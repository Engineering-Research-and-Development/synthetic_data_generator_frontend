<script>
    import PreviewSection from "./PreviewSection.svelte";
    let {selectedModel, newModel, newModelName} =$props();
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold mb-2">Selected Model</h2>
    {#if selectedModel}
        <p>
            {selectedModel.name}
            {#if !newModel}
                – v{selectedModel.version}
            {:else}
                (new: {newModelName})
            {/if}
        </p>
    {/if}
</PreviewSection>

<PreviewSection>
    <h2 class="text-xl font-semibold mb-2">New Model</h2>
    <p>{newModel ? "Yes" : "No"}</p>
</PreviewSection>
