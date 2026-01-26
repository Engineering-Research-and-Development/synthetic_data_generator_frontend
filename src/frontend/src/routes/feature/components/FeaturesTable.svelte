<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Checkbox
    } from 'flowbite-svelte';
    import type {RowData} from "../../../types/table";

    let max_rows = 10; // Maximum number of rows to display
    const max_elements_to_show = 2; // Maximum number of elements to display in each cell

    export let tableHeader: string[] = [];
    export let tableData: RowData[] = [];
    export let selectedColumns: string[] = [];

    function toggleColumn(column: string): void {
        selectedColumns = selectedColumns.includes(column)
            ? selectedColumns.filter(name => name !== column) // Remove column
            : [...selectedColumns, column]; // Add column
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

<Table class="w-3/4" shadow>
    <TableHead class="flex-auto text-center mx-auto text-xs text-gray-700 uppercase bg-gray-50">
        {#each tableHeader as header}
            <TableHeadCell>
                <div class="justify-center flex space-x-2">
                    <Checkbox
                            class=" font-semibold rounded shadow-md transition"
                            color="blue"
                            checked={selectedColumns.includes(header)}
                            on:change={() => toggleColumn(header)}
                            >
                    <span>{header}</span>
                    </Checkbox>
                </div>
            </TableHeadCell>
        {/each}
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each tableData.slice(0, max_rows) as row}
            <TableBodyRow class="justify-center text-center bg-white border-b">
                {#each tableHeader as header}
                    <TableBodyCell>
                        {truncateData(row[header])}
                    </TableBodyCell>
                {/each}
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>