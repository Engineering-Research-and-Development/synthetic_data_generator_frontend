<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { Button } from 'flowbite-svelte';
	import {Section} from "flowbite-svelte-blocks";
	// UI Components
	import BackButton from "../components/layout/BackButton.svelte";
	import CancelButton from "../components/layout/CancelButton.svelte";
	import PageHeading from "../components/layout/PageHeading.svelte";
	import ScratchDataset from "./components/ScratchDataset.svelte";
	import UserDataset from "./components/UserDataset.svelte";
	import AdditionalRows from "./components/AdditionalRows.svelte";
	import FeatureFunctionsTable from "./components/FeatureFunctionsTable.svelte";
	import ModelSummary from "./components/ModelSummary.svelte";
	import FeatureType from "./components/FeatureType.svelte";

	// Types & Utils
	import type { FeaturesCreated, SelectedModel } from "../../types/ambient";
	import type { RowData } from "../../types/table";
    import type {FeatureConfig, FeatureFunctionParameters} from "../../types/middlewarePost";
	import { getEndpointUrl } from "$lib/config/utils";
	import { StorageService } from "$lib/services/StorageService";
	import {navState} from "$lib/config/navigation.svelte";


	let state = {
		functionData: {} as FeatureFunctionParameters[],
		userFile: [] as RowData[],
		additionalRows: 0,
		newModel: false,
		selectedModel: null as SelectedModel | null,
		featuresCreated: [] as FeaturesCreated[],
		featureTypes: {} as FeatureConfig,
		newModelName: "",
		headers: [] as string[]
	};

	const MAX_ROWS_DISPLAY = 4;

	onMount(() => {
		state.featuresCreated = StorageService.getJson("featuresCreated", []);
		state.userFile = StorageService.getJson("userFile", []);
		state.additionalRows = Number(sessionStorage.getItem("additionalRows") || 0);
		state.functionData = StorageService.getJson("functionData", []);
		state.newModel = StorageService.getJson("newModel", false);
		state.selectedModel = StorageService.getJson("selectedModel", null);
		state.newModelName = StorageService.getJson("newModelName", "");
		state.featureTypes = StorageService.getJson("featureTypes", {} as FeatureConfig);
		if (state.userFile.length > 0) {
			state.headers = Object.keys(state.userFile[0]);
		}
	});

	function handleNavigation() {
		goto(getEndpointUrl("sendPage"));
	}
</script>

<Section>
	<div class="flex flex-col gap-6">
		<PageHeading text="Review and send the data" />

		{#if (navState.mode === "create")}
			<ScratchDataset featuresCreated={state.featuresCreated} />
		{:else}
			<div class="space-y-6">
				<UserDataset
						maxRowsToShow={MAX_ROWS_DISPLAY}
						headers={state.headers}
						tableData={state.userFile}
				/>
				<FeatureType featureTypes={state.featureTypes} />
				<ModelSummary
						selectedModel={state.selectedModel}
						newModel={state.newModel}
						newModelName={state.newModelName}
				/>
			</div>
		{/if}

		<AdditionalRows additionalRows={state.additionalRows} />
		<FeatureFunctionsTable functionData={state.functionData} />

		<footer class="flex justify-end gap-4 mt-4">
			<BackButton />
			<CancelButton />
			<Button color="blue" on:click={() => handleNavigation()}>
				Send Data
			</Button>
		</footer>
	</div>
</Section>