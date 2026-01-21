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

    let featuresName: string[] = [];
    let featureFunction: FeatureFunction = {};
    let additionalRows: number = 0;
    let errorMessage: string;

    onMount(() => {
        const features = sessionStorage.getItem("selectedColumns");
        if (features) {
            featuresName = JSON.parse(features);
            featuresName.forEach((feature) => {
                if (!featureFunction[feature]) {
                    featureFunction[feature] = [];
                }
            });
        }
    });

    function submitFunctions(): void {
        if (additionalRows <= 0) {
            errorMessage="Additional rows cannot be zero or lower";
            return;
        }
        sessionStorage.setItem('featureFunction', JSON.stringify(featureFunction));
        sessionStorage.setItem('additionalRows', additionalRows.toString());
        goto(getEndpointUrl("parametersPage"));
    }
</script>

<Section>
    <PageHeading text="Function Selection"/>
    {#if errorMessage}
        <Error bind:errorMessage/>
    {/if}

    <form
            on:submit|preventDefault={submitFunctions}
            class="p-6 bg-white rounded-lg shadow-md"
    >
        {#if featuresName.length>0}
            <FunctionsTable
                    featuresName={featuresName}
                    featureFunction={featureFunction}
            />
        {/if}

        <NewRows bind:additionalRows={additionalRows} />
        <Footer/>
    </form>
</Section>