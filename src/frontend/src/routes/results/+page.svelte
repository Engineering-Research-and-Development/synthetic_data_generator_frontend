<script lang="ts">
    import { Button, Input} from 'flowbite-svelte';
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";
    import {COUCH_URL} from "../../stores/shared";
    import {get} from "svelte/store";
    import DataPreviewTable from "./components/DataPreviewTable.svelte";
    import MetricsTable from "./components/MetricsTable.svelte";

    import type {CouchJson} from "../../types/couch";

    let documentId: string;
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
{#if error}
    <div class="text-red-500 mb-4">{error}</div>
{/if}

<div class="flex flex-col pt-32 h-72">
    <h1 class="text-3xl font-bold text-white justify-center flex">Fetch the results document</h1>
    <div class="mb-4">
        <Input bind:value={documentId} placeholder="Enter Document ID" class="mb-2" />
        <Button on:click={fetchDocument}>Fetch Document</Button>
        <Button on:click={() => goto('/')}>SDG Home</Button>
    </div>


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