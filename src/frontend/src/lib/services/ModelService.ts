import { get } from 'svelte/store';
import { MiddlewareUrls } from "$lib/config/middlewareUrls";
import {BACKEND_URL} from "../../stores/shared";
import type {NewAlgorithm} from "../../types/algorithms";
import type {TrainedModel} from "../../types/models";

export class ModelService {
    private static readonly baseUrl = get(BACKEND_URL);

    // ---------- ALGORITHMS ----------

    public static async getAlgorithmName(algorithmId: number): Promise<string> {
        const response = await fetch(
            `${ModelService.baseUrl}${MiddlewareUrls.algorithms}${algorithmId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch algorithm");
        }

        const data = await response.json();
        return data?.algorithm?.name ?? "Unknown";
    }

    public async fetchAlgorithms(): Promise<NewAlgorithm[]> {
        const response = await fetch(
            `${ModelService.baseUrl}${MiddlewareUrls.algorithms}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch algorithms");
        }

        const { algorithms } = await response.json();
        const ids: number[] = algorithms.map((a: { id: number }) => a.id);

        const results = await Promise.all(
            ids.map(id => ModelService.fetchAlgorithmDetails(id))
        );

        return results.map(ModelService.normalizeAlgorithmName);
    }

    private static async fetchAlgorithmDetails(id: number): Promise<NewAlgorithm> {
        const response = await fetch(
            `${ModelService.baseUrl}${MiddlewareUrls.algorithms}${id}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch algorithm ${id}`);
        }

        const { algorithm, datatypes } = await response.json();
        return { ...algorithm, datatypes };
    }

    // ---------- TRAINED MODELS ----------

    public async fetchTrainedModels(): Promise<TrainedModel[]> {
        const response = await fetch(
            `${ModelService.baseUrl}${MiddlewareUrls.trained_models}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch trained models");
        }

        const { models } = await response.json();

        return Promise.all(
            models.map((m: any) =>
                ModelService.fetchTrainedModelDetails(m.model.id)
            )
        );
    }

    private static async fetchTrainedModelDetails(id: number): Promise<TrainedModel> {
        const response = await fetch(
            `${ModelService.baseUrl}${MiddlewareUrls.trained_models}${id}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch trained model ${id}`);
        }

        return response.json();
    }

    // ---------- HELPERS ----------

    private static normalizeAlgorithmName(algo: NewAlgorithm): NewAlgorithm {
        const lastDot = algo.name.lastIndexOf(".");
        return {
            ...algo,
            name: lastDot >= 0 ? algo.name.slice(lastDot + 1) : algo.name
        };
    }
}
