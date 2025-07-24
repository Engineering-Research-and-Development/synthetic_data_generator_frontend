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

    let max_rows = 10; // Maximum number of rows to display
    const max_elements_to_show = 2; // Maximum number of elements to display in each cell
    export let headers: string[] = []; // Array of table headers
    export let tableData: RowData[] = []; // Array of table rows
    export let selectedColumns: string[] = []; // Array of selected columns

    function toggleColumn(column: string): void {
        selectedColumns = selectedColumns.includes(column)
            ? selectedColumns.filter(name => name !== column) // Remove column
            : [...selectedColumns, column]; // Add column
    }

    function toggleColumnAll(): void {
        if (selectedColumns.length === headers.length) {
            selectedColumns = [];
        } else {
            selectedColumns = headers;
        }
    }

    // Helper function to truncate array data
    function truncateData(data: any): string {
        // If it's already an array
        if (Array.isArray(data)) {
            const truncated = data.slice(0, max_elements_to_show);
            return `${truncated.join(', ')}${data.length > max_elements_to_show ? '...' : ''}`;
        }

        if (typeof data === 'string' && data.startsWith('[') && data.endsWith(']')) {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    const truncated = parsed.slice(0, max_elements_to_show);
                    return `${truncated.join(', ')}${parsed.length > max_elements_to_show ? '...' : ''}`;
                }
            } catch (e) {
                // If parsing fails, return the original string
            }
        }
        return data;
    }
</script>

<Button class="" on:click={() => toggleColumnAll()}>Select All Features</Button>
<Table class="w-3/4" shadow>
    <TableHead class="flex-auto text-center mx-auto text-xs text-gray-700 uppercase bg-gray-50">
        {#each headers as header}
            <TableHeadCell>
                <div class="justify-center flex space-x-2">
                    <Checkbox
                            checked={selectedColumns.includes(header)}
                            on:change={() => toggleColumn(header)}
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
                        {truncateData(row[header])}
                    </TableBodyCell>
                {/each}
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>