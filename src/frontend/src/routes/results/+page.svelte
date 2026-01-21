<script lang="ts">
    import { Button, Input} from 'flowbite-svelte';
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";
    import {COUCH_URL} from "../../stores/shared";
    import {get} from "svelte/store";
    import DataPreviewTable from "./components/DataPreviewTable.svelte";
    import MetricsTable from "./components/MetricsTable.svelte";

    import type {CouchJson} from "../../types/couch";
    import {Section} from "flowbite-svelte-blocks";

    let documentId: string;
    let documentData: CouchJson | null = null;
    let errorMessage: string;

    async function fetchDocument() {
        errorMessage = "";
        if (!documentId) {
            errorMessage = 'Please enter a document ID';
            return;
        }

        try {
            const response = await fetch( get(COUCH_URL)+`/model_results/${documentId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!response.ok) {
                errorMessage="Document not found"
            }
            documentData = await response.json();
        } catch (err: any) {
            documentData = null;
            errorMessage = err.message;
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

<Section>
    {#if errorMessage}
        <Error bind:errorMessage/>
    {/if}

    <div class="flex flex-col justify-center space-x-4">
        <section class="flex flex-col items-center justify-center h-1/2 gap-6 px-4">
            <h1 class="text-4xl sm:text-5xl font-bold text-white text-center drop-shadow-md">
                Fetch the Results Document
            </h1>
            <div class="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
                <Input
                        bind:value={documentId}
                        placeholder="Enter Document ID"
                        class="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                        class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md shadow-md transition-colors duration-200"
                        on:click={fetchDocument}
                >
                    Fetch Document
                </Button>

                <Button
                        class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md shadow-md transition-colors duration-200"
                        on:click={() => goto('/')}
                >
                    Back
                </Button>
            </div>
        </section>

        {#if documentData}
            <div>
            <h2 class="text-xl font-bold mt-6 mb-4 text-white">Data preview</h2>
                <div class="overflow-y-auto border border-gray-300 rounded bg-white">
                <DataPreviewTable documentData={documentData} />
                </div>
            </div>

            <div>
            <h2 class="text-xl font-bold mt-6 mb-4 text-white">Metrics</h2>
                <div class="overflow-y-auto border border-gray-300 rounded bg-white">
                <MetricsTable documentData={documentData} />
                </div>
            </div>
            <div class="flex justify-center mt-6">
                <Button on:click={downloadJson} color="green">
                    Download Full JSON Document
                </Button>
            </div>
        {/if}
    </div>
</Section>