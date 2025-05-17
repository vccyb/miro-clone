<template>
    <component :is="`svg-${previewComponentName}`" :layer="layer" @layerPointerDown="handlLayerPointerDown" :id="id" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LayerType } from "@/types/canvas"
import { useCanvasStore } from '@/stores/canvas.ts'

interface LayerPreviewProps {
    id: string
}


const canvasStore = useCanvasStore()

const props = defineProps<LayerPreviewProps>()

// get layer with id from canvasStore
// const layer = ref(canvasStore.getLayerById(props.id))

const layer = computed(() => canvasStore.getLayerById(props.id))



const previewComponentName = computed(() => {
    switch (layer.value.type) {
        case LayerType.Rectangle:
            return "rectangle"
            break;
        case LayerType.Ellipse:
            return "ellipse"
            break;
        case LayerType.Note:
            return "note"
            break;
        case LayerType.Text:
            return "text"
            break;
        case LayerType.Path:
            return "path"
            break;
        default:
            return null
    }
})


const emit = defineEmits<{
    (e: 'layerPointerDown', layerId: string): void
}>()

const handlLayerPointerDown = (event: PointEvent, layerId: string) => {

    // console.log("layerPreviews layerPointerDown", event, layerId);
    emit('layerPointerDown', event, layerId)
}



</script>
