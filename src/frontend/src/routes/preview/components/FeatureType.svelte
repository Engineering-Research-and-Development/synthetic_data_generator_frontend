<script lang="ts">
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import PreviewSection from "./PreviewSection.svelte";
    import type { FeatureConfig } from "../../../types/middlewarePost";

    let { featureTypes }: { featureTypes: FeatureConfig } = $props();
    const featureKeys = $derived(Object.keys(featureTypes));
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold text-center mb-4">
        Feature Types
    </h2>
    {#if (Object.keys(featureTypes).length > 0)}
        <Table striped hoverable>
            <TableHead>
                {#each featureKeys as feature}
                    <TableHeadCell>{feature}</TableHeadCell>
                {/each}
            </TableHead>

            <TableBody>
                <TableBodyRow>
                    {#each featureKeys as feature}
                        <TableBodyCell>
                            Type: {featureTypes[feature].type}<br>
                        </TableBodyCell>
                    {/each}
                </TableBodyRow>
            </TableBody>
        </Table>
        {:else}
            <p class="mb-2">Features will be automatically inferred </p>
        {/if}
</PreviewSection>