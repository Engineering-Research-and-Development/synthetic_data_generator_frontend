<script lang="ts">
    import { Modal, Fileupload, Button, Spinner } from "flowbite-svelte";
    import { goto } from "$app/navigation";
    import { csvParse } from "d3";
    import {getEndpointUrl} from "$lib/config/utils";

    let {uploadPopup=$bindable()} = $props();
    let uploadedFile: File | null=$state(null);
    let showSpinner: boolean = $state(false);
    let isSubmitting:boolean = $state(false);

    function onFileSelected(event: Event): void {
        isSubmitting = true;
        const target = event.target as HTMLInputElement;
        let file = target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10 MB.");
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
            alert("No file selected.");
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
                        throw new Error("Empty file");

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
                    console.error(err);
                    alert("Parsing failed. Check file format.");
                } finally {
                    isSubmitting = false;
                    showSpinner = false;
                }
            };

            reader.readAsText(uploadedFile);
        } catch (error) {
            isSubmitting = false;
            alert("Unexpected error during upload.");
        }
    }
</script>

<div class="flex justify-center space-x-4">
    <Button
            onclick={() => (uploadPopup = true)}
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
        Enhance Existing dataset
    </Button>
    {#if showSpinner}
        <div class="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300">
            <div class="flex flex-col items-center">
                <Spinner type="bars" color="blue" size="xl" />
                <span class="text-white mt-4 text-lg font-medium">Uploading...</span>
            </div>
        </div>
    {/if}

    <Modal title="Upload a dataset" bind:open={uploadPopup} size="md" autoclose >
        <Fileupload
                accept=".csv,.json"
                on:change={onFileSelected}
                class="w-full"
        />

        <Button onclick={resetState}>Cancel</Button>
        <Button
                onclick={uploadAndParse}
                disabled={!uploadedFile || !isSubmitting}
        >
            Upload
        </Button>
    </Modal>
    <Button
            href={getEndpointUrl("create")}
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
        Create a dataset from scratch
    </Button>
    <Button
            href={getEndpointUrl("resultPage")}
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
        Check the results
    </Button>
</div>