<script lang="ts">
    import { onMount } from "svelte";
    import {Section} from "flowbite-svelte-blocks";
    import { goto } from "$app/navigation";
    import Error from "../components/Error.svelte";
    import Footer from "../components/layout/Footer.svelte";
    import PageHeading from "../components/layout/PageHeading.svelte";
    import type {FeatureFunction} from "../../types/ambient";
    import FunctionsTable from "./components/FunctionsTable.svelte";
    import NewRows from "./components/NewRows.svelte";
    import {getEndpointUrl} from "$lib/config/utils";
    import {navState} from "$lib/config/navigation.svelte";

    let featureFunction = $state<FeatureFunction[]>([]);
    let features = $state<string[]>([]);
    let additionalRows: number = $state(0);
    let errorMessage = $state<string | null>(null);

    onMount(() => {
        const storedFeatures = sessionStorage.getItem("selectedColumns");
        if (storedFeatures) {
            const featuresName: string[] = JSON.parse(storedFeatures);
            features = featuresName;

            featureFunction = featuresName.map(name => ({
                featureName: name,
                functionId: []
            }));
        }
    });

    function submitFunctions(event: SubmitEvent): void {
        event.preventDefault();
        if (additionalRows <= 0) {
            errorMessage="Additional rows cannot be zero or lower";
            return;
        }
        sessionStorage.setItem('featureFunction', JSON.stringify(featureFunction));
        sessionStorage.setItem('additionalRows', additionalRows.toString());
        goto(navState.getNextLink(getEndpointUrl("functionPage"))!);
    }
</script>

<Section>
    <PageHeading text="Function Selection"/>
    {#if errorMessage}
        <Error bind:errorMessage/>
    {/if}

    <form
            onsubmit={submitFunctions}
            class="p-6 bg-white rounded-lg shadow-md"
    >
        {#if features.length>0}
            <FunctionsTable
                    bind:featureFunction={featureFunction}
            />
        {/if}

        <NewRows bind:additionalRows={additionalRows} />
        <Footer/>
    </form>
</Section>