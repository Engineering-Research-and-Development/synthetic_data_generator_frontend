<script lang="ts">
    import { onMount } from 'svelte';
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Label,
        Input
    } from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import { BACKEND_URL } from '../../stores/shared';
    import PageHeading from '../components/PageHeading.svelte';
    import Error from '../components/Error.svelte';
    import Footer from '../components/layout/Footer.svelte';

    import type {FeatureFunction, SavedFunction, SavedFunctionData} from '../../types/ambient';
    import type { FunctionParameter } from '../../types/ambient';
    import {Middleware} from "$lib/config/middleware";
    import {getEndpointUrl} from "$lib/config/utils";


    type FunctionDataByFeature = Record<string, FunctionParameter[]>;

    let functionData: FunctionDataByFeature = {};
    let errorMessage: string | null = null;

    onMount(loadFunctionData);

    /* ──────────────────────────────
       Lifecycle / Data loading
    ────────────────────────────── */

    async function loadFunctionData(): Promise<void> {
        try {
            const selectedFunctions = readSelectedFunctions();
            const functionIds = collectUniqueIds(selectedFunctions);
            const functions = await fetchFunctions(functionIds);

            functionData = groupByFeature(selectedFunctions, functionIds, functions);
        } catch (error) {
            errorMessage = String(error);
        }
    }

    function readSelectedFunctions(): FeatureFunction {
        return JSON.parse(
            sessionStorage.getItem('featureFunction') ?? '{}'
        );
    }

    function collectUniqueIds(features: FeatureFunction): string[] {
        return [...new Set(Object.values(features).flat())];
    }

    async function fetchFunctions(ids: string[]): Promise<FunctionParameter[]> {
        const backendUrl = get(BACKEND_URL);

        const results = await Promise.allSettled(
            ids.map(id =>
                fetch(`${backendUrl}${Middleware.functions}${id}`).then(res => {
                    if (!res.ok) {
                        errorMessage=`HTTP error! Status: ${res.status}`;
                    }
                    return res.json();
                })
            )
        );

        return results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value as FunctionParameter);
    }

    function groupByFeature(
        features: FeatureFunction,
        ids: string[],
        functions: FunctionParameter[]
    ): FunctionDataByFeature {
        const result: FunctionDataByFeature = {};

        functions.forEach((fn, index) => {
            const id = ids[index];

            for (const [feature, featureIds] of Object.entries(features)) {
                if (featureIds.includes(id)) {
                    result[feature] ??= [];
                    result[feature].push(fn);
                }
            }
        });

        return result;
    }

    /* ──────────────────────────────
       Save (output DTO)
    ────────────────────────────── */

    function save(): void {
        const output = buildSavePayload(functionData);

        sessionStorage.setItem('functionData', JSON.stringify(output));
        goto(getEndpointUrl("modelPage"));
    }

    function buildSavePayload(
        data: FunctionDataByFeature
    ): SavedFunctionData {
        const result: SavedFunctionData = {};

        for (const [feature, functions] of Object.entries(data)) {
            result[feature] = functions.map(toSavedFunction);
        }

        return result;
    }

    function toSavedFunction(fp: FunctionParameter): SavedFunction {
        return {
            functionId: fp.function.id,
            functionName: fp.function.name,
            parameters: fp.parameters.map(p => ({
                id: p.id,
                value: p.value
            }))
        };
    }
</script>

<Section>
    {#if errorMessage}
        <Error message={errorMessage} />
    {/if}

    <PageHeading text="Function composition" />

    <form
            on:submit|preventDefault={save}
            class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 w-full max-w-6xl"
    >
        <div class="max-h-[600px] overflow-y-auto pr-2">
            {#if Object.keys(functionData).length > 0}
                {#each Object.entries(functionData) as [feature, functions]}
                    <h2 class="text-xl font-semibold mt-6 mb-4">
                        Feature: {feature}
                    </h2>

                    <Table>
                        <TableHead class="bg-gray-200">
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Description</TableHeadCell>
                            <TableHeadCell>Parameters</TableHeadCell>
                        </TableHead>

                        <TableBody>
                            {#each functions as fn}
                                <TableBodyRow>
                                    <TableBodyCell>
                                        {fn.function.name}
                                    </TableBodyCell>

                                    <TableBodyCell>
                                        {fn.function.description}
                                    </TableBodyCell>

                                    <TableBodyCell>
                                        {#each fn.parameters as param}
                                            <Label class="block text-sm font-medium">
                                                {param.name} ({param.parameter_type})
                                            </Label>

                                            <Input
                                                    type="number"
                                                    step="0.01"
                                                    bind:value={param.value}
                                                    class="mt-1 mb-2 w-full"
                                            />
                                        {/each}
                                    </TableBodyCell>
                                </TableBodyRow>
                            {/each}
                        </TableBody>
                    </Table>
                {/each}
            {:else}
                <p class="text-gray-600">
                    No functions selected or data available.
                </p>
            {/if}
        </div>
        <Footer />
    </form>
</Section>
