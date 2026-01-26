<script lang="ts">
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
    import PreviewSection from "./PreviewSection.svelte";

    import type {FeatureFunctionParameters} from "../../../types/middlewarePost";
    
    let { functionData }: { functionData: FeatureFunctionParameters[] } = $props();
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold mb-4">
        Functions on features
    </h2>

    {#if functionData && functionData.length > 0}
        <Table striped={true} hoverable={true}>
            <TableHead>
                <TableHeadCell>Feature</TableHeadCell>
                <TableHeadCell>Function</TableHeadCell>
                <TableHeadCell>Parameters</TableHeadCell>
            </TableHead>

            <TableBody>
                {#each functionData as featureGroup}
                    {#each featureGroup.associated_functions as func, index}
                        <TableBodyRow>
                            {#if index === 0}
                                <TableBodyCell
                                        rowspan={featureGroup.associated_functions.length}
                                        class="font-semibold align-top"
                                >
                                    {featureGroup.feature_name}
                                </TableBodyCell>
                            {/if}

                            <TableBodyCell class="align-top">
                                {func.function.name}
                            </TableBodyCell>

                            <TableBodyCell>
                                {#if func.parameters && func.parameters.length > 0}
                                    <ul class="list-disc pl-4 text-sm">
                                        {#each func.parameters as param}
                                            <li>
                                                <span class="font-medium">{param.name}:</span>
                                                <span class="italic text-gray-500">({param.parameter_type})</span>
                                                {param.value}
                                            </li>
                                        {/each}
                                    </ul>
                                {:else}
                                    <span class="text-xs text-gray-400 italic">No params</span>
                                {/if}
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                {/each}
            </TableBody>
        </Table>
    {:else}
        <p class="text-center text-gray-600 dark:text-gray-300">
            No functions selected.
        </p>
    {/if}
</PreviewSection>