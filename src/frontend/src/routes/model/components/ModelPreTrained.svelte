<script lang="ts">
    import {
        Label,
        Select,
        Table,
        TableHead,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHeadCell
    } from 'flowbite-svelte';

    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { BACKEND_URL } from '../../../stores/shared';
    import Error from '../../components/Error.svelte';
    import type {SelectedModel} from "../../../types/ambient";
    import type {TrainedModel} from "../../../types/models";
    import {Middleware} from "$lib/config/middleware";


    let {
        trainedModels,
        selectedModel
    }: {
        trainedModels: TrainedModel[];
        selectedModel: SelectedModel;
    } = $props();

    let chosenModel: string = $state("");
    let selectedVersion: string= $state("");
    let errorMessage: string | undefined= $state("");

    let newModels: { value: string; name: string }[] = $state([]);

    const models = $derived(
        trainedModels.find(
            (model) => model.model.name === chosenModel
        ) ?? null
    );

    const selectedVersionLabel = $derived(
        models
            ? models.versions.map((version) => ({
                value: version.version_name,
                name: version.version_name.toString()
            }))
            : []
    );

    const versionInfo = $derived(
        models && selectedVersion
            ? models.versions.find(
            (version) =>
                version.version_name === selectedVersion
        ) ?? null
            : null
    );

    const featureType = $derived(
        models ? models.datatypes : []
    );

    onMount(() => {
        try {
            newModels = trainedModels.map((model) => ({
                value: model.model.name,
                name: model.model.name
            }));
        } catch (error) {
            errorMessage = `Error fetching trained models: ${error}`;
        }
    });

    $effect(() => {
        if (!models || !selectedVersion) {
            return;
        }

        selectedModel = {
            id: models.model.id,
            name: models.model.name,
            version: selectedVersion
        };
    });

    $effect(() => {
        if (!models) {
            return;
        }

        if (models.model.algorithm_name !== undefined) {
            return;
        }

        fetchAlgorithmName(models);
    });

    async function fetchAlgorithmName(model: TrainedModel): Promise<void> {
        try {
            const response = await fetch(
                `${get(BACKEND_URL)}${Middleware.algorithms}${model.model.algorithm}`
            );

            const data = await response.json();

            if (data?.algorithm?.name) {
                model.model.algorithm_name = data.algorithm.name;
            }
        } catch (error) {
            errorMessage = `Error fetching algorithm info: ${error}`;
        }
    }
</script>


{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

<div class="w-full">
    <!-- Dropdown for model selection -->
    <div class="w-full">
        <Label>
            Select a model
            <Select class="mt-2" items={newModels} bind:value={chosenModel} />
        </Label>
    </div>

    <!-- Label list for selecting version_id -->
    <div class="w-full">
        <Label>
            Available Version IDs:
            <Select class="mt-2" items={selectedVersionLabel} bind:value={selectedVersion} />
        </Label>
    </div>

    <!-- Table to display selected model details -->
    <div class="w-full mt-8">
        {#if models}
            <Table>
                <TableHead>
                    <TableHeadCell class="font-bold">Property</TableHeadCell>
                    <TableHeadCell class="font-bold">Value</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow>
                        <TableBodyCell>Name</TableBodyCell>
                        <TableBodyCell>{models.model.name}</TableBodyCell>
                    </TableBodyRow>
                    <TableBodyRow>
                        <TableBodyCell>Dataset Name</TableBodyCell>
                        <TableBodyCell>{models.model.dataset_name}</TableBodyCell>
                    </TableBodyRow>
                    <TableBodyRow>
                        <TableBodyCell>Input Shape</TableBodyCell>
                        <TableBodyCell>{models.model.input_shape}</TableBodyCell>
                    </TableBodyRow>
                    <TableBodyRow>
                        <TableBodyCell>Algorithm</TableBodyCell>
                        <TableBodyCell>{models.model.algorithm_name}</TableBodyCell>
                    </TableBodyRow>
                    <TableBodyRow>
                        <TableBodyCell>Size</TableBodyCell>
                        <TableBodyCell>{models.model.size}</TableBodyCell>
                    </TableBodyRow>

                    <!-- Display Version Info -->
                    {#if versionInfo}
                        <TableBodyRow>
                            <TableBodyCell>Loss Function</TableBodyCell>
                            <TableBodyCell>{versionInfo.loss_function}</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell>Loss Values</TableBodyCell>
                            <TableBodyCell>Train: {versionInfo.train_loss} | Val: {versionInfo.val_loss}</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell>Dataset Sizes</TableBodyCell>
                            <TableBodyCell>Train: {versionInfo.train_samples} | Val: {versionInfo.val_samples}</TableBodyCell>
                        </TableBodyRow>
                    {/if}

                    {#if featureType.length > 0}
                        {#each featureType as feature}
                            <TableBodyRow>
                                <TableBodyCell>Feature Info</TableBodyCell>
                                <TableBodyCell>
                                    {feature.feature_name} (Pos: {feature.feature_position}) |
                                    {feature.is_categorical ? 'Categorical' : 'Numerical'} |
                                    Type: {feature.type}
                                </TableBodyCell>
                            </TableBodyRow>
                        {/each}
                    {/if}
                </TableBody>
            </Table>
        {:else}
            <p class="text-gray-500">Please select a model from the dropdown.</p>
        {/if}
    </div>
</div>