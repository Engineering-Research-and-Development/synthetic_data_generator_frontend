<script lang="ts">
    import { Button, Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";

    let documentId: string = '';
    let documentData: any = null;
    let error: string | null = null;
    let errorMessage: string;

    async function fetchDocument() {
        errorMessage = "";
        documentData = null;
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
        <div class="overflow-x-auto">
            <Table>
                <TableHead>
                    <TableHeadCell>Column Name</TableHeadCell>
                    <TableHeadCell>Column Type</TableHeadCell>
                    <TableHeadCell>Column DataType</TableHeadCell>
                    <TableHeadCell>Column Data</TableHeadCell>
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
                        <TableHeadCell>Metric Name</TableHeadCell>
                        <TableHeadCell>Metric Value</TableHeadCell>

                </TableHead>
                <TableBody>
                    <!-- Statistical Metrics -->
                    {#each Object.entries(documentData.metrics.statistical_metrics) as [metricName, metricValue], i}
                        <TableBodyRow>
                            {#if i === 0}
                                <TableBodyCell rowspan={Object.keys(documentData.metrics.statistical_metrics).length}>
                                    Statistical Metrics
                                </TableBodyCell>
                            {/if}
                            <TableBodyCell>{metricName}</TableBodyCell>
                            <TableBodyCell>{metricValue}</TableBodyCell>
                        </TableBodyRow>
                    {/each}

                    <!-- Adherence Metrics -->
                    {#each Object.entries(documentData.metrics.adherence_metrics) as [metricType, metricData], i}
                        {#if Object.keys(metricData).length > 0}
                            {#each Object.entries(metricData) as [metricName, metricValue], j}
                                <TableBodyRow>
                                    {#if i === 0 && j === 0}
                                        <TableBodyCell rowspan={Object.values(documentData.metrics.adherence_metrics).reduce((acc, curr) => acc + Object.keys(curr).length, 0)}>
                                            Adherence Metrics
                                        </TableBodyCell>
                                    {/if}
                                    <TableBodyCell/>
                                    <TableBodyCell>{metricName}</TableBodyCell>
                                    <TableBodyCell>{metricValue}</TableBodyCell>
                                </TableBodyRow>
                            {/each}
                        {:else}
                            <TableBodyRow>
                                <TableBodyCell>Adherence Metrics</TableBodyCell>
                                <TableBodyCell>{metricType}</TableBodyCell>
                                <TableBodyCell>No data</TableBodyCell>
                            </TableBodyRow>
                        {/if}
                    {/each}

                    <!-- Novelty Metrics -->
                    {#each Object.entries(documentData.metrics.novelty_metrics) as [metricName, metricValue], i}
                        <TableBodyRow>
                            {#if i === 0}
                                <TableBodyCell rowspan={Object.keys(documentData.metrics.novelty_metrics).length}>
                                    Novelty Metrics
                                </TableBodyCell>
                            {/if}
                            <TableBodyCell>{metricName}</TableBodyCell>
                            <TableBodyCell>{metricValue}</TableBodyCell>
                        </TableBodyRow>
                    {/each}
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