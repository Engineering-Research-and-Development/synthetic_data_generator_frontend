<script lang="ts">
    import {BACKEND_URL} from "../../stores/shared";
    import {onMount} from "svelte";
    import Error from "../components/Error.svelte";
    import {goto} from "$app/navigation";
    import {Button} from "flowbite-svelte";

    let userFile: Array<{number: Array<{string: number}>}> = [];
    let additionalRows: number = 0;
    let functionData: Record<string, Array<{
        functionId: number;
        functionName: string;
        parameters: Array<Parameter>
    }>> = {};
    let newModel: boolean = false;
    let selectedModel: SelectedModel;
    let featuresCreated: FeaturesCreated[] = [];
    let errorMessage: string;
    let sending: boolean = true;
    let doc_id: string;
    let newModelName: string;
    function generateOutFunctions(featureFunctions: Record<string, { functionName: string; functionId: number,parameters: Parameter[] }[]>): OutFunction[] {
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
            new_model_name: newModelName
        }
    }

    onMount(async () => {
        additionalRows = Number(sessionStorage.getItem("additionalRows")) || 0;
        functionData = JSON.parse(sessionStorage.getItem("functionData") || "{}");
        newModel = JSON.parse(sessionStorage.getItem("newModel") || "false");
        selectedModel = JSON.parse(sessionStorage.getItem("selectedModel") || "");
        userFile = JSON.parse(sessionStorage.getItem("userFile") || "{}");
        featuresCreated = JSON.parse(sessionStorage.getItem("featuresCreated") || "[]");
        newModelName = JSON.parse(sessionStorage.getItem("newModelName") || "");
        await sendData()
    });

    async function sendData() {
        let postData: SdgOut = {
            additional_rows: additionalRows,
            functions: generateOutFunctions(functionData),
            ai_model: generateAiModel(newModel, newModelName, selectedModel.id, selectedModel.version),
        };

        if (userFile.length>0) {
            postData["user_file"]= userFile
        }
        if (featuresCreated.length>0) {
            postData["features_created"] = featuresCreated
        }

        console.debug(postData);
        try {
            const response = await fetch(`${BACKEND_URL}/sdg_input/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
            if (!response.ok) {
                errorMessage="An error occurred";
            }
            const result = await response.json();
            doc_id = result.doc_id
            console.log("Data sent successfully:", result);
            sending = false
            //sessionStorage.clear();
        } catch (error) {
            errorMessage="Error sending data:"+ error;
        }
    }
</script>

{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

{#if sending}
    <div class="items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <h1 class="text-2xl font-bold my-4 text-center">
            Sending data...
        </h1>
        <p class="text-xl font-bold my-4 text-center">
            Please wait, this may take a few moments.
        </p>
    </div>
{:else}
    <div class="items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <h1 class="text-2xl font-bold my-4 text-center">
            Data sent successfully!
        </h1>
        <h2 class="text-2xl font-bold my-4 text-center">
            Please check the results in a few minutes
            using the following ID:
            <span class="text-blue-600">{doc_id}</span>
        </h2>
        <Button
                class="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                on:click={() => goto('/')}
        >
            SDG Home
        </Button>
    </div>
{/if}