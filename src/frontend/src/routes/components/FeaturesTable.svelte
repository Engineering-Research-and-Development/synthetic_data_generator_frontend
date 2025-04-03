<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Checkbox, Button,
    } from 'flowbite-svelte';

    type RowData = { [key: string]: any };
    type OnToggleColumn = (header: string) => void;

    let max_rows = 10; // Maximum number of rows to display
    export let headers: string[] = []; // Array of table headers
    export let tableData: RowData[] = []; // Array of table rows
    export let selectedColumns: string[] = []; // Array of selected columns
    export let onToggleColumn: OnToggleColumn; // Function to handle column toggle

    function onToggleColumnAll(header: string): void {
        if (header === 'all') {
            selectedColumns = selectedColumns.length === headers.length
                ? [] // Unselect all
                : headers; // Select all
        } else {
            selectedColumns = selectedColumns.includes(header)
                ? selectedColumns.filter(name => name !== header) // Remove column
                : [...selectedColumns, header]; // Add column
        }
    }
</script>

<Button class="" on:click={() => onToggleColumnAll('all')}>Select All Features</Button>
<Table class=" w-3/4" shadow>
    <TableHead class=" flex-auto text-center mx-auto text-xs text-gray-700 uppercase bg-gray-50">
        {#each headers as header}
            <TableHeadCell>
                <div class="justify-center flex space-x-2">
                    <Checkbox
                            checked={selectedColumns.includes(header)}
                            on:change={() => onToggleColumn(header)}
                    />
                    <span>{header}</span>
                </div>
            </TableHeadCell>
        {/each}
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each tableData.slice(0, max_rows) as row}
            <TableBodyRow class="justify-center text-center bg-white border-b">
                {#each headers as header}
                    <TableBodyCell>
                        {row[header]}
                    </TableBodyCell>
                {/each}
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
