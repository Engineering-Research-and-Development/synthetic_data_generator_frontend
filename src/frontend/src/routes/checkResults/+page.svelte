<script lang="ts">
    import { Button, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";

    let documentId: string = '';
    let documentData: CouchJson | null = null;
    let error: string | null = null;
    let errorMessage: string;

    async function fetchDocument() {
        errorMessage = "";
        if (!documentId) {
            error = 'Please enter a document ID';
            return;
        }

        try {
            const response = await fetch(`http://localhost:5984/model_results/${documentId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!response.ok) {
                errorMessage="Document not found"
            }
            documentData = await response.json();
            error = null;
        } catch (err) {
            documentData = null;
        }
    }

    function downloadJson() {
        if (!documentData) return;

        const jsonString = JSON.stringify(documentData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ENG_sdg_${documentId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
</script>

{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Fetch the results document</h1>
    <div class="mb-4">
        <Input bind:value={documentId} placeholder="Enter Document ID" class="mb-2" />
        <Button on:click={fetchDocument}>Fetch Document</Button>
        <Button on:click={() => goto('/')}>SDG Home</Button>
    </div>

    {#if error}
        <div class="text-red-500 mb-4">{error}</div>
    {/if}

    {#if documentData}
        <h2 class="text-xl font-bold mt-6 mb-4">Data preview</h2>
        <div class="overflow-x-auto">
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
        </div>

        <h2 class="text-xl font-bold mt-6 mb-4">Metrics</h2>
        <div class="overflow-x-auto">
            <Table>
                <TableHead>
                    <TableHeadCell>Metric Type</TableHeadCell>
                    <TableHeadCell>Metric Title</TableHeadCell>
                    <TableHeadCell>Metric Value</TableHeadCell>
                    <TableHeadCell>Unit</TableHeadCell>
                </TableHead>
                <TableBody>
                    <!-- Statistical Metrics -->
                    {#if documentData.metrics?.statistical_metrics?.length}
                        {#each documentData.metrics.statistical_metrics as metric, i}
                            <TableBodyRow class="bg-orange-50">
                                {#if i === 0}
                                    <TableBodyCell rowspan={documentData.metrics.statistical_metrics.length}>
                                        Statistical Metrics
                                    </TableBodyCell>
                                {/if}
                                <TableBodyCell>{metric.title}</TableBodyCell>
                                <TableBodyCell>
                                    {#if typeof metric.value === 'object'}
                                        <ul class="list-disc list-inside">
                                            {#each Object.entries(metric.value) as [k, v]}
                                                <li><strong>{k}</strong>: {v}</li>
                                            {/each}
                                        </ul>
                                    {:else}
                                        {metric.value}
                                    {/if}
                                </TableBodyCell>
                                <TableBodyCell>{metric.unit_measure}</TableBodyCell>
                            </TableBodyRow>
                        {/each}
                    {/if}

                    <!-- Adherence Metrics -->
                    {#if documentData.metrics?.adherence_metrics?.length}
                        {#each documentData.metrics.adherence_metrics as metric, i}
                            <TableBodyRow class="bg-blue-50">
                                {#if i === 0}
                                    <TableBodyCell rowspan={documentData.metrics.adherence_metrics.length}>
                                        Adherence Metrics
                                    </TableBodyCell>
                                {/if}
                                <TableBodyCell>{metric.title}</TableBodyCell>
                                <TableBodyCell>
                                    {#if typeof metric.value === 'object'}
                                        <ul class="list-disc list-inside">
                                            {#each Object.entries(metric.value) as [k, v]}
                                                <li><strong>{k}</strong>: {v}</li>
                                            {/each}
                                        </ul>
                                    {:else}
                                        {metric.value}
                                    {/if}
                                </TableBodyCell>
                                <TableBodyCell>{metric.unit_measure}</TableBodyCell>
                            </TableBodyRow>
                        {/each}
                    {/if}

                    <!-- Novelty Metrics -->
                    {#if documentData.metrics?.novelty_metrics?.length}
                        {#each documentData.metrics.novelty_metrics as metric, i}
                            <TableBodyRow class="bg-green-50">
                                {#if i === 0}
                                    <TableBodyCell rowspan={documentData.metrics.novelty_metrics.length}>
                                        Novelty Metrics
                                    </TableBodyCell>
                                {/if}
                                <TableBodyCell>{metric.title}</TableBodyCell>
                                <TableBodyCell>
                                    {#if typeof metric.value === 'object'}
                                        <ul class="list-disc list-inside">
                                            {#each Object.entries(metric.value) as [k, v]}
                                                <li><strong>{k}</strong>: {v}</li>
                                            {/each}
                                        </ul>
                                    {:else}
                                        {metric.value}
                                    {/if}
                                </TableBodyCell>
                                <TableBodyCell>{metric.unit_measure}</TableBodyCell>
                            </TableBodyRow>
                        {/each}
                    {/if}
                </TableBody>
            </Table>
        </div>

        <div class="flex justify-center mt-6">
            <Button on:click={downloadJson} color="green">
                Download Full JSON Document
            </Button>
        </div>
    {/if}
</div>