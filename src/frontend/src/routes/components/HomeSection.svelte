<script lang="ts">
    import { Modal, Fileupload, Button } from "flowbite-svelte";
    import { goto } from "$app/navigation";
    import { csvParse } from "d3";
    import {getEndpointUrl} from "$lib/config/utils";
    import Error from "./Error.svelte";
    import FullPageSpinner from "./FullPageSpinner.svelte";

    let uploadPopup: boolean = $state(false);
    let uploadedFile: File | null=$state(null);
    let showSpinner: boolean = $state(false);
    let isSubmitting:boolean = $state(false);
    let errorMessage: string | null = $state(null)

    function onFileSelected(event: Event): void {
        isSubmitting = true;
        const target = event.target as HTMLInputElement;
        let file = target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            errorMessage="File size exceeds 10 MB.";
            return;
        }
        uploadedFile = file;
    }
    function resetState() {
        uploadPopup = false;
    }

    function normalizeRow(row: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(row).map(([k, v]) => [
                k.trim(),
                typeof v === "string" && !isNaN(Number(v))
                    ? Number(v)
                    : v
            ])
        );
    }


    async function uploadAndParse(): Promise<void> {
        if (!uploadedFile) {
            errorMessage="No file selected.";
            return;
        }
        uploadPopup = false;

        setTimeout(() => {
            isSubmitting = true;
            showSpinner = true;
        }, 50);

        try {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    if (!reader.result) {
                        errorMessage = "The file is empty"
                        return
                    }

                    const content = reader.result.toString();
                    const parsedData = uploadedFile!.name.endsWith(".json")
                        ? JSON.parse(content)
                        : csvParse(content).map(normalizeRow);

                    sessionStorage.setItem(
                        "userFile",
                        JSON.stringify(parsedData)
                    );
                    showSpinner = false;
                    isSubmitting = false;
                    uploadPopup = false;
                    goto(getEndpointUrl("featureTypes"));
                } catch (err) {
                    errorMessage="Parsing failed. Check file format"
                } finally {
                    isSubmitting = false;
                    showSpinner = false;
                }
            };

            reader.readAsText(uploadedFile);
        } catch (error) {
            isSubmitting = false;
            errorMessage="Unexpected error during upload.";
        }
    }
</script>

{#if errorMessage}
    <Error bind:errorMessage/>
{/if}

<div class="flex justify-center space-x-4">
    <Button
            onclick={() => (uploadPopup = true)}
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
        Enhance Existing dataset
    </Button>
    {#if showSpinner}
        <FullPageSpinner text="Uploading..." />
    {/if}

    <Modal title="Upload a dataset" bind:open={uploadPopup} size="md" autoclose >
        <Fileupload
                accept=".csv,.json"
                on:change={onFileSelected}
                class="w-full"
        />

        <Button onclick={resetState}   class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">Cancel</Button>
        <Button
                onclick={uploadAndParse}
                disabled={!uploadedFile || !isSubmitting}
                class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
            Upload
        </Button>
    </Modal>
    <Button
            href={getEndpointUrl("create")}
            class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition">
        Create a dataset from scratch
    </Button>
    <Button
            href={getEndpointUrl("resultPage")}
            class="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition">
        Check the results
    </Button>
</div>