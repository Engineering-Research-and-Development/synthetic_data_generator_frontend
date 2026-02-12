<script lang="ts">
    import {
        Label,
        Select,
        Table,
        TableHead,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHeadCell,
        Input,
        Helper
    } from 'flowbite-svelte';
    import { BlueprintController } from '../controllers/blueprint-selector.svelte.js';
    import type { SelectedModel } from "../../../types/ambient";
    import type { NewAlgorithm } from "../../../types/algorithms";

    let {
        availableAlgorithms,
        selectedModel = $bindable(),
        newModelName = $bindable()
    }: {
        availableAlgorithms: NewAlgorithm[],
        selectedModel: SelectedModel | null,
        newModelName: string
    } = $props();

    const ctrl = new BlueprintController(() => availableAlgorithms);

    $effect(() => {
        selectedModel = ctrl.selectedModelData;
    });

    $effect(() => {
        newModelName = ctrl.newModelName;
    });

</script>

<div class="flex flex-col gap-6 w-full">
    <div class="w-full">
        <Label class="space-y-2">
            <span>Select a blueprint</span>
            <Select items={ctrl.options} bind:value={ctrl.algorithmName} />
        </Label>
    </div>

    <div class="w-full">
        {#if ctrl.chosenAlgo}
            <div class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <Label for="model_name" class="mb-2">Model Assignment</Label>
                    <Input
                            type="text"
                            id="model_name"
                            placeholder="e.g. My_Optimized_Model_v1"
                            required
                            bind:value={ctrl.newModelName}
                    />
                    <Helper class="mt-2 text-sm">
                        This name will identify your model in the <b>Pre-trained model</b> section once training is complete.
                    </Helper>
                </div>

                <Table hoverable={true} shadow={true}>
                    <TableHead>
                        <TableHeadCell class="font-bold">Property</TableHeadCell>
                        <TableHeadCell class="font-bold">Value</TableHeadCell>
                    </TableHead>
                    <TableBody tableBodyClass="divide-y">
                        <TableBodyRow>
                            <TableBodyCell class="font-semibold">Name</TableBodyCell>
                            <TableBodyCell>{ctrl.chosenAlgo.name}</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell class="font-semibold">Description</TableBodyCell>
                            <TableBodyCell>{ctrl.chosenAlgo.description}</TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell class="font-semibold">Loss Function</TableBodyCell>
                            <TableBodyCell>
                                <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {ctrl.chosenAlgo.default_loss_function}
                                </code>
                            </TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell class="font-semibold">Allowed Data</TableBodyCell>
                            <TableBodyCell>
                                <div class="flex flex-col gap-1">
                                    {#each ctrl.chosenAlgo.datatypes as data}
                                        <div class="text-sm">
                                            <span class="capitalize">
                                                {data.type}
                                            </span>
                                            <span class="text-gray-400 text-xs italic">
                                                ({data.is_categorical ? 'categorical' : 'non-categorical'})
                                            </span>
                                        </div>
                                    {/each}
                                </div>
                            </TableBodyCell>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            </div>
        {:else}
            <div class="flex items-center justify-center p-10 border-2 border-dashed rounded-xl text-gray-400">
                Please select a blueprint from the dropdown to see the technical details.
            </div>
        {/if}
    </div>
</div>