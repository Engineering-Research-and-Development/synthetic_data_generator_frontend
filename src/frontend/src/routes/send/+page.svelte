<script lang="ts">
    import {BACKEND_URL} from "../../stores/shared";
    import {onMount} from "svelte";
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";
    import {Button} from "flowbite-svelte";
    import {Section} from "flowbite-svelte-blocks";
    import type {FeaturesCreated, Parameter, SelectedModel} from "../../types/ambient";
    import type {AIModel, FeatureConfig, OutFunction, OutParameter, SdgOut} from "../../types/middlewarePost";
    import {Middleware} from "$lib/config/middleware";
    import {get} from "svelte/store";

    let userFile: Array<{number: Array<{string: number}>}> = [];
    let additionalRows: number = 0;
    let functionData: Record<string, Array<{
        functionId: number;
        functionName: string;
        parameters: Array<Parameter>
    }>> = {};
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

    function generateOutFunctions(featureFunctions: Record<string, { functionName: string; functionId: number,parameters: Parameter[] }[]>): OutFunction[]  {
        let outFunctions: OutFunction[] = [];

        for (const [feature, functions] of Object.entries(featureFunctions)) {
            functions.forEach((func) => {
                const parameters: OutParameter[] = func.parameters.map(param => ({
                    param_id: param.id,
                    value: parseFloat(param.value)
                }));

                outFunctions.push({
                    feature: feature,
                    function_id: func.functionId,
                    parameters: parameters
                });
            });
        }

        return outFunctions;
    }

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
        functionData = JSON.parse(sessionStorage.getItem("functionData") || "{}");
        newModel = JSON.parse(sessionStorage.getItem("newModel") || "false");
        selectedModel = JSON.parse(sessionStorage.getItem("selectedModel") || "");
        userFile = JSON.parse(sessionStorage.getItem("userFile") || "{}");
        featuresCreated = JSON.parse(sessionStorage.getItem("featuresCreated") || "[]");
        newModelName = JSON.parse(sessionStorage.getItem("newModelName") || "");
        featureTypes = JSON.parse(sessionStorage.getItem("featureTypes") || "[]");
        await sendData()
    });

    async function sendData() {
        let userData = null;
        status = "sending";
        if (userFile.length>0) {
            userData = {input_type: "user_file", user_file: userFile}
        }
        else {
            userData = {input_type: "features_created", features_created: featuresCreated}
        }
        let postData: SdgOut = {
            additional_rows: additionalRows,
            ai_model: generateAiModel(newModel, newModelName, selectedModel.id, selectedModel.version),
            data: userData
        };
        let outFunctions = generateOutFunctions(functionData)
        if (outFunctions.length>0) {
            postData.functions = outFunctions
        }
        if (Object.keys(featureTypes).length > 0) {
            postData.feature_types = featureTypes;
        }

        try {
            const response = await fetch(`${backendUrl}${Middleware.sdg_input}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
            sessionStorage.clear();
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message ?? JSON.stringify(errorBody);
                } else {
                    errorMessage = await response.text();
                    status= "error";
                }
                return;
            }
            const result = await response.json();
            doc_id = result.doc_id;
            status= "success";

        } catch (error: any) {
            errorMessage = error.message;
            status= "error";
        }
    }
</script>

<Section>
    <div class="flex flex-col gap-6 w-3/4 mx-auto">
        {#if status === "sending"}
            <h1 class="text-3xl font-bold text-white justify-center flex">
                Sending data...
            </h1>
            <p class="text-xl font-bold text-white justify-center flex">
                Please wait, this may take a few moments.
            </p>

        {:else if status === "success"}
            <h1 class="text-3xl font-bold text-white justify-center flex">
                Data sent successfully!
            </h1>
            <h2 class="text-xl font-bold text-white justify-center flex">
                Please check the results in a few minutes
                using the following ID:
                <span class="text-blue-600">{doc_id}</span>
            </h2>
        {:else if status === "error"}
            <Error bind:errorMessage/>
            <h1 class="text-3xl font-serif font-semibold tracking-wide text-[#e6e1d5] justify-center flex
         drop-shadow-[0_0_6px_rgba(120,30,30,0.4)]">
                The attempt has failed. Rise once more, and try again.
            </h1>

        {/if}

        <Button
            class="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            on:click={() => goto('/')}
        >
            SDG Home
        </Button>
    </div>
</Section>