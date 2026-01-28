<script lang="ts">
    import { onMount } from "svelte";
    import {
        Table,
        TableBody,
        TableBodyRow,
        TableBodyCell,
        TableHead,
        TableHeadCell,
        MultiSelect, Select,
    } from "flowbite-svelte";
    import { BACKEND_URL } from "../../../stores/shared";
    import Error from "../../components/Error.svelte";
    import { get } from "svelte/store";
    import type {FeatureFunction, FunctionParameter} from "../../../types/ambient";
    import { MiddlewareUrls } from "$lib/config/middlewareUrls";
    import {navState} from "$lib/config/navigation.svelte";

    let {featureFunction=$bindable()} :{featureFunction: FeatureFunction[]} = $props();
    let shownFunctions: { value: string; name: string; }[] = $state([]);
    let shownGenFunctions: { value: string; name: string; }[] = $state([]);
    let features = $derived([...new Set(featureFunction.map(f => f.featureName))]);
    let errorMessage = $state<string | null>(null);

    const FILLER_COUNT = 3

    type UISelection = {
        featureName: string;
        functions: number[];
        generative?: number;
    };

    let uiSelections: UISelection[] = $state(
        features.map(f => ({
            featureName: f,
            functions: [],
            generative: undefined
        }))
    );

    onMount(async () => {
        try {
            const response = await fetch(get(BACKEND_URL) + MiddlewareUrls.functions);
            if (response.ok) {
                const data = await response.json();

                const fetchedFunctions: FunctionParameter[] = data.map((fp: FunctionParameter) => ({
                    function: fp.function,
                    parameter: fp.parameters
                }));

                const toSelect = (fp: FunctionParameter) => ({
                    value: fp.function.id.toString(),
                    name: fp.function.name,
                });

                const generativeEntries = fetchedFunctions.filter(fp => fp.function.is_generative);
                shownGenFunctions = generativeEntries.map(toSelect);

                const genIds = new Set(generativeEntries.map(fp => fp.function.id.toString()));
                shownFunctions = fetchedFunctions
                    .filter(fp => !genIds.has(fp.function.id.toString()))
                    .map(toSelect);
            }

        } catch (error) {
            errorMessage = "Error fetching Functions: " + error;
        }
    });

    function syncFeature(selection: UISelection) {
        const mergedIds = [
            ...selection.functions,
            ...(selection.generative !== undefined
                ? [selection.generative]
                : [])
        ];

        updateFunctions(selection.featureName, mergedIds);
    }

    function updateFunctions(feature: string, functionsId: number[]) {
        const existing = featureFunction.find(f => f.featureName === feature);

        if (existing) {
            existing.functionId = functionsId;
        } else {
            featureFunction = [
                ...featureFunction,
                {   featureName: feature,
                    functionId: functionsId
                    }
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
        {#if navState.mode === "create"}
            <TableHeadCell class="w-1/3">Generative Functions</TableHeadCell>
        {/if}
    </TableHead>
    <TableBody>
        {#each uiSelections as selection}
            <TableBodyRow>
                <TableBodyCell class="font-medium">
                    {selection.featureName}
                </TableBodyCell>

                <TableBodyCell>
                    <MultiSelect
                            items={shownFunctions}
                            bind:value={selection.functions}
                            placeholder="Select Functions"
                            on:change={() => syncFeature(selection)}
                    />
                </TableBodyCell>

                {#if navState.mode === "create"}
                    <TableBodyCell>
                        <Select
                                required
                                items={shownGenFunctions}
                                bind:value={selection.generative}
                                on:change={() => syncFeature(selection)}
                        />
                    </TableBodyCell>
                {/if}
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
