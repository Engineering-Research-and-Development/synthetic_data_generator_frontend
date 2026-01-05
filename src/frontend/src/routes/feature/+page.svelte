<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from "$app/navigation";
	import FeaturesTable from "./components/FeaturesTable.svelte";
	import Error from "../components/Error.svelte";
	import Footer from "../components/Footer.svelte";
	import {Endpoints} from "$lib/config/uiEndpoints";
	import {Section} from "flowbite-svelte-blocks";
	import PageHeading from "../components/PageHeading.svelte";
	import {Button} from "flowbite-svelte";

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

	function toggleAllColumn(): void {
		if (selectedColumns.length === headers.length) {
			selectedColumns = [];
		} else {
			selectedColumns = headers;
		}
	}

	function submitData(): void {
		sessionStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
		goto(Endpoints.functionPage);
	}
</script>

<Section>
	{#if errorMessage}
		<Error message={errorMessage}/>
	{/if}
	<PageHeading text="Feature Selection"/>

	<div>
		<form on:submit|preventDefault={submitData}>
			<Button class="" on:click={() => toggleAllColumn()}>Select All Features</Button>
			<FeaturesTable
					tableHeader={headers}
					tableData={tableData}
					bind:selectedColumns
			/>
			<Footer/>
		</form>
	</div>
</Section>
