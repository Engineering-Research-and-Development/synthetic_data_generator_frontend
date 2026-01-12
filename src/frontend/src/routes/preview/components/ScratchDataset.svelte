<script>
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import PreviewSection from "./PreviewSection.svelte";
    let {featuresCreated} = $props()
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold text-center mb-4">
        Dataset from scratch
    </h2>

    <Table striped hoverable>
        <TableHead>
            {#each featuresCreated as feature}
                <TableHeadCell>{feature.feature}</TableHeadCell>
            {/each}
        </TableHead>

        <TableBody>
                <TableBodyRow>
                    {#each featuresCreated as feature}
                        <TableBodyCell>
                            <div class="font-medium">{feature.type}</div>
                            <div class="text-sm text-gray-500">{feature.category}</div>
                        </TableBodyCell>
                    {/each}
                </TableBodyRow>
        </TableBody>
    </Table>
</PreviewSection>