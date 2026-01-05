<script lang="ts">
    import { Modal, Fileupload, Button, Spinner } from 'flowbite-svelte';
    import { goto } from "$app/navigation";
    import CancelButton from "./CancelButton.svelte";
    import {csvParse} from "d3";

    export let showPopup: boolean;
    export let uploadedFile: File | null;
    let isSubmitting: boolean = false;

    function handleFileUpload(event: Event): void {
        isSubmitting = true;
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
            alert('No file selected.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10 MB. Please upload a smaller file.');
            return;
        }

        uploadedFile = file;
    }

    async function submitForm(event: Event): Promise<void> {
        event.preventDefault();

        if (!uploadedFile) {
            alert('No file uploaded. Please upload a file first.');
            return;
        }
        try {
            const reader = new FileReader();

            reader.onloadend = () => {
                if (reader.result) {
                    try {
                        let parsedData;
                        if (uploadedFile?.name.endsWith('.json')) {
                            parsedData = JSON.parse(reader.result.toString());
                        } else {
                            parsedData = csvParse(reader.result.toString());
                        }
                        sessionStorage.setItem('userFile', JSON.stringify(parsedData));
                        goto('/feature');
                    } catch (error) {
                        console.error('Parsing failed:', error);
                        alert('Parsing failed. Please check your file and try again.');
                    }
                } else {
                    alert('Failed to read file. Please try again.');
                }
            };

            reader.readAsText(uploadedFile);
        } catch (error) {
            alert('An error occurred while uploading the file. Please try again.');
        }
        isSubmitting = false;
    }
</script>

{#if isSubmitting}
    <div class="absolute inset-0 bg-black opacity-90 flex items-center justify-center z-50">
        <div class="flex flex-col items-center">
            <Spinner size="xl" />
            <span class="text-white mt-4">Uploading...</span>
        </div>
    </div>
{/if}

<Modal bind:open={showPopup} size="md" autoclose outsideclose>
    <div slot="header">Upload Data File</div>

    <div class="p-4">
        <form on:submit|preventDefault={submitForm}>
            <div class="mb-4">
                <label
                        for="dataFile"
                        class="block text-sm font-medium text-gray-700 mb-2"
                >
                    Choose a CSV or JSON file
                </label>
                <Fileupload
                        id="dataFile"
                        type="file"
                        accept=".csv,.json"
                        on:change={handleFileUpload}
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring focus:border-blue-300"
                        required
                />
            </div>
            <div class="flex justify-end">
                <CancelButton />
                <Button
                        type="submit"
                        on:click={submitForm}
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Upload
                </Button>
            </div>
        </form>
    </div>
</Modal>