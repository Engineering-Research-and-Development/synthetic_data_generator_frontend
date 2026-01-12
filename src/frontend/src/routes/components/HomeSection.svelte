<script lang="ts">
import {Button} from "flowbite-svelte";
import {Endpoints} from "$lib/config/uiEndpoints";
import UploadModal from "./UploadModal.svelte";

let uploadedFile: File | null = $state(null);
let showPopup: boolean = $state(false);
</script>

<div class="flex justify-center space-x-4">
    <Button
            onclick={() => (showPopup = true)}
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
        Enhance Existing dataset
    </Button>
<!--    <Button-->
<!--            href={Endpoints.create}-->
<!--            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">-->
<!--        Create a dataset from scratch-->
<!--    </Button>-->
    <Button
            href={Endpoints.resultPage}
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
        Check the results
    </Button>
</div>

<UploadModal bind:showPopup bind:uploadedFile />