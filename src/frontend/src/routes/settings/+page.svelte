<script lang="ts">
    import {BACKEND_URL, COUCH_URL} from '../../stores/shared';
    import { Input, Toast } from 'flowbite-svelte';
    import { FireOutline } from "flowbite-svelte-icons";
    import {get} from "svelte/store";

    let backendUrl: string = get(BACKEND_URL);
    let couchUrl: string = get(COUCH_URL);
    let error: string | null = null;
    let message: string | null = null;

    const validateUrl = (url: string): boolean => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch {
            return false;
        }
    };
    const sanitizeUrl = (url: string): string => {
        error = null;

        // Trim and ensure no trailing slash
        const sanitizedUrl = url.trim().replace(/\/+$/, '');

        if (!sanitizedUrl) {
            error = 'URL is required';
            return "";
        }

        // Add https:// if no protocol is specified
        let finalUrl = sanitizedUrl;
        if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
            finalUrl = `https://${sanitizedUrl}`;
        }

        if (!validateUrl(finalUrl)) {
            error = 'URL must start with http:// or https:// and be a valid URL';
            return "";
        }
        return finalUrl;
    }
    const handleSubmit = () => {
        backendUrl = sanitizeUrl(backendUrl);
        couchUrl = sanitizeUrl(couchUrl);
        if (!backendUrl || !couchUrl) {
            return;
        }

        BACKEND_URL.set(backendUrl);
        COUCH_URL.set(couchUrl);
        message = 'URL updated successfully';
    };
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
    <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Middleware Backend Configuration</h1>
    {#if (message)}
        <Toast>
            <FireOutline class="text-primary-500 bg-primary-100 dark:bg-primary-800 dark:text-primary-200 h-6 w-6" />
            {message}
        </Toast>
    {/if}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
            <label for="backend-url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Middleware Backend URL
            </label>
            <Input
                    id="backend-url"
                    bind:value={backendUrl}
                    type="text"
                    placeholder="https://api.example.com"
                    class="w-full"
            />
            {#if error}
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
            {/if}

            <label for="backend-url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                CouchDB  URL
            </label>
            <Input
                    id="couch-url"
                    bind:value={couchUrl}
                    type="text"
                    placeholder="https://api.example.com"
                    class="w-full"
            />
            {#if error}
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
            {/if}
        </div>

        <button
                type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Save URL
        </button>
    </form>

    <div class="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
        <p class="text-sm text-gray-700 dark:text-gray-300">
            Current Backend URL: <span class="font-mono text-blue-600 dark:text-blue-400">{$BACKEND_URL}</span>
        </p>
    </div>

    <div class="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
        <p class="text-sm text-gray-700 dark:text-gray-300">
            Current Couch URL: <span class="font-mono text-blue-600 dark:text-blue-400">{$COUCH_URL}</span>
        </p>
    </div>
</div>