<script lang="ts">
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";

    let {documentData} = $props()
</script>

<Table>
    <TableHead>
        <TableHeadCell>Feature Name</TableHeadCell>
        <TableHeadCell>Feature Type</TableHeadCell>
        <TableHeadCell>Feature DataType</TableHeadCell>
        <TableHeadCell>Feature Data</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each documentData.results as column}
            <TableBodyRow>
                <TableBodyCell>{column.column_name}</TableBodyCell>
                <TableBodyCell>{column.column_type}</TableBodyCell>
                <TableBodyCell>{column.column_datatype}</TableBodyCell>
                <TableBodyCell>
                    <ul>
                        {#each column.column_data.slice(0,4) as data}
                            <li>{data}</li>
                        {/each}
                    </ul>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>