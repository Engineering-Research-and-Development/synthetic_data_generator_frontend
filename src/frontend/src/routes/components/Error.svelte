<script lang="ts">
    import { Button, Modal } from "flowbite-svelte";
    import { ExclamationCircleOutline } from "flowbite-svelte-icons";

    let { errorMessage = $bindable() } = $props()

</script>

<Modal
        bind:open={errorMessage}
        size="xs"
        autoclose
>
    <div class="text-center">
        <ExclamationCircleOutline
                class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
        />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {errorMessage}
        </h3>
        <Button color="red" class="me-2">
            Ok
        </Button>
    </div>
</Modal>
