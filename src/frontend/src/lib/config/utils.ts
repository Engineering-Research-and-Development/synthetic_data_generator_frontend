import {Endpoints} from "$lib/config/uiEndpoints";

export function getEndpointUrl(pageKey: string): string {
    const endpoint = Endpoints.find(e => e.id === pageKey);
    return endpoint?.url || "";
}