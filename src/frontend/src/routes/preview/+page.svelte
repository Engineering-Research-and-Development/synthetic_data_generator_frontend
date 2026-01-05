<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import BackButton from "../components/BackButton.svelte";
	import CancelButton from "../components/CancelButton.svelte";
	import {onMount} from "svelte";
	import {goto} from "$app/navigation";
	import {Endpoints} from "$lib/config/uiEndpoints";
	import {Section} from "flowbite-svelte-blocks";
	import PageHeading from "../components/PageHeading.svelte";
	import type {FeaturesCreated, SavedFunctionData, SelectedModel} from "../../types/ambient";
	import type {RowData} from "../../types/table";
	import ScratchDataset from "./components/ScratchDataset.svelte";
	import UserDataset from "./components/UserDataset.svelte";
	import AdditionalRows from "./components/AdditionalRows.svelte";
	import FeatureFunctionsTable from "./components/FeatureFunctionsTable.svelte";
	import ModelSummary from "./components/ModelSummary.svelte";

	let functionData: SavedFunctionData ={};
	let userFile: RowData[] = [];
	let additionalRows: number = 0;
	let newModel: boolean = false;
	let selectedModel: SelectedModel | null = null;
	let featuresCreated: FeaturesCreated[] = [];
	let headers: string[] = [];
	let tableData: RowData[] = [];
	let maxRowsToShow = 4;
	let newModelName: string;

	async function loadUserFile(): Promise<void> {
		try {
			const userFileData = sessionStorage.getItem("userFile");
			userFile = userFileData ? JSON.parse(userFileData) : [];
			headers = Object.keys(userFile[0]); // Extract headers from the first row
			tableData = userFile
		} catch (error) {
			userFile = [];
		}
	}

	onMount(async () => {
		await loadUserFile();
		additionalRows = Number(sessionStorage.getItem("additionalRows")) || 0;
		functionData = JSON.parse(sessionStorage.getItem("functionData") || "{}");
		newModel = JSON.parse(sessionStorage.getItem("newModel") || "false");
		selectedModel = JSON.parse(sessionStorage.getItem("selectedModel") || "");
		featuresCreated = JSON.parse(sessionStorage.getItem("featuresCreated") || "[]");
		newModelName = JSON.parse(sessionStorage.getItem("newModelName") || "");
	});


	function sendData() {
		goto(Endpoints.sendPage)
	}
</script>

<Section>
	<div class="flex flex-col gap-6">
		<PageHeading text="Review and send the data" />

		{#if featuresCreated.length > 0}
			<ScratchDataset featuresCreated={featuresCreated} />
		{:else}
			<UserDataset maxRowsToShow={maxRowsToShow}
						 headers={headers}
						 tableData={tableData}/>
		{/if}

		<AdditionalRows additionalRows={additionalRows} />

		<FeatureFunctionsTable functionData={functionData} />

		<ModelSummary	selectedModel={selectedModel}
						newModel={newModel}
						newModelName={newModelName}/>

		<!-- Actions -->
		<div class="flex justify-end gap-4">
			<BackButton />
			<CancelButton />
			<Button color="blue" on:click={sendData}>Send</Button>
		</div>
	</div>
</Section>