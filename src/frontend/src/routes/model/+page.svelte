<script lang="ts">
    import ModelNew from "../components/ModelNew.svelte";
    import ModelPreTrained from "../components/ModelPreTrained.svelte";
    import { Button } from "flowbite-svelte";
    import CancelButton from "../components/CancelButton.svelte";
    import NextButton from "../components/NextButton.svelte";
    import BackButton from "../components/BackButton.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { BACKEND_URL } from "../../stores/shared";
    import Error from "../components/Error.svelte";

    let useNewModel = true;
    let selectedModel: SelectedModel;
    let selectedVersion: string;
    let trained_models: TrainedModel[];
    let algorithms: NewAlgorithm[];
    let isLoading = true;
    let errorMessage: string;

    let algorithm_ids: number[] = [];
    let trained_model_ids: number[] = [];

    onMount(async () => {
        try {
            const idsResponse = await fetch(BACKEND_URL + '/algorithms/');
            if (!idsResponse.ok) {
                errorMessage=`Failed to fetch algorithms list: ${idsResponse.statusText}`;
            }

            const idsData = await idsResponse.json();
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
            console.error('Error:', error);
        }


        try {
            const idsResponse = await fetch(BACKEND_URL + '/trained_models/');
            if (!idsResponse.ok) {
                errorMessage=`Failed to fetch algorithms list: ${idsResponse.statusText}`;
            }

            const idsData = await idsResponse.json();
            trained_model_ids = idsData.models.flatMap(
                (m: { versions: Array<{ trained_model?: number }> }) =>
                    m.versions?.map((v) => v.trained_model).filter(Boolean) ?? []
            );

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
            console.error('Error:', error);
        }
        isLoading = false;
    });

    function submitModels() {
        sessionStorage.setItem('newModel', JSON.stringify(useNewModel));
        sessionStorage.setItem('selectedModel', JSON.stringify(selectedModel));
        sessionStorage.setItem('selectedVersion', JSON.stringify(selectedVersion))
        goto("/preview")
    }
</script>

{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

<h1 class="text-2xl font-bold text-center my-6">Choose the AI model to use</h1>
<div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <form on:submit|preventDefault={submitModels}
          class="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
        <!-- Models Side-by-Side -->
        <div class="flex flex-col md:flex-row gap-6 mb-6">
            <!-- New Model Box -->
            <div class={`flex-1 p-4 border rounded-lg transition ${
                    useNewModel ? "border-blue-500" : "border-gray-300 opacity-50 pointer-events-none"
                }`}
            >
                <h2 class="text-xl font-semibold mb-4 text-center">New Model</h2>
                {#if !isLoading}
                    <ModelNew availableAlgorithms={algorithms} bind:selectedModel />
                {:else}
                    <p>Loading...</p>
                {/if}
                <Button class="mt-4 w-full"
                        color="blue"
                        on:click={() => (useNewModel = false)}
                >
                    Use Pre-Trained Model
                </Button>
            </div>

            <!-- Pre-Trained Model Box -->
            <div class={`flex-1 p-4 border rounded-lg transition ${
                    useNewModel ? "border-gray-300 opacity-50 pointer-events-none" : "border-blue-500"
                }`}
            >
                <h2 class="text-xl font-semibold mb-4 text-center">Pre-Trained Model</h2>
                {#if !isLoading}
                    <ModelPreTrained trainedModels={trained_models} bind:selectedModel bind:selectedVersion/>
                {:else}
                    <p>Loading...</p>
                {/if}
                <Button class="mt-4 w-full"
                        color="blue"
                        on:click={() => (useNewModel = true)}
                >
                    Use New Model
                </Button>
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