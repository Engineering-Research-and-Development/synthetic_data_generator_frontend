<script lang="ts">
	import { Section} from "flowbite-svelte-blocks";
	import { Button, Select } from "flowbite-svelte";
	import { CircleMinusSolid, CirclePlusSolid } from "flowbite-svelte-icons";
	import { goto } from "$app/navigation";
	import Footer from "../components/Footer.svelte";
	import PageHeading from "../components/PageHeading.svelte";
	import type {FeaturesCreated} from "../../types/ambient";

	let features: FeaturesCreated[] = [];
	let types = [
		{ value: 'string', name: 'String' },
		{ value: 'integer', name: 'Integer' },
		{ value: 'double', name: 'Double' },
	];
	let subTypes = [
		{ value: 'continuous', name: "Continuous" },
		{ value: 'categorical', name: "Categorical" },
		{ value: 'group_index', name: "GroupIndex" },
		{ value: 'primary_key', name: "Primary Key" }
	];

	// Function to add a new feature row
	function addFeature() {
		features = [...features, { id: features.length + 1, feature: '', type: '', category: '' }];
	}

	// Function to remove a feature row by its index
	function removeFeature(index: number) {
		features = features.filter((_, i) => i !== index);
	}

	// Function to handle the form submission
	function submit(event: Event) {
		event.preventDefault(); // Prevent the default form submission behavior
		const featureNames = features.map(feature => feature.feature);
		const featuresCreated = features.map(feature => ({
			feature: feature.feature,
			type: feature.type,
			category: feature.category
		}));

		sessionStorage.setItem("selectedColumns", JSON.stringify(featureNames))
		sessionStorage.setItem("featuresCreated", JSON.stringify(featuresCreated))
		goto("/function")
	}
</script>

<Section>
	<PageHeading text="Dataset Creation from scratch"/>
	<form on:submit={submit}>
		<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-8">
			<!-- Centered "Add Feature" Button -->
			<div class="w-full flex justify-center mb-4">
				<Button type="button" on:click={addFeature} class="flex items-center">
					<CirclePlusSolid class="h-5 w-5" />
					Add feature
				</Button>
			</div>

			<!-- Feature Input Rows -->
			<div class="w-full p-4 overflow-y-auto" style="max-height: 50vh;">
				{#each features as feature, index}
					<div class="flex gap-4 mb-4 items-center">
						<!-- Delete button with minus icon -->
						<Button type="button" on:click={() => removeFeature(index)} color="red" class="p-2">
							<CircleMinusSolid class="h-5 w-5" />
						</Button>
						<input
								type="text"
								class="w-1/2 p-2 border rounded"
								placeholder="Feature Name"
								bind:value={feature.feature}
								required
						/>
						<Select
								bind:value={feature.type}
								class="w-1/2 p-2 border rounded"
								required
						>
							{#each types as t}
								<option value={t.value}>{t.name}</option>
							{/each}
						</Select>
						<Select
								bind:value={feature.category}
								class="w-1/2 p-2 border rounded"
								required
						>
							{#each subTypes as t}
								<option value={t.value}>{t.name}</option>
							{/each}
						</Select>
					</div>
				{/each}
			</div>
		</Section>

		<Footer/>
	</form>
</Section>