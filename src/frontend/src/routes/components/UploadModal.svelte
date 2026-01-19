<script lang="ts">
    import { Modal, Fileupload, Button, Spinner } from "flowbite-svelte";
    import { goto } from "$app/navigation";
    import CancelButton from "./CancelButton.svelte";
    import { csvParse } from "d3";
    import {getEndpointUrl} from "$lib/config/utils";

    let {uploadPopup} = $props();
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
                        : csvParse(content);

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

{#if showSpinner}
    <div class="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300">
        <div class="flex flex-col items-center">
            <Spinner type="bars" color="blue" size="xl" />
            <span class="text-white mt-4 text-lg font-medium">Uploading...</span>
        </div>
    </div>
{/if}

<Modal bind:open={uploadPopup} size="md" autoclose>
        Upload Data File
        <Fileupload
                accept=".csv,.json"
                on:change={onFileSelected}
                class="w-full"
        />

        <CancelButton />
        <Button
                on:click={uploadAndParse}
                disabled={!uploadedFile || !isSubmitting}
        >
            Upload
        </Button>
</Modal>