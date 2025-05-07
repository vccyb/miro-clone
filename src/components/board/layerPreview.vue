<template>
    <component :is="`svg-${previewComponentName}`" :layer="layer" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LayerType } from "@/types/canvas"

interface LayerPreviewProps {
    id: string
}

import { useCanvasStore } from '@/stores/canvas.ts'
const canvasStore = useCanvasStore()

const props = defineProps<LayerPreviewProps>()

// get layer with id from canvasStore
const layer = ref(canvasStore.getLayerById(props.id))



const previewComponentName = computed(() => {
    switch (layer.value.type) {
        case LayerType.Rectangle:
            return "rectangle"
            break;
        case LayerType.Ellipse:
            return "ellipse"
            break;
        default:
            return null
    }
})



</script>
