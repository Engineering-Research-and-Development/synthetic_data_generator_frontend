<script lang="ts">
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    let {documentData} = $props()
</script>

<Table>
    <TableHead>
        <TableHeadCell>Metric Type</TableHeadCell>
        <TableHeadCell>Metric Title</TableHeadCell>
        <TableHeadCell>Metric Value</TableHeadCell>
        <TableHeadCell>Unit</TableHeadCell>
    </TableHead>
    <TableBody>
        <!-- Statistical Metrics -->
        {#if documentData.metrics?.statistical_metrics?.length}
            {#each documentData.metrics.statistical_metrics as metric, i}
                <TableBodyRow class="bg-orange-50">
                    {#if i === 0}
                        <TableBodyCell rowspan={documentData.metrics.statistical_metrics.length}>
                            Statistical Metrics
                        </TableBodyCell>
                    {/if}
                    <TableBodyCell>{metric.title}</TableBodyCell>
                    <TableBodyCell>
                        {#if typeof metric.value === 'object'}
                            <ul class="list-disc list-inside">
                                {#each Object.entries(metric.value) as [k, v]}
                                    <li><strong>{k}</strong>: {v}</li>
                                {/each}
                            </ul>
                        {:else}
                            {metric.value}
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell>{metric.unit_measure}</TableBodyCell>
                </TableBodyRow>
            {/each}
        {/if}

        <!-- Adherence Metrics -->
        {#if documentData.metrics?.adherence_metrics?.length}
            {#each documentData.metrics.adherence_metrics as metric, i}
                <TableBodyRow class="bg-blue-50">
                    {#if i === 0}
                        <TableBodyCell rowspan={documentData.metrics.adherence_metrics.length}>
                            Adherence Metrics
                        </TableBodyCell>
                    {/if}
                    <TableBodyCell>{metric.title}</TableBodyCell>
                    <TableBodyCell>
                        {#if typeof metric.value === 'object'}
                            <ul class="list-disc list-inside">
                                {#each Object.entries(metric.value) as [k, v]}
                                    <li><strong>{k}</strong>: {v}</li>
                                {/each}
                            </ul>
                        {:else}
                            {metric.value}
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell>{metric.unit_measure}</TableBodyCell>
                </TableBodyRow>
            {/each}
        {/if}

        <!-- Novelty Metrics -->
        {#if documentData.metrics?.novelty_metrics?.length}
            {#each documentData.metrics.novelty_metrics as metric, i}
                <TableBodyRow class="bg-green-50">
                    {#if i === 0}
                        <TableBodyCell rowspan={documentData.metrics.novelty_metrics.length}>
                            Novelty Metrics
                        </TableBodyCell>
                    {/if}
                    <TableBodyCell>{metric.title}</TableBodyCell>
                    <TableBodyCell>
                        {#if typeof metric.value === 'object'}
                            <ul class="list-disc list-inside">
                                {#each Object.entries(metric.value) as [k, v]}
                                    <li><strong>{k}</strong>: {v}</li>
                                {/each}
                            </ul>
                        {:else}
                            {metric.value}
                        {/if}
                    </TableBodyCell>
                    <TableBodyCell>{metric.unit_measure}</TableBodyCell>
                </TableBodyRow>
            {/each}
        {/if}
    </TableBody>
</Table>