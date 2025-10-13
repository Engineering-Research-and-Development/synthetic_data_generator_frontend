<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from "$app/navigation";
	import NextButton from "../components/NextButton.svelte";
	import CancelButton from "../components/CancelButton.svelte";
	import FeaturesTable from "../components/FeaturesTable.svelte";
	import Error from "../components/Error.svelte";

	type RowData = { [key: string]: any };

	let tableData: RowData[] = [];
	let headers: string[] = [];
	let selectedColumns: string[] = [];
	let errorMessage:string;

	onMount(() => {
		const savedData = sessionStorage.getItem('userFile');
		if (savedData) {
			try {
				const parsedData: RowData[] = JSON.parse(savedData);
				if (parsedData.length > 0) {
					headers = Object.keys(parsedData[0]);
					tableData = parsedData;
				}
			} catch (error) {
				errorMessage="Error parsing saved data:"+ error;
			}
		} else {
			errorMessage="No data found in sessionStorage.";
		}
	});

	// Submit the selected columns and navigate to the next page
	function submitColumns(): void {
		sessionStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
		goto("/function");
	}
</script>

{#if errorMessage}
	<Error message={errorMessage}/>
{/if}

<h1 class="text-3xl font-bold text-white justify-center flex">Feature Selection</h1>
<div class="items-center justify-center max-w-full max-h-60">
	<form on:submit|preventDefault={submitColumns}>
		<FeaturesTable
				headers={headers}
				tableData={tableData}
				bind:selectedColumns
		/>
		<div class="flex justify-end gap-4">
			<CancelButton />
			<NextButton />
		</div>
	</form>
</div>