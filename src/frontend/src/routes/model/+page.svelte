<script lang="ts">
    import ModelNew from "../components/ModelNew.svelte";
    import ModelPreTrained from "../components/ModelPreTrained.svelte";
    import CancelButton from "../components/CancelButton.svelte";
    import NextButton from "../components/NextButton.svelte";
    import BackButton from "../components/BackButton.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { BACKEND_URL } from "../../stores/shared";
    import Error from "../components/Error.svelte";

    let useNewModel = true;
    let selectedModel: SelectedModel;
    let trained_models: TrainedModel[];
    let algorithms: NewAlgorithm[];
    let isLoading = true;
    let errorMessage: string;
    let newModelName: string = "";

    onMount(async () => {
        try {
            const idsResponse = await fetch(BACKEND_URL + '/algorithms/');
            if (!idsResponse.ok) {
                errorMessage=`Failed to fetch algorithms list: ${idsResponse.statusText}`;
            }

            const idsData = await idsResponse.json();
            let algorithm_ids: number[] = [];
            algorithm_ids = idsData.algorithms.map((a: { id: number }) => a.id);

            algorithms = await Promise.all(
                algorithm_ids.map(async (id) => {
                    const response = await fetch(`${BACKEND_URL}/algorithms/${id}`);
                    if (!response.ok) {
                        errorMessage=`Failed to fetch algorithm ${id}: ${response.statusText}`;
                    }

                    const data = await response.json();
                    return {
                        ...data.algorithm,
                        datatypes: data.datatypes.map((dt: any) => ({
                            type: dt.type,
                            is_categorical: dt.is_categorical
                        }))
                    } as NewAlgorithm;
                })
            );
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        }

        algorithms.forEach(algorithm => {
            const lastDotIndex = algorithm.name.lastIndexOf('.');
            algorithm.name = lastDotIndex !== -1 ? algorithm.name.slice(lastDotIndex + 1) : algorithm.name;
        });


        try {
            const idsResponse = await fetch(BACKEND_URL + '/trained_models/');
            if (!idsResponse.ok) {
                errorMessage=`Failed to fetch algorithms list: ${idsResponse.statusText}`;
            }

            const idsData = await idsResponse.json();

            let models = idsData.models;
            let trained_model_ids: number[] = [];
            models.forEach((model: {model: Model, version: Version}) => {
                trained_model_ids.push(model.model.id);
            });

            trained_models = await Promise.all(
                trained_model_ids.map(async (id) => {
                    const response = await fetch(`${BACKEND_URL}/trained_models/${id}`);
                    if (!response.ok) {
                        errorMessage=`Failed to fetch algorithm ${id}: ${response.statusText}`;
                    }

                    const data = await response.json();
                    return {
                        model: data.model,
                        datatypes: data.datatypes,
                        versions: data.versions
                    } as TrainedModel;
                })
            );
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        }
        isLoading = false;
    });

    function submitModels() {
        if (selectedModel === undefined ) {
            errorMessage = "Please select a model";
            return
        }
        sessionStorage.setItem('newModel', JSON.stringify(useNewModel));
        sessionStorage.setItem('selectedModel', JSON.stringify(selectedModel));
        sessionStorage.setItem('newModelName', JSON.stringify(newModelName))
        goto("/preview")
    }
</script>

{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

<h1 class="text-3xl font-bold text-white justify-center flex">AI Model Selection</h1>
<div class="flex items-center justify-center">
    <form on:submit|preventDefault={submitModels}
          class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
        <!-- Models Side-by-Side -->
        <div class="flex w-full md:flex-row gap-6 mb-6">


            <!-- New Model Box -->
            <div
                class={`w-1/2 p-4 border rounded-lg transition cursor-pointer
                ${useNewModel ? "border-blue-500" : "border-gray-300 opacity-50"}`}
                role="button"
                tabindex="0"
                on:click={() => (useNewModel = true)}
                on:keydown={(e) => (e.key === "Enter" || e.key === " ") && (useNewModel = true)}
            >
                <h2 class="text-xl font-semibold mb-4 text-center">New model from blueprint</h2>
                {#if !isLoading}
                    <ModelNew availableAlgorithms={algorithms} bind:selectedModel bind:newModelName />
                {:else}
                    <p>Loading...</p>
                {/if}
            </div>

            <!-- Pre-Trained Model Box -->
            <div
                class={`w-1/2 p-4 border rounded-lg transition cursor-pointer
                 ${useNewModel ? "border-gray-300 opacity-50" : "border-blue-500"}`}
                role="button"
                tabindex="0"
                on:click={() => (useNewModel = false)}
                on:keydown={(e) => (e.key === "Enter" || e.key === " ") && (useNewModel = false)}
            >
                <h2 class="text-xl font-semibold mb-4 text-center">Use a pre-trained model</h2>
                {#if !isLoading}
                    <ModelPreTrained trainedModels={trained_models} bind:selectedModel/>
                {:else}
                    <p>Loading...</p>
                {/if}
            </div>


        </div>

        <!-- Buttons Below -->
        <div class="flex justify-end gap-4">
            <BackButton />
            <CancelButton />
            <NextButton />
        </div>
    </form>
</div>