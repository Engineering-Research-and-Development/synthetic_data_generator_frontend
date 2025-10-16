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
    import { BACKEND_URL } from "../../stores/shared";
    import Error from "./Error.svelte";
    import {get} from "svelte/store";

    export let featuresName: string[] = [];
    export let featureFunction: FeatureFunction = {};

    let shownFunctions: { value: string; name: string;}[] = [];
    let errorMessage: string;

    onMount(async () => {
        try {
            const response = await fetch(get(BACKEND_URL) +'/functions/');
            if (response.ok) {
                const data = await response.json();

                const fetchedFunctions: FunctionParameter[] = data.map((functionParameter: FunctionParameter) => ({
                    function: functionParameter.function,
                    parameter: functionParameter.parameters
                }));

                shownFunctions = fetchedFunctions.map((Function) => ({
                    value: Function.function.id.toString(),
                    name: Function.function.name,
                }));
            }
        } catch (error) {
            errorMessage="Error fetching Functions"+ error;
        }
    });

    export function updateFunctions(feature: string, functions: string[]) {
        featureFunction[feature] = functions;
    }
</script>

{#if errorMessage}
    <Error message={errorMessage}/>
{/if}

<Table class="w-full text-gray-500 self-center mb-[150px]">
    <TableHead class="text-xs text-gray-700 uppercase bg-gray-50">
        <TableHeadCell>Feature</TableHeadCell>
        <TableHeadCell>Functions</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each featuresName as feature}
            <TableBodyRow class="bg-white border-b">
                <TableBodyCell class="font-medium text-gray-900 ">
                    {feature}
                </TableBodyCell>
                <TableBodyCell>
                    <MultiSelect
                            items={shownFunctions}
                            bind:value={featureFunction[feature]}
                            placeholder="Select Functions"
                            class="text-gray-700 self-start"
                            on:change={() => updateFunctions(feature, featureFunction[feature])}
                    />
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>