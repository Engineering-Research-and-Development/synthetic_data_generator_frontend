<script>
    import {ButtonGroup, Input, InputAddon, Label} from "flowbite-svelte";
    import { PlusOutline } from 'flowbite-svelte-icons';

    let {additionalRows= $bindable()} = $props()
</script>

<div class="flex items-center justify-center">
    <div>
        <Label class="block mb-2">Additional number of rows to create</Label>
        <ButtonGroup>
            <InputAddon>
                <PlusOutline class="w-4 h-4 text-gray-500" />
            </InputAddon>
            <Input
                    bind:value={additionalRows}
                    placeholder="0"
                    type="number"
                    required
            />
        </ButtonGroup>
    </div>
</div>