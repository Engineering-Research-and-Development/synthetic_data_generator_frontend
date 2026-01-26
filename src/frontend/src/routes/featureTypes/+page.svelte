<script lang="ts">
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {Section} from "flowbite-svelte-blocks";
    import {
        Button,
        Fileupload,
        Modal,
        Select,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toggle
    } from "flowbite-svelte";
    import PageHeading from "../components/layout/PageHeading.svelte";
    import Footer from "../components/layout/Footer.svelte";
    import {getEndpointUrl} from "$lib/config/utils";
    import Error from "../components/Error.svelte";
    import type {FeatureConfig} from "../../types/middlewarePost";
    import {type FeatureType, featureTypes} from "../../types/features";
    import { navState } from "$lib/config/navigation.svelte.js"
    let showLoadModal = false;
    let selectedFile: File | null = null;
    let automaticInfer: boolean = true;

    /* --------- Domain types --------- */
    interface FeatureRow {
        name: string;
        type: FeatureType;
    }

    /* --------- State --------- */
    let featureType: FeatureRow[] = [];
    let errorMessage: string | null = null;

    /* --------- Init --------- */
    onMount(() => {
        navState.mode="enhanced";
        const savedData = sessionStorage.getItem("userFile");
        if (!savedData) {
            errorMessage = "No file loaded";
            return;
        }

        const parsed = JSON.parse(savedData);
        if (!parsed.length) {
            errorMessage = "Empty dataset";
            return;
        }

        const headers = Object.keys(parsed[0]);
        featureType = headers.map((h) => ({
            name: h,
            type: "continuous", // DEFAULT
            primaryKey: false
        }));
    });

    /* --------- Behaviour --------- */
    function submit(): void {
        if (!automaticInfer) {
            const payload: FeatureConfig = Object.fromEntries(
                featureType.map((f) => [
                    f.name,
                    { type: f.type}
                ])
            );
            sessionStorage.setItem("featureTypes", JSON.stringify(payload));
        }
        goto(navState.getNextLink(getEndpointUrl("featureTypes"))!);
    }

    /* --------- Serialization (ISP) --------- */
    function saveAsJson(): void {
        const payload: FeatureConfig = Object.fromEntries(
            featureType.map((f) => [
                f.name,
                { type: f.type}
            ])
        );

        const blob = new Blob(
            [JSON.stringify(payload, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "features.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    function loadFromJson(): void {
        if (!selectedFile) return;

        const reader = new FileReader();

        reader.onload = () => {
            const parsed = JSON.parse(reader.result as string) as Record<
                string,
                { type?: FeatureType; primaryKey?: boolean }
            >;

            let primaryKeyAlreadySet = false;

            featureType = featureType.map((feature) => {
                const saved = parsed[feature.name];
                if (!saved) return feature;

                const isPrimary =
                    saved.primaryKey === true && !primaryKeyAlreadySet;

                if (isPrimary) {
                    primaryKeyAlreadySet = true;
                }

                return {
                    ...feature,
                    type: saved.type ?? feature.type,
                    primaryKey: isPrimary
                };
            });

            showLoadModal = false;
            selectedFile = null;
        };

        reader.readAsText(selectedFile);
    }
    function onFileSelected(event: Event): void {
        selectedFile = (event.target as HTMLInputElement).files?.[0] ?? null;
    }
</script>

<Section>
    <PageHeading text="Feature types"/>

    {#if errorMessage}
        <Error bind:errorMessage/>
    {:else}

        <form on:submit|preventDefault={submit}>
            <div class="flex gap-6">
                <div class="flex-1">
                    <Table class={`border rounded-lg cursor-pointer transition ${automaticInfer
                        ? 'bg-gray-300 opacity-50'
                        : 'bg-white'
                    }`}
                           role="button"
                           onclick={() => (automaticInfer = false)}
                    >

                        <TableHead>
                            <TableHeadCell>Feature Name</TableHeadCell>
                            <TableHeadCell>Feature Type</TableHeadCell>
                        </TableHead>

                        <TableBody>
                            {#each featureType as feature}
                                <TableBodyRow>
                                    <TableBodyCell class="font-mono">
                                        {feature.name}
                                    </TableBodyCell>

                                    <TableBodyCell>
                                        <Select
                                                items={featureTypes}
                                                bind:value={feature.type}
                                        />
                                    </TableBodyCell>

                                </TableBodyRow>
                            {/each}
                        </TableBody>
                    </Table>
                </div>

                <div class="flex flex-col gap-3 justify-start">
                    <Button type="button" color="light" onclick={saveAsJson}>
                        Save Configuration
                    </Button>

                    <label class="cursor-pointer">
                        <input
                                type="file"
                                accept="application/json"
                                class="hidden"
                                on:change={loadFromJson}
                        />
                        <Button type="button" color="light" onclick={() => (showLoadModal = true)}>
                            Load Configuration
                        </Button>
                    </label>
                    <Toggle
                            class={`transition rounded-[2.5rem] ${
                                automaticInfer
                                  ? 'bg-white'
                                  : 'bg-gray-500 opacity-50'
                              }`}
                            color="green"
                            bind:checked={automaticInfer}
                    >
                        Automatic Infer
                    </Toggle>
                </div>
            </div>

            <Footer />
        </form>

    {/if}
    <Modal bind:open={showLoadModal} size="md" autoclose>
            Upload feature configuration
            <Fileupload
                    accept=".json"
                    on:change={onFileSelected}
                    class="w-full"
            />
            <Button color="light" on:click={() => (showLoadModal = false)}>
                Cancel
            </Button>
            <Button on:click={loadFromJson} disabled={!selectedFile}>
                Load
            </Button>

    </Modal>
</Section>
