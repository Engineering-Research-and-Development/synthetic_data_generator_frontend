<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from "$app/navigation";
	import FeaturesTable from "./components/FeaturesTable.svelte";
	import Error from "../components/Error.svelte";
	import Footer from "../components/layout/Footer.svelte";
	import {Section} from "flowbite-svelte-blocks";
	import PageHeading from "../components/layout/PageHeading.svelte";
	import {Button} from "flowbite-svelte";
	import type {RowData} from "../../types/table";
	import {getEndpointUrl} from "$lib/config/utils";
	import {navState} from "$lib/config/navigation.svelte";

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
		goto(navState.getNextLink(getEndpointUrl("feature"))!);
	}
</script>

<Section>
	<PageHeading text="Feature Selection"/>
	{#if errorMessage}
		<Error bind:errorMessage/>
	{/if}

	<div>
		<form on:submit|preventDefault={submitData}>
			<Button class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
					on:click={() => toggleAllColumn()}>Select All Features</Button>
			<FeaturesTable
					tableHeader={headers}
					tableData={tableData}
					bind:selectedColumns
			/>
			<Footer/>
		</form>
	</div>
</Section>
