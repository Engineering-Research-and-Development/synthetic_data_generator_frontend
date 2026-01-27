import type { NewAlgorithm } from "../../../types/algorithms";
import type { SelectedModel } from "../../../types/ambient";

export class BlueprintController {
    #getAvailableAlgorithms: () => NewAlgorithm[];

    // Reactive State
    algorithmName = $state("");
    newModelName = $state("");

    constructor(getAlgos: () => NewAlgorithm[]) {
        this.#getAvailableAlgorithms = getAlgos;
    }

    // Row data Access
    get availableAlgorithms() {
        return this.#getAvailableAlgorithms();
    }

    // Select Option
    options = $derived(
        this.availableAlgorithms.map((algo) => ({
            value: algo.name,
            name: algo.name
        }))
    );

    // Current Selected Algo
    chosenAlgo = $derived(
        this.availableAlgorithms.find((a) => a.name === this.algorithmName) ?? null
    );

    // Automatic map of the data structure
    selectedModelData = $derived.by((): SelectedModel | null => {
        if (!this.chosenAlgo) return null;
        return {
            id: this.chosenAlgo.id,
            name: this.chosenAlgo.name,
            new: true,
            version: this.newModelName
        };
    });
}