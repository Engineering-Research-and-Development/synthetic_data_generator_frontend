<script lang="ts">
import {Spinner} from "flowbite-svelte";
let {text} = $props()
</script>

<div class="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300">
    <div class="flex flex-col items-center">
        <Spinner type="bars" color="blue" size="xl" />
        <span class="text-white mt-4 text-lg font-medium">{text}</span>
    </div>
</div>