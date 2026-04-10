<script>
    import {
        Input,
        Label,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toggle
    } from "flowbite-svelte";
    import snarkdown from 'snarkdown';
    let {item} = $props()
</script>

<Table hoverable={true} shadow={true}>
    <TableHead class="bg-gray-50 dark:bg-gray-700">
        <TableHeadCell>Function Detail</TableHeadCell>
        <TableHeadCell>Supported Data Types</TableHeadCell>
        <TableHeadCell>Parameters Configuration</TableHeadCell>
    </TableHead>

    <TableBody tableBodyClass="divide-y">
        {#each item.associated_functions as fn, j (fn.function.id || j)}
            <TableBodyRow class={fn.function.is_generative? "bg-green-100":""}>
                <TableBodyCell class="align-top min-w-[250px] max-w-md">
                    <div class="font-semibold text-gray-900 dark:text-white break-words">
                        {fn.function.name}
                    </div>

                    <div class="text-sm text-gray-500 mt-1 italic whitespace-normal break-words leading-relaxed">
                        {@html snarkdown(fn.function.description)}
                    </div>

                    {#if fn.function.is_generative}
                        <div class="mt-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-green-200 text-green-900">
                    Generative Function
                </span>
                        </div>
                    {/if}
                </TableBodyCell>
                <TableBodyCell class="align-top">
                    <div class="flex flex-wrap gap-2">
                        {#each fn.datatypes as datatype, k (datatype.id || k)}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                <code class="font-mono">{datatype.type}</code>
                            </span>
                        {/each}
                    </div>
                </TableBodyCell>
                <TableBodyCell class="align-top">
                    <div class="grid grid-cols-1 gap-4">
                        {#each fn.parameters as param, k (param.id || k)}
                            <div class="space-y-1">
                                <Label class="text-xs font-bold uppercase text-gray-500 mb-2">
                                    {param.name}
                                    <span class="lowercase font-normal opacity-70">({param.parameter_type})</span>
                                </Label>

                                {#if param.parameter_type === 'bool'}
                                    <Toggle
                                            bind:checked={param.value}
                                            color="purple"
                                    />

                                {:else if param.parameter_type === 'float' || param.parameter_type === 'int'}
                                    <Input
                                            type="number"
                                            step={param.parameter_type === 'float' ? "0.01" : "1"}
                                            bind:value={param.value}
                                            size="sm"
                                            placeholder="0.00"
                                    />

                                {:else}
                                    <Input
                                            type="text"
                                            bind:value={param.value}
                                            size="sm"
                                    />
                                {/if}
                            </div>
                        {/each}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>