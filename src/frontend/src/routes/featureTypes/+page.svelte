<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Section } from "flowbite-svelte-blocks";
    import {
        Table,
        Select,
        Checkbox,
        Button,
        TableHead,
        TableHeadCell,
        TableBody,
        TableBodyRow,
        TableBodyCell, Fileupload
    } from "flowbite-svelte";
    import PageHeading from "../components/layout/PageHeading.svelte";
    import Footer from "../components/layout/Footer.svelte";
    import { Modal } from "flowbite-svelte";
    import {getEndpointUrl} from "$lib/config/utils";
    import Error from "../components/Error.svelte";
    import type {FeatureConfig} from "../../types/middlewarePost";

    let showLoadModal = false;
    let selectedFile: File | null = null;
    let automaticInfer: boolean = true;

    /* --------- Domain types --------- */
    type FeatureType = "continuous" | "categorical" | "group_index";

    interface FeatureRow {
        name: string;
        type: FeatureType;
        primaryKey: boolean;
    }

    /* --------- State --------- */
    let featureType: FeatureRow[] = [];
    let errorMessage: string | null = null;

    const featureTypes = [
        { value: "continuous", name: "Continuous" },
        { value: "categorical", name: "Categorical" },
        { value: "group_index", name: "Group index" }
    ];

    /* --------- Init --------- */
    onMount(() => {
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
    function setPrimaryKey(index: number): void {
        featureType = featureType.map((f, i) => ({
            ...f,
            primaryKey: i === index ? !f.primaryKey : false
        }));
    }

    function submit(): void {
        if (!automaticInfer) {
            const payload: FeatureConfig = Object.fromEntries(
                featureType.map((f) => [
                    f.name,
                    { type: f.type, primaryKey: f.primaryKey }
                ])
            );
            sessionStorage.setItem("featureTypes", JSON.stringify(payload));
        }
        goto(getEndpointUrl("feature"));
    }

    /* --------- Serialization (ISP) --------- */
    function saveAsJson(): void {
        const payload: FeatureConfig = Object.fromEntries(
            featureType.map((f) => [
                f.name,
                { type: f.type, primaryKey: f.primaryKey }
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
                            <TableHeadCell>Primary Key</TableHeadCell>
                        </TableHead>

                        <TableBody>
                            {#each featureType as feature, index}
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

                                    <TableBodyCell class="text-center">
                                        <Checkbox
                                                checked={feature.primaryKey}
                                                on:change={() => setPrimaryKey(index)}
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
                    <Button
                            class={`transition ${
                                automaticInfer
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-gray-600 hover:bg-gray-700 opacity-50'
                              }`}
                            onclick={() => (automaticInfer = true)}
                    >
                        Automatic Infer
                    </Button>
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
