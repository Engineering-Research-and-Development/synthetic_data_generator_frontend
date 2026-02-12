<script lang="ts">
    import {
        Label, Select, Table, TableHead, TableBody,
        TableBodyCell, TableBodyRow, TableHeadCell
    } from 'flowbite-svelte';
    import ErrorComponent from '../../components/Error.svelte';
    import type { TrainedModel } from "../../../types/models";
    import type {SelectedModel} from "../../../types/ambient";
    import {ModelSelectorController} from "../controllers/model-selection.svelte.js";

    let {
        selectedModel = $bindable(),
        trainedModels
    }: {
        selectedModel: SelectedModel | null,
        trainedModels: TrainedModel[]
    } = $props();

    const ctrl = new ModelSelectorController(() => trainedModels);

    $effect(() => {
        if (ctrl.activeModel && ctrl.selectedVersionName) {
            selectedModel = {
                id: ctrl.activeModel.model.id,
                name: ctrl.activeModel.model.name,
                version: ctrl.selectedVersionName,
                new: false
            };
        }
        if (ctrl.activeModel && !ctrl.selectedVersionName) {
            ctrl.selectedVersionName = ctrl.versionOptions[0].name;
        }
    });

    $effect(() => {
        if (ctrl.activeModel) ctrl.loadAlgorithm();
    });
</script>

{#if ctrl.errorMessage}
    <ErrorComponent errorMessage={ctrl.errorMessage}/>
{/if}

<div class="space-y-6 w-full">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Label>
            Select a model
            <Select class="mt-2" items={ctrl.modelOptions} bind:value={ctrl.chosenModelName} />
        </Label>

        <Label>
            Available Version IDs:
            <Select class="mt-2" items={ctrl.versionOptions} bind:value={ctrl.selectedVersionName} />
        </Label>
    </div>

    {#if ctrl.activeModel}
        <Table hoverable={true} shadow={true}>
            <TableHead>
                <TableHeadCell>Property</TableHeadCell>
                <TableHeadCell>Value</TableHeadCell>
            </TableHead>
            <TableBody>
                <TableBodyRow>
                    <TableBodyCell class="font-bold">Name</TableBodyCell>
                    <TableBodyCell>{ctrl.activeModel.model.name}</TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell class="font-bold">Algorithm</TableBodyCell>
                    <TableBodyCell>{ctrl.algorithmName ?? 'Loading...'}</TableBodyCell>
                </TableBodyRow>

                {#if ctrl.activeVersion}
                    <TableBodyRow>
                        <TableBodyCell class="font-bold">Loss ({ctrl.activeVersion.loss_function})</TableBodyCell>
                        <TableBodyCell>
                            Train: {ctrl.activeVersion.train_loss} | Val: {ctrl.activeVersion.val_loss}
                        </TableBodyCell>
                    </TableBodyRow>
                {/if}

                {#each ctrl.activeModel.datatypes as feature}
                    <TableBodyRow>
                        <TableBodyCell>Feature: {feature.feature_name}</TableBodyCell>
                        <TableBodyCell>
                            {feature.type} ({feature.is_categorical ? 'Categorical' : 'Numerical'})
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {:else}
        <p class="text-center text-gray-500 py-10 border-2 border-dashed rounded-xl">
            Select a model from the list to see its details.
        </p>
    {/if}
</div>