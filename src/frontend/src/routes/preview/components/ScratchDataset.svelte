<script>
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import PreviewSection from "./PreviewSection.svelte";
    let {featuresCreated} = $props()
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold text-center mb-4">
        Features to create
    </h2>

    <Table striped hoverable>
        <TableHead>
            {#each featuresCreated as feature}
                <TableHeadCell>{feature.feature}</TableHeadCell>
            {/each}
        </TableHead>

        <TableBody>
            {#each featuresCreated as feature}
                <TableBodyRow>
                    <TableBodyCell>
                        <div class="font-medium">{feature.type}</div>
                        <div class="text-sm text-gray-500">{feature.category}</div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</PreviewSection>