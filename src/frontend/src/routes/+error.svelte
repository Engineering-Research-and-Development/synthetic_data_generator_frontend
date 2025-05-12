<script lang="ts">
    import { onMount } from 'svelte';

    interface ConfettiItem {
        emoji: string;
        left: number;
        speed: number;
        delay: number;
    }

    let isConfetti: boolean = false;
    const emojis: string[] = ['🎉', '🎊', '✨', '🌟', '💫', '🥳'];
    let confettiItems: ConfettiItem[] = [];

    const throwConfetti = (): void => {
        isConfetti = true;
        confettiItems = Array(20).fill(null).map((): ConfettiItem => ({
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            left: Math.random() * 100,
            speed: 1 + Math.random() * 3,
            delay: Math.random() * 2
        }));

        setTimeout(() => isConfetti = false, 3000);
    };

    // Optional: Auto-trigger confetti on first visit
    onMount(() => {
        const hasSeenError = sessionStorage.getItem('seenError');
        if (!hasSeenError) {
            throwConfetti();
            sessionStorage.setItem('seenError', 'true');
        }
    });
</script>

<div class="max-w-2xl mx-auto p-8 text-center">
    <!-- Confetti elements -->
    {#if isConfetti}
        {#each confettiItems as item, i (i)}
            <div
                    class="fixed text-2xl z-50 pointer-events-none"
                    style="left: {item.left}vw;
               animation: fall {item.speed}s linear {item.delay}s forwards;"
            >
                {item.emoji}
            </div>
        {/each}

        <style>
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        </style>
    {/if}

    <h1 class="text-5xl font-extrabold text-red-500 mb-2">404: Page Not Found</h1>
    <p class="text-gray-200 italic">(But we found this cool error message!)</p>

    <div class="my-8 flex justify-center">
        <div class="w-48 h-48 bg-yellow-300 rounded-full flex items-center justify-center relative">
            <!-- Eyes -->
            <div class="w-12 h-12 bg-gray-800 rounded-full absolute top-12 left-10"></div>
            <div class="w-12 h-12 bg-gray-800 rounded-full absolute top-12 right-10"></div>
            <!-- Mouth -->
            <div class="w-24 h-4 bg-gray-800 rounded-full absolute bottom-12"></div>
            <!-- Eyebrows -->
            <div class="w-6 h-6 absolute top-8 left-8 transform rotate-45">
                <div class="w-full h-1 bg-gray-800"></div>
                <div class="w-1 h-full bg-gray-800 ml-1"></div>
            </div>
            <div class="w-6 h-6 absolute top-8 right-8 transform -rotate-45">
                <div class="w-full h-1 bg-gray-800"></div>
                <div class="w-1 h-full bg-gray-800 mr-1"></div>
            </div>
        </div>
    </div>

    <p class="text-xl mb-4 text-white">Looks like you took a wrong turn at Albuquerque.</p>
    <p class="text-xl mb-8 text-white">Don't worry, even GPS makes mistakes sometimes.</p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a
                href="/"
                class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 focus:ring-4 focus:ring-green-300"
        >
            Take Me Home
        </a>
        <button
                on:click={throwConfetti}
                class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-all hover:scale-105 focus:ring-4 focus:ring-blue-300"
                aria-label="Throw confetti"
        >
            Make It Rain Confetti
        </button>
    </div>

    <div class="bg-gray-100 p-4 rounded-lg">
        <p class="text-sm text-gray-700">
            <span class="font-bold">Error Code:</span> 404-UH-OH<br>
            <span class="font-bold">Technical details:</span> The page you're looking for is currently on vacation.
        </p>
        <p class="text-xs text-gray-500 mt-2">
            Need help? Try turning it off and on again. Or <a href="/contact" class="text-blue-500 hover:underline">contact support</a>.
        </p>
    </div>
</div>