<script lang="ts">
    import {BACKEND_URL} from "../../stores/shared";
    import {onMount} from "svelte";
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";
    import {Button} from "flowbite-svelte";
    import {Section} from "flowbite-svelte-blocks";
    import type {FeaturesCreated, SelectedModel} from "../../types/ambient";
    import type {
        AIModel,
        FeatureConfig, FeatureFunctionParameters,
        SdgOut
    } from "../../types/middlewarePost";
    import {MiddlewareUrls} from "$lib/config/middlewareUrls";
    import {get} from "svelte/store";
    import { StorageService } from "$lib/services/StorageService";

    let userFile: Array<{number: Array<{string: number}>}> = [];
    let additionalRows: number = 0;
    let functionData:FeatureFunctionParameters[];
    let featureTypes: FeatureConfig;
    let newModel: boolean = false;
    let selectedModel: SelectedModel;
    let featuresCreated: FeaturesCreated[] = [];
    let doc_id: string = $state("");
    let newModelName: string;
    let backendUrl = get(BACKEND_URL);
    type Status = "idle" | "sending" | "success" | "error";

    let status = $state<Status>("idle");
    let errorMessage = $state("");


    function generateAiModel(newModel: boolean, newModelName: string, selectedModelId: number,  selectedVersion?: string): AIModel{
        return {
            selected_model_id: selectedModelId,
            model_version: selectedVersion,
            new_model: newModel,
            ...(newModelName && { new_model_name: newModelName }),
        };
    }

    onMount(async () => {
        additionalRows = Number(sessionStorage.getItem("additionalRows")) || 0;
        functionData = StorageService.getJson("functionData", []);
        newModel = StorageService.getJson("newModel", false);
        selectedModel = StorageService.getJson("selectedModel", {} as SelectedModel);
        userFile = StorageService.getJson("userFile", []);
        featuresCreated = StorageService.getJson("featuresCreated", []);
        newModelName = StorageService.getJson("newModelName", "");
        featureTypes = StorageService.getJson("featureTypes", {} as FeatureConfig);

        await sendData();
    });

    async function sendData() {
        status = "sending";
        let userData = null;

        if (userFile.length > 0) {
            userData = {
                input_type: "user_file",
                user_file: userFile,
                ai_model: generateAiModel(newModel, newModelName, selectedModel.id, selectedModel.version),
                ...(functionData.length > 0 && { functions: functionData })
            };
        } else {
            userData = {
                input_type: "features_created",
                features_created: featuresCreated,
                functions: functionData
            };
        }

        let postData: SdgOut = {
            additional_rows: additionalRows,
            data: userData,
            ...(Object.keys(featureTypes).length > 0 && {feature_types: featureTypes})
        };

        try {
            const response = await fetch(`${backendUrl}${MiddlewareUrls.sdg_input}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                const result = await response.json();
                doc_id = result.doc_id;
                status = "success";
                sessionStorage.clear();
            } else {
                console.log(postData);
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message ?? JSON.stringify(errorBody);
                } else {
                    errorMessage = await response.text();
                }
                status = "error";
                return;
            }

        } catch (error: any) {
            errorMessage = error.message;
            status = "error";
        }
    }
</script>

<Section>
    <div class="flex flex-col gap-6 w-3/4 mx-auto">
        {#if status === "sending"}
            <h1 class="text-3xl font-bold text-white justify-center flex text-center">
                Sending data...
            </h1>
            <p class="text-xl font-bold text-white justify-center flex text-center">
                Please wait, this may take a few moments.
            </p>

        {:else if status === "success"}
            <h1 class="text-3xl font-bold text-white justify-center flex text-center">
                Data sent successfully!
            </h1>
            <h2 class="text-xl font-bold text-white justify-center flex flex-col items-center text-center">
                Please check the results in a few minutes using the following ID:
                <span class="text-blue-600 break-all">{doc_id}</span>
            </h2>
        {:else if status === "error"}
            <Error bind:errorMessage/>
            <h1 class="text-3xl font-serif font-semibold tracking-wide text-[#e6e1d5] justify-center flex text-center
         drop-shadow-[0_0_6px_rgba(120,30,30,0.4)]">
                The attempt has failed. Rise once more, and try again.
            </h1>
        {/if}

        <Button
                class="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
                on:click={() => goto('/')}
        >
            SDG Home
        </Button>
    </div>
</Section>