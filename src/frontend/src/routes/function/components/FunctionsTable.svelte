<script lang="ts">
    import { onMount } from "svelte";
    import {
        Table,
        TableBody,
        TableBodyRow,
        TableBodyCell,
        TableHead,
        TableHeadCell,
        MultiSelect,
    } from "flowbite-svelte";
    import { BACKEND_URL } from "../../../stores/shared";
    import Error from "../../components/Error.svelte";
    import { get } from "svelte/store";
    import type {FeatureFunction, FunctionParameter} from "../../../types/ambient";
    import { MiddlewareUrls } from "$lib/config/middlewareUrls";

    let {featureFunction=$bindable()} :{featureFunction: FeatureFunction[]} = $props();
    let shownFunctions: { value: string; name: string; }[] = $state([]);
    let features = $derived([...new Set(featureFunction.map(f => f.featureName))]);
    let errorMessage = $state<string | null>(null);

    const FILLER_COUNT = 3

    onMount(async () => {
        try {
            const response = await fetch(get(BACKEND_URL) + MiddlewareUrls.functions);
            if (response.ok) {
                const data = await response.json();
                const fetchedFunctions: FunctionParameter[] = data.map((fp: FunctionParameter) => ({
                    function: fp.function,
                    parameter: fp.parameters
                }));

                shownFunctions = fetchedFunctions.map((f) => ({
                    value: f.function.id.toString(),
                    name: f.function.name,
                }));
            }
        } catch (error) {
            errorMessage = "Error fetching Functions: " + error;
        }
    });

    function updateFunctions(feature: string, functionsId: number[]) {
        const existing = featureFunction.find(f => f.featureName === feature);
        if (existing) {
            existing.functionId = functionsId;
        } else {
            featureFunction = [
                ...featureFunction,
                { featureName: feature, functionId: functionsId }
            ];
        }
    }

</script>

{#if errorMessage}
    <Error {errorMessage} />
{/if}

<Table shadow class="table-fixed w-full h-full">
    <TableHead>
        <TableHeadCell class="w-1/3">Feature</TableHeadCell>
        <TableHeadCell class="w-2/3">Functions</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each features as feature, i}
            <TableBodyRow>
                <TableBodyCell class="font-medium text-gray-900 dark:text-white">
                    {feature}
                </TableBodyCell>
                <TableBodyCell>
                    <MultiSelect
                            items={shownFunctions}
                            bind:value={featureFunction[i].functionId}
                            placeholder="Select Functions"
                            on:change={() => updateFunctions(feature, featureFunction[i].functionId)}
                    />
                </TableBodyCell>
            </TableBodyRow>
        {/each}

        {#each Array(FILLER_COUNT) as _}
            <TableBodyRow class="bg-transparent border-none hover:bg-transparent">
                <TableBodyCell class="py-7"></TableBodyCell>
                <TableBodyCell class="py-7"></TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
