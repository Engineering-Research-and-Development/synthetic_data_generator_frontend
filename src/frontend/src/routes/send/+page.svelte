<script lang="ts">
    import {BACKEND_URL} from "../../stores/shared";
    import {onMount} from "svelte";
    import Error from "../components/Error.svelte";

    type RowData = { [key: string]: any };

    let userFile: RowData[] = [];
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
    let sending: boolean = true
    let doc_id: string

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
        await sendData()
    });

    async function sendData() {
        let postData: SdgOut = {
            additional_rows: additionalRows,
            functions: generateOutFunctions(functionData),
            ai_model: generateAiModel(newModel, "test_name", selectedModel.id, selectedModel.version),
        };

        if (userFile.length>0) {
            postData["user_file"]= userFile
        }
        if (featuresCreated.length>0) {
            postData["features_created"] = featuresCreated
        }

        console.log(JSON.stringify(postData));
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
            sessionStorage.clear();
        } catch (error) {
            errorMessage="Error sending data:"+ error;
        }
    }
</script>

{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

{#if sending}
<div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <h1 class="flex justify-center text-2xl font-bold my-4">Sending data</h1><br>
    <p class="flex justify-center text-xl font-bold my-4">Please wait...</p>
</div>
{:else}
        <div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <h1 class="flex justify-center text-2xl font-bold my-4">Data sent successfully</h1><br>
            <h2 class="flex justify-center text-2xl font-bold my-4">Please check the results in a few time using the following id: {doc_id} </h2>
        </div>
{/if}