<script lang="ts">
    import { onMount} from 'svelte';
    import { goto } from '$app/navigation';
    import { Section } from 'flowbite-svelte-blocks';
    import {Card, Heading} from 'flowbite-svelte';
    import type { SelectedModel } from '../../types/ambient';
    import type { NewAlgorithm } from '../../types/algorithms';
    import type { TrainedModel } from '../../types/models';
    import ModelPreTrained from "./components/ModelPreTrained.svelte";
    import ModelNew from "./components/ModelNew.svelte";
    import PageHeading from "../components/layout/PageHeading.svelte";
    import Error from "../components/Error.svelte";
    import {ModelService} from "$lib/services/ModelService";
    import {navState} from "$lib/config/navigation.svelte";
    import {getEndpointUrl} from "$lib/config/utils";
    import Footer from "../components/layout/Footer.svelte";


    const modelService = new ModelService();
    let useNewModel = $state(true);
    let isLoading = $state(true);
    let errorMessage = $state<string | null>(null);

    let selectedNew = $state<SelectedModel | null>(null);
    let selectedPreTrained = $state<SelectedModel | null>(null);
    let newModelName = $state('');

    let algorithms = $state<NewAlgorithm[]>([]);
    let trainedModels = $state<TrainedModel[]>([]);

    const selectedModel = $derived(useNewModel ? selectedNew : selectedPreTrained);

    onMount(async () => {
        try {
            [algorithms, trainedModels] = await Promise.all([
                modelService.fetchAlgorithms(),
                modelService.fetchTrainedModels()
            ]);
        } catch (e: any) {
            errorMessage = e.message;
        } finally {
            isLoading = false;
        }
    });

    function submit(event: SubmitEvent) {
        event.preventDefault();
        if (!useNewModel && selectedModel != null) {
            selectedModel.new=false;
        }
        sessionStorage.setItem('selectedModel', JSON.stringify(selectedModel));
        goto(navState.getNextLink(getEndpointUrl("modelPage"))!);
    }
</script>

<Section>
    <PageHeading text="AI Model Selection" />
    {#if errorMessage}
        <Error bind:errorMessage />
    {/if}

    <form onsubmit={submit} class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

            <Card
                padding="md"
                class="min-w-[500px] cursor-pointer border-2 transition-all {useNewModel ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 opacity-50 grayscale'}"
                onclick={() => (useNewModel = true)}
                >
                <Heading tag="h3" class="mb-4 text-center text-lg font-bold text-gray-900">New Blueprint</Heading>
                <div class={!useNewModel ? 'pointer-events-none' : ''}>
                    {#if !isLoading}
                        {#key useNewModel}
                        <ModelNew
                                availableAlgorithms={algorithms}
                                bind:selectedModel={selectedNew}
                                bind:newModelName
                        />
                        {/key}
                    {/if}
                </div>
            </Card>

            <Card
                    padding="md"
                    class="min-w-[500px] cursor-pointer border-2 transition-all {!useNewModel ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 opacity-50 grayscale'}"
                    onclick={() => (useNewModel = false)}
            >
                <Heading tag="h3" class="mb-4 text-center text-lg font-bold text-gray-900">Pre-trained</Heading>
                <div class={useNewModel ? 'pointer-events-none' : ''}>
                    {#if !isLoading}
                        <ModelPreTrained
                                bind:selectedModel={selectedPreTrained}
                                {trainedModels}
                        />
                    {/if}
                </div>
            </Card>
        </div>
        <Footer />
    </form>
</Section>