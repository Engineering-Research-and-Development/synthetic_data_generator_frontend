<script>
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import PreviewSection from "./PreviewSection.svelte";
    let {functionData} = $props()
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold">
        Selected Functions
    </h2>

    {#if Object.keys(functionData).length > 0}
        <Table striped hoverable>
            <TableHead>
                <TableHeadCell>Feature</TableHeadCell>
                <TableHeadCell>Function</TableHeadCell>
                <TableHeadCell>Parameters</TableHeadCell>
            </TableHead>

            <TableBody>
                {#each Object.entries(functionData) as [feature, functions]}
                    {#each functions as func, index}
                        <TableBodyRow>
                            {#if index === 0}
                                <TableBodyCell rowspan={functions.length} class="font-semibold">
                                    {feature}
                                </TableBodyCell>
                            {/if}

                            <TableBodyCell>{func.functionName}</TableBodyCell>

                            <TableBodyCell>
                                <ul class="list-disc pl-4 text-sm">
                                    {#each func.parameters as param}
                                        <li>
                                            <span class="font-medium">{param.name}:</span>
                                            {param.value}
                                        </li>
                                    {/each}
                                </ul>
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