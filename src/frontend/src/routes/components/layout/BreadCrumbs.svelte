<script lang="ts">
    import { browser } from '$app/environment';
    import { afterNavigate, goto } from '$app/navigation';
    import { Button } from "flowbite-svelte";
    import { navState } from '$lib/config/navigation.svelte.js';

    // --- State (Runes) ---
    let currentPath = $state(browser ? window.location.pathname : "");

    const activeIndex = $derived(navState.sections.findIndex(s => s.endpoint === currentPath));
    const showSidebar = $derived(activeIndex !== -1);

    // --- Logic & Helpers ---
    afterNavigate(({ to }) => {
        if (to) currentPath = to.url.pathname;
    });

    const isButtonEnabled = (i: number) => activeIndex !== -1 && i <= activeIndex;

    const getButtonClass = (i: number) => {
        const base = "w-full p-3 rounded-lg text-left border-none transition-all";
        if (i === activeIndex) return `${base} bg-green-500/70 text-white shadow-sm`;
        if (isButtonEnabled(i)) return `${base} bg-white/50 text-black hover:bg-white/70`;
        return `${base} bg-white/30 text-black opacity-50 cursor-not-allowed`;
    };

    async function handleNavigate(index: number) {
        if (!isButtonEnabled(index)) return;
        await goto(navState.sections[index].endpoint);
    }
</script>

{#if browser && showSidebar}
    <nav class="h-screen w-48 bg-gray-100/30 backdrop-blur-sm flex flex-col items-center p-4 fixed left-0 z-50">
        {#each navState.sections as section, i}
            <Button
                    class={getButtonClass(i)}
                    disabled={!isButtonEnabled(i)}
                    onclick={() => handleNavigate(i)}
            >
                <span class="text-sm font-medium">{section.label}</span>
            </Button>

            {#if i < navState.sections.length - 1}
                <div class="w-4 h-2 my-1 flex items-center justify-center">
                    <svg class="w-3 h-3 text-black opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            {/if}
        {/each}
    </nav>
{/if}