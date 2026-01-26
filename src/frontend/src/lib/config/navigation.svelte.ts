import { browser } from '$app/environment';
import { CreateEndpoints, EnhanceEndpoints } from "$lib/config/uiEndpoints";

export type Section = { label: string; endpoint: string };

class NavigationState {

    #mode = $state<"create" | "enhanced">(
        (browser && sessionStorage.getItem("path") as any) || "create"
    );

    get mode() { return this.#mode; }

    set mode(value: "create" | "enhanced") {
        this.#mode = value;
        if (browser) sessionStorage.setItem("path", value);
    }


    sections = $derived.by(() => {
        const source = this.#mode === "enhanced" ? EnhanceEndpoints : CreateEndpoints;
        return source.map((e, i) => ({
            label: `Step ${i + 1}: ${e.name}`,
            endpoint: e.url,
        }));
    });


    findIndex(currentPath: string): number {
        return this.sections.findIndex(s => s.endpoint === currentPath);
    }

    getPrevLink(currentPath: string): string | null {
        const index = this.findIndex(currentPath);
        return index > 0 ? this.sections[index - 1].endpoint : null;
    }

    getNextLink(currentPath: string): string | null {
        const index = this.findIndex(currentPath);
        if (index === -1 || index >= this.sections.length - 1) return null;
        return this.sections[index + 1].endpoint;
    }
}

export const navState = new NavigationState();