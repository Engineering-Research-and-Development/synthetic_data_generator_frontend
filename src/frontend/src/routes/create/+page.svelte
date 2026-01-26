<script lang="ts">
	import { onMount } from 'svelte'; // Fondamentale per SSR
	import { Section } from "flowbite-svelte-blocks";
	import {
		Button, Input, Select, Table, TableBody,
		TableBodyCell, TableBodyRow, TableHead, TableHeadCell
	} from "flowbite-svelte";
	import { TrashBinSolid, CirclePlusSolid } from "flowbite-svelte-icons";
	import { goto } from "$app/navigation";
	import Footer from "../components/layout/Footer.svelte";
	import PageHeading from "../components/layout/PageHeading.svelte";
	import type { FeaturesCreated } from "../../types/ambient";
	import { featureTypes, types } from "../../types/features";
	import { navState } from "$lib/config/navigation.svelte.js"
	import {getEndpointUrl} from "$lib/config/utils";
	let features: FeaturesCreated[] = [];

	onMount(() => {
		navState.mode = "create";
		const stored = sessionStorage.getItem("featuresCreated");
		if (stored) {
			try {
				features = JSON.parse(stored);
			} catch (e) {
				features = [];
			}
		}
	});

	function addFeature() {
		features = [...features, { id: features.length + 1, name: '', type: '', category: '' }];
	}

	function removeFeature(index: number) {
		features = features.filter((_, i) => i !== index);
	}

	function submit(event: Event) {
		event.preventDefault();
		const featureNames = features.map(f => f.name);

		sessionStorage.setItem("selectedColumns", JSON.stringify(featureNames));
		sessionStorage.setItem("featuresCreated", JSON.stringify(features));
		goto(navState.getNextLink(getEndpointUrl("create"))!);
	}
</script>

<Section>
	<PageHeading text="Dataset Creation from scratch"/>

	<form on:submit={submit} class="space-y-4">
		<Section class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">

			<div class="flex justify-center items-center mb-6">
				<Button pill color="purple" on:click={addFeature} class="gap-2">
					<CirclePlusSolid size="md" />
					Add a new feature
				</Button>
			</div>

			<div class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
				<div class="max-h-[50vh] overflow-y-auto">
					<Table hoverable={true} striped={true}>
						<TableHead class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700">
							<TableHeadCell class="w-12"></TableHeadCell> <TableHeadCell>Feature Name</TableHeadCell>
							<TableHeadCell>Type</TableHeadCell>
							<TableHeadCell>Category</TableHeadCell>
						</TableHead>
						<TableBody>
							{#each features as feature, index (index)}
								<TableBodyRow>
									<TableBodyCell>
										<Button
												size="xs"
												color="red"
												outline
												on:click={() => removeFeature(index)}
												aria-label="Delete Row"
										>
											<TrashBinSolid size="sm" />
										</Button>
									</TableBodyCell>

									<TableBodyCell>
										<Input
												placeholder="Lorem ipsum dolor sit amet"
												bind:value={feature.name}
												required
												size="sm"
										/>
									</TableBodyCell>

									<TableBodyCell>
										<Select items={types} bind:value={feature.type} required size="sm" />
									</TableBodyCell>

									<TableBodyCell>
										<Select items={featureTypes} bind:value={feature.category} required size="sm" />
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</div>
		</Section>
		<Footer/>
	</form>
</Section>