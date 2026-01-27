import type {TrainedModel} from "../../../types/models";
import {ModelService} from "$lib/services/ModelService";


export class ModelSelectorController {
    // Riceviamo una funzione getter per mantenere la reattività delle props
    #getTrainedModels: () => TrainedModel[];

    // Stato interno reattivo
    chosenModelName = $state("");
    selectedVersionName = $state("");
    #algorithmCache = $state<Record<number, string>>({});
    errorMessage = $state<string | null>(null);

    constructor(getModels: () => TrainedModel[]) {
        this.#getTrainedModels = getModels;
    }

    // Accesso ai dati sempre aggiornati
    get trainedModels() {
        return this.#getTrainedModels();
    }

    // Proprietà derivate collegate al getter
    modelOptions = $derived(this.trainedModels.map(m => ({
        value: m.model.name,
        name: m.model.name
    })));

    activeModel = $derived(this.trainedModels.find(m => m.model.name === this.chosenModelName));

    versionOptions = $derived(this.activeModel?.versions.map(v => ({
        value: v.version_name,
        name: v.version_name
    })) ?? []);

    activeVersion = $derived(this.activeModel?.versions.find(v => v.version_name === this.selectedVersionName));

    algorithmName = $derived(this.activeModel ? this.#algorithmCache[this.activeModel.model.algorithm] : null);

    async loadAlgorithm() {
        if (!this.activeModel) return;
        const algoId = this.activeModel.model.algorithm;
        if (this.#algorithmCache[algoId]) return;

        try {
            this.#algorithmCache[algoId] = await ModelService.getAlgorithmName(algoId);
        } catch (e) {
            this.errorMessage = "Failed to load algorithm details.";
        }
    }
}