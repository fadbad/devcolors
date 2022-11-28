<script>
    export let value = false
    export let title = ''
    export let width = ''
    const hide = () => value = false

    $: {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = value ? 'hidden' : 'auto'
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
    class="modal {$$restProps?.class || ''}" 
    on:click|self={hide}
    style:opacity={value === true ? 1 : 0}
    style:visibility={value === true ? 'visible' : 'hidden'}
    style:pointer-events={value === true ? 'auto' : 'none'}
>
    <div class="modal-box py-0 {width}">
        
        <div class="bg-white sticky flex items-center justify-between py-2 shadow-md -mx-6 px-6 top-0">
            {#if title}
                <h3 class="font-bold text-lg">{title}</h3>
            {/if}
            
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label 
                on:click|self={hide}
                class="w-6 h-6 rounded-full text-black flex items-center justify-center hover:opacity-70 transition-all cursor-pointer"
            >✕</label>
        </div>

        <p class="py-4">
            <slot />
        </p>

        {#if $$slots.actions}
            <div class="modal-action sticky bottom-0 bg-white py-2 -mx-6 px-6 border-t">
                <slot name="actions" />
            </div>
        {/if}
    </div>
</div>
