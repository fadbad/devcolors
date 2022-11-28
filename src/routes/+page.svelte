<script>
    import { onMount } from "svelte";
    import { tinycolor, createPalette, capitalize, Modal } from "$lib"

    let mounted = false
    let valid = false
    let output = ''
    let colors = []
    let combinations = []
    let palette = {}
    const names = tinycolor.names
    let namesModal = false
    let namesIDX = -1

    let options = [
        'd80212',
        'lime',
        'violet',
        'pink',
        'fc0',
        'blue',
        'rgb 255 128 128',
        'hsl(0, 100%, 50%)',
        'hsv 0, 100%, 50%',
    ]

    let color = options[0]


    function colorChange(color) {
        if(!mounted) return 

        const tiny = tinycolor(color);
        valid = tiny.isValid()

        if(!valid) return;

        palette = createPalette(tiny.toHexString())

        output = [
            "hex:\t" + tiny.toHexString(),
            "rgb:\t" + tiny.toRgbString(),
            "hsl:\t" + tiny.toHslString(),
            "hsv:\t" + tiny.toHsvString(),
            "name:\t" + (tiny.toName() || "none"),
        ].join("\n");

        colors = [
            {name: 'color', color: tiny.toHexString()},
            {name: 'lighten', color: tinycolor(color).lighten(20).toHexString()},
            {name: 'darken', color: tinycolor(color).darken(20).toHexString()},
            {name: 'saturate', color: tinycolor(color).saturate(20).toHexString()},
            {name: 'desaturate', color: tinycolor(color).desaturate(20).toHexString()},
            {name: 'brighten', color: tinycolor(color).brighten(20).toHexString()},
            {name: 'greyscale', color: tinycolor(color).greyscale().toHexString()},
        ]

        combinations = [
            {
                name: 'triad', 
                colors: tiny.triad().map(i => i.toHexString())
            },
            {
                name: 'tetrad', 
                colors: tiny.tetrad().map(i => i.toHexString())
            },
            {
                name: 'monochromatic', 
                colors: tiny.monochromatic().map(i => i.toHexString())
            },
            {
                name: 'analogous', 
                colors: tiny.analogous().map(i => i.toHexString())
            },
            {
                name: 'splitcomplement', 
                colors: tiny.splitcomplement().map(i => i.toHexString())
            },
        ]

    }

    $: color, colorChange(color)

    onMount(() => {
        mounted = true
        colorChange(color)
    })
</script>
<div class="bg-black py-10 px-[10vw]">
    <div class="mb-10 mt-5">
        <div class="w-full md:w-[60%]">
            <div class="mx-2 flex items-center justify-between">
                <span>Enter a color</span>
                <button 
                    type="button"
                    class="font-medium opacity-70 text-sm"
                    on:click={() => namesModal = true}
                >
                    color names
                </button>
            </div>
            <input 
                type="text" 
                placeholder="any color." 
                bind:value={color}
                class="input bg-white text-black w-full my-1"
            />
        </div>
        <div class="flex mx-2">
            {#each options as opt, ind}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div 
                    class="mr-2 cursor-pointer pb-[1px] border-b border-white hover:border-slate-200 transition-all"
                    on:click={() => color = opt}
                    class:hidden={ind > 5}
                    class:md:block={ind > 5}
                >
                    {opt}
                </div>
            {/each}
        </div>
    </div>

    {#if valid}
        <pre class="mb-10">{output}</pre>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div class="mb-10">
                <h2>Colors</h2>
                {#each colors as c}
                    <div class="flex items-center mb-2">
                        <div class="font-semibold w-1/3 md:w-auto md:min-w-[120px]">
                            {capitalize(c.name)}
                        </div>
                        <div 
                            class='w-20 h-10 mx-2' 
                            style:background={c.color}
                        ></div>
                        <div class="opacity-70 text-sm">
                            {c.color}
                        </div>
                    </div>
                {/each}
            </div>

            <div class="mb-10">
                <h2>Palette</h2>
                <div class="flex mb-5">
                    {#each Object.entries(palette) as [num, c]}
                        <div 
                            class='w-10 h-10 mr-1' 
                            style:background={c}
                        ></div>
                    {/each}
                </div>
                <pre>{JSON.stringify(palette, null, 4)}</pre>
            </div>

        </div>

        <h2>Combinations</h2>
        <div class="mb-10">
            {#each combinations as c}
                <div class="block md:flex items-center">
                    <div class="md:min-w-[120px] font-semibold">
                        {capitalize(c.name)}
                    </div>
                    <div>
                        {#each c.colors as color}
                            <span 
                                class="w-10 md:w-20 h-10 inline-block mr-1" 
                                style:background={color}
                            >
                            </span>
                        {/each}
                        <div class="opacity-70 text-sm mb-5">
                            [{c.colors.map(c => `"${c}"`).join(', ')}]
                        </div>
                    </div>
                </div>
            {/each}
        </div>

    {/if}

</div>

<Modal bind:value={namesModal} title={'Color Names'} class="text-black">
    {#each Object.entries(names) as [k, v], i}
        <button 
            type="button"
            class="w-full grid grid-cols-2 gap-4 mb-2 md:py-1 rounded-md transition-all"
            on:click={() => {
                color = k 
                namesModal = false
            }}
            on:mouseenter={() => namesIDX = i}
            style:background={namesIDX === i ? `#${v}` : '#fff'}
            style:color={namesIDX === i ? tinycolor(k).isLight() ? '#000' : '#fff' : '#000'}
        >
            <div class="text-right">
                {k}
            </div>
            <div class="flex items-center">
                <div class="w-6 h-6 rounded mr-3" style:background={`#${v}`}></div>
                <span>#{v}</span>
            </div>
        </button>
    {/each}
</Modal>

<style>
    h2 {
        font-weight: 600;
        font-size: 32px;
    }
</style>
