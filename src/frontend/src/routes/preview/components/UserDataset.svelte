<script lang="ts">
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import PreviewSection from "./PreviewSection.svelte";
    let {maxRowsToShow, headers, tableData} = $props()
</script>

<PreviewSection>
    <h2 class="text-xl font-semibold text-center mb-4">
        User File (First {maxRowsToShow} Rows)
    </h2>

    <Table striped hoverable>
        <TableHead>
            {#each headers as header}
                <TableHeadCell>{header}</TableHeadCell>
            {/each}
        </TableHead>

        <TableBody>
            {#each tableData.slice(0, maxRowsToShow) as row}
                <TableBodyRow>
                    {#each headers as header}
                        <TableBodyCell>{row[header]}</TableBodyCell>
                    {/each}
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</PreviewSection>