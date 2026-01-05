<script>
    import PreviewSection from "./PreviewSection.svelte";

    let {additionalRows} = $props()
</script>
<PreviewSection>
    <h2 class="text-xl font-semibold mb-2">Additional Rows</h2>
    <p>{additionalRows}</p>

</PreviewSection>