<script lang="ts">
    import { writable } from 'svelte/store';
    import { browser } from '$app/environment';
    import { onMount } from "svelte";
    import { afterNavigate } from '$app/navigation';
    import {EnhanceEndpoints} from "$lib/config/uiEndpoints";
    import {Button} from "flowbite-svelte";

    type Section = {
        label: string;
        endpoint: string;
    };

    const sections: Section[] = EnhanceEndpoints.map((endpoint, index) => ({
        label: `Step ${index + 1}: ${endpoint.name}`,
        endpoint: endpoint.url,
    }));

    const activeIndex = writable(0);
    let showSidebar: boolean = $state(false);

    function updateFromPath(path: string) {
        if (!browser) return;
        showSidebar = EnhanceEndpoints.map(e => e.url).includes(path);
        const currentIndex = sections.findIndex(section =>
            section.endpoint === path
        );

        if (currentIndex !== -1) {
            activeIndex.set(currentIndex);
        } else {
            activeIndex.set(-1);
        }
    }

    onMount(() => {
        if (!browser) return;
        updateFromPath(window.location.pathname);
        afterNavigate(({ to }) => {
            if (to) {
                updateFromPath(to.url.pathname);
            }
        });
    });

    function navigate(index: number) {
        if (!browser) return;
        activeIndex.set(index);
        window.location.href = sections[index].endpoint;
        // Alternativa con SvelteKit navigation:
        // goto(sections[index].endpoint);
    }

    function isButtonEnabled(buttonIndex: number, currentActiveIndex: number): boolean {
        if (currentActiveIndex === -1) return false;
        return buttonIndex <= currentActiveIndex;
    }

    function getButtonClass(i: number, currentActiveIndex: number): string {
        const baseClass = "w-full p-3 rounded-lg text-left border-none transition-all";

        if (i === currentActiveIndex) {
            return `${baseClass} bg-green-500/70 text-white shadow-sm`;
        } else if (isButtonEnabled(i, currentActiveIndex)) {
            return `${baseClass} bg-white/50 text-black hover:bg-white/70`;
        } else {
            return `${baseClass} bg-white/30 text-black opacity-50 cursor-not-allowed`;
        }
    }
</script>

{#if browser && showSidebar}
    <nav class="h-screen w-48 bg-gray-100/30 backdrop-blur-sm flex flex-col items-center p-4 fixed left-0 top-20">
        {#each sections as section, i}
            <Button
                    class={getButtonClass(i, $activeIndex)}
                    disabled={!isButtonEnabled(i, $activeIndex)}
                    onclick={() => navigate(i)}
            >
                <span class="font-small">{section.label}</span>
            </Button>

            {#if i < sections.length - 1}
                <div class="w-4 h-2 my-1 flex items-center justify-center">
                    <svg class="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            {/if}
        {/each}
    </nav>
{/if}