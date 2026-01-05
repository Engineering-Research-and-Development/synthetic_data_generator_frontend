<script lang="ts">
    import { ExclamationTriangle, Home, ArrowPath } from 'svelte-heros-v2';
    import {Section} from "flowbite-svelte-blocks";
</script>

<Section class="min-h-screen flex items-center justify-center bg-gray-900 px-6">
    <div class="max-w-xl w-full text-center space-y-6">

        <!-- Icon -->
        <div class="flex justify-center">
            <div class="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                <ExclamationTriangle class="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
        </div>

        <!-- Error code -->
        <h1 class="text-6xl font-extrabold text-white tracking-tight">
            404
        </h1>

        <p class="text-xl font-medium text-gray-300">
            Page not found
        </p>

        <p class="text-gray-400 max-w-md mx-auto">
            The page you are trying to access does not exist, has been moved,
            or is temporarily unavailable.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
                    href="/"
                    class="inline-flex items-center justify-center gap-2 px-6 py-3
				       rounded-lg bg-blue-600 hover:bg-blue-700
				       text-white font-semibold
				       focus:ring-4 focus:ring-blue-300 transition"
            >
                <Home class="w-5 h-5" />
                Go to Home
            </a>

            <button
                    on:click={() => location.reload()}
                    class="inline-flex items-center justify-center gap-2 px-6 py-3
				       rounded-lg bg-gray-700 hover:bg-gray-600
				       text-white font-semibold
				       focus:ring-4 focus:ring-gray-400 transition"
            >
                <ArrowPath class="w-5 h-5" />
                Reload
            </button>
        </div>

        <!-- Technical footer -->
        <p class="pt-6 text-sm text-gray-500">
            Error code: <span class="font-mono">HTTP_404</span>
        </p>

    </div>
</Section>
