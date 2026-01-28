<script lang="ts">
    import { onMount } from 'svelte';
    import {Badge} from 'flowbite-svelte';
    import { Section } from 'flowbite-svelte-blocks';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
    import { BACKEND_URL } from '../../stores/shared';
    import PageHeading from '../components/layout/PageHeading.svelte';
    import Error from '../components/Error.svelte';
    import Footer from '../components/layout/Footer.svelte';

    import type {
        FeatureFunction,
        FunctionParameter
    } from '../../types/ambient';
    import { getEndpointUrl } from "$lib/config/utils";
    import type {FeatureFunctionParameters} from "../../types/middlewarePost";
    import {navState} from "$lib/config/navigation.svelte";
    import {MiddlewareUrls} from "$lib/config/middlewareUrls";
    import {convertParamsToString} from "./controllers/parameters";
    import ParametersTable from "./components/ParametersTable.svelte";

    let { functionData = $bindable([]) } = $props<{ functionData: FeatureFunctionParameters[] }>();
    let errorMessage = $state<string | null>(null);


    onMount(loadFunctionData);

    async function loadFunctionData(): Promise<void> {
        try {
            const selectedFunctions = readSelectedFunctions();
            const functionIds = collectUniqueFunctionIds(selectedFunctions);
            const remoteFunctionStructure = await fetchFunctions(functionIds);
            functionData = mergeFeaturesFunctions(selectedFunctions, remoteFunctionStructure);
        } catch (error) {
            errorMessage = String(error);
        }
    }

    function readSelectedFunctions(): FeatureFunction[] {
        const stored = sessionStorage.getItem('featureFunction');
        if (!stored) return [];
        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : Object.values(parsed);
    }

    function collectUniqueFunctionIds(selectedFunctions: FeatureFunction[]): number[] {
        return [...new Set(selectedFunctions.flatMap(f => f.functionId || []))];
    }

    async function fetchFunctions(ids: number[]): Promise<FunctionParameter[]> {
        const backendUrl = get(BACKEND_URL);
        const results = await Promise.allSettled(
            ids.map(async (id) => {
                const res = await fetch(`${backendUrl}${MiddlewareUrls.functions}${id}`);
                if (!res.ok) {
                    errorMessage= res.statusText;
                }
                const data: FunctionParameter = await res.json();
                return { ...data, function: { ...data.function, id } };
            })
        );
        return results
            .filter((r): r is PromiseFulfilledResult<FunctionParameter> => r.status === 'fulfilled')
            .map(r => r.value);
    }

    function mergeFeaturesFunctions(
        selectedFunctions: FeatureFunction[],
        remoteFunctionStructure: FunctionParameter[]
    ): FeatureFunctionParameters[] {
        const functionMap = new Map(remoteFunctionStructure.map(fp => [fp.function.id, fp]));

        return selectedFunctions.map(featureItem => ({
            feature_name: featureItem.featureName,
            associated_functions: featureItem.functionId
                .map(id => functionMap.get(id))
                .filter((fp): fp is FunctionParameter => fp !== undefined)
        }));
    }

    function save(event: SubmitEvent): void {
        event.preventDefault();
        functionData = convertParamsToString(functionData)
        sessionStorage.setItem('functionData', JSON.stringify(functionData));
        goto(navState.getNextLink(getEndpointUrl("parametersPage"))!);
    }
</script>

<Section>
    <PageHeading text="Function composition" />
    {#if errorMessage}
        <Error bind:errorMessage />
    {/if}

    <form onsubmit={save} class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 w-full max-w-6xl">
        <div class="max-h-[600px] overflow-y-auto pr-2">
            {#if functionData && functionData.length > 0}
                {#each functionData as item, i (item.feature_name || i)}
                    <div class="flex items-center gap-2 mt-8 mb-4">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                            Feature: {item.feature_name}
                        </h2>
                        <Badge color="indigo">Functions: {item.associated_functions.length}</Badge>
                    </div>
                    <ParametersTable item={item}/>
                {/each}
            {:else}
                <div class="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl">
                    <p class="text-gray-400">No functions selected</p>
                </div>
            {/if}
        </div>
        <Footer />
    </form>
</Section>