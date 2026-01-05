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
    import {get} from "svelte/store";
    import type {FeatureFunction, FunctionParameter} from "../../../types/ambient";

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

<Table class="table-fixed border">
    <TableHead>
        <TableHeadCell>Feature</TableHeadCell>
        <TableHeadCell>Functions</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each featuresName as feature}
            <TableBodyRow>
                <TableBodyCell>
                    {feature}
                </TableBodyCell>
                <TableBodyCell>
                    <MultiSelect
                            items={shownFunctions}
                            bind:value={featureFunction[feature]}
                            placeholder="Select Functions"
                            on:change={() => updateFunctions(feature, featureFunction[feature])}
                    />
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>