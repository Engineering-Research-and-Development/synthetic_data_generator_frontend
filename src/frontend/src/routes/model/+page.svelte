<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import { Section } from 'flowbite-svelte-blocks';
    import PageHeading from '../components/PageHeading.svelte';
    import Footer from '../components/layout/Footer.svelte';
    import Error from '../components/Error.svelte';
    import ModelNew from './components/ModelNew.svelte';
    import ModelPreTrained from './components/ModelPreTrained.svelte';
    import { BACKEND_URL } from '../../stores/shared';
    import type { SelectedModel } from '../../types/ambient';
    import type { Model, TrainedModel, Version } from '../../types/models';
    import type { NewAlgorithm } from '../../types/algorithms';
    import {Middleware} from "$lib/config/middleware";
    import {getEndpointUrl} from "$lib/config/utils";


    let useNewModel = true;
    let selectedModel: SelectedModel ;
    let newModelName = '';

    let algorithms: NewAlgorithm[] = [];
    let trainedModels: TrainedModel[] = [];

    let isLoading = true;
    let errorMessage: string | null = null;

    const backendUrl = get(BACKEND_URL);

    onMount(loadData);

    /* ──────────────────────────────
       Data loading
    ────────────────────────────── */

    async function loadData(): Promise<void> {
        try {
            algorithms = await loadAlgorithms();
            trainedModels = await loadTrainedModels();
        } catch (error) {
            errorMessage = error instanceof Error
                ? error.message
                : 'Unexpected error';
        } finally {
            isLoading = false;
        }
    }

    async function loadAlgorithms(): Promise<NewAlgorithm[]> {
        const response = await fetch(`${backendUrl}${Middleware.algorithms}`);
        if (!response.ok) {
            errorMessage= "Failed to fetch algorithms!";
        }

        const { algorithms } = await response.json();
        const ids = algorithms.map((a: { id: number }) => a.id);

        const results = await Promise.all(ids.map(fetchAlgorithm));

        return results.map(normalizeAlgorithmName);
    }

    async function fetchAlgorithm(id: number): Promise<NewAlgorithm> {
        const response = await fetch(`${backendUrl}${Middleware.algorithms}${id}`);
        if (!response.ok) {
            errorMessage = "Failed to fetch the selected algorithm"
        }

        const { algorithm, datatypes } = await response.json();

        return {
            ...algorithm,
            datatypes: datatypes.map((dt: any) => ({
                type: dt.type,
                is_categorical: dt.is_categorical
            }))
        };
    }

    function normalizeAlgorithmName(algorithm: NewAlgorithm): NewAlgorithm {
        const lastDot = algorithm.name.lastIndexOf('.');
        return {
            ...algorithm,
            name: lastDot >= 0
                ? algorithm.name.slice(lastDot + 1)
                : algorithm.name
        };
    }

    async function loadTrainedModels(): Promise<TrainedModel[]> {
        const response = await fetch(`${backendUrl}${Middleware.trained_models}`);
        if (!response.ok) {
            errorMessage= "Failed to fetch trained_models"
        }

        const { models } = await response.json();

        const ids = models.map(
            (m: { model: Model; version: Version }) => m.model.id
        );

        return Promise.all(ids.map(fetchTrainedModel));
    }

    async function fetchTrainedModel(id: number): Promise<TrainedModel> {
        const response = await fetch(`${backendUrl}${Middleware.trained_models}${id}`);
        if (!response.ok) {
            errorMessage = "Failed to fetch the selected trained model"
        }

        const data = await response.json();

        return {
            model: data.model,
            datatypes: data.datatypes,
            versions: data.versions
        };
    }

    /* ──────────────────────────────
       Submit
    ────────────────────────────── */

    function submit(): void {
        if (!selectedModel) {
            errorMessage = 'Please select a model';
            return;
        }

        sessionStorage.setItem('newModel', JSON.stringify(useNewModel));
        sessionStorage.setItem('selectedModel', JSON.stringify(selectedModel));
        sessionStorage.setItem('newModelName', JSON.stringify(newModelName));

        goto(getEndpointUrl("previewPage"));
    }
</script>

<Section>
    {#if errorMessage}
        <Error message={errorMessage} />
    {/if}

    <PageHeading text="AI Model Selection" />

    <form
            on:submit|preventDefault={submit}
            class="p-6 bg-white rounded-lg shadow-md"
    >
        <div class="flex w-full md:flex-row gap-6 mb-6">

            <!-- New model -->
            <div
                    class={`w-1/2 p-4 border rounded-lg cursor-pointer transition
                ${useNewModel ? 'border-blue-500' : 'border-gray-300 opacity-50'}`}
                    role="button"
                    tabindex="0"
                    on:click={() => (useNewModel = true)}
                    on:keydown={(e) =>
                    (e.key === 'Enter' || e.key === ' ') && (useNewModel = true)
                }
            >
                <h2 class="text-xl font-semibold mb-4 text-center">
                    New model from blueprint
                </h2>

                {#if isLoading}
                    <p>Loading...</p>
                {:else}
                    <ModelNew
                            availableAlgorithms={algorithms}
                            bind:selectedModel
                            bind:newModelName
                    />
                {/if}
            </div>

            <!-- Pre-trained model -->
            <div
                    class={`w-1/2 p-4 border rounded-lg cursor-pointer transition
                ${useNewModel ? 'border-gray-300 opacity-50' : 'border-blue-500'}`}
                    role="button"
                    tabindex="0"
                    on:click={() => (useNewModel = false)}
                    on:keydown={(e) =>
                    (e.key === 'Enter' || e.key === ' ') && (useNewModel = false)
                }
            >
                <h2 class="text-xl font-semibold mb-4 text-center">
                    Use a pre-trained model
                </h2>

                {#if isLoading}
                    <p>Loading...</p>
                {:else}
                    <ModelPreTrained
                            trainedModels={trainedModels}
                            selectedModel={selectedModel}
                    />
                {/if}
            </div>
        </div>

        <Footer />
    </form>
</Section>
