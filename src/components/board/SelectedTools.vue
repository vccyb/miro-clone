<template>
  <div v-if="currentLayer" class="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
    :style="transformStyle">
    Selected Tools
  </div>
</template>

<script setup lang="ts">

// vue
import { computed } from 'vue'

// store
import { useCanvasStore } from "@/stores/canvas.ts"

// types
import { Camera } from "@/types/canvas.ts"

// props
interface SelectedToolsProps {
  camera: Camera,
}
const props = defineProps<SelectedToolsProps>()

const canvasState = useCanvasStore()

// get selected layer's bound
const currentLayer = computed(() => {
  return canvasState.getCurrentLayer
})

const x = computed(() => {
  return currentLayer.value?.x + currentLayer.value?.width / 2 + props.camera.x
})

const y = computed(() => {
  return currentLayer.value?.y + props.camera.y
})

const transformStyle = computed(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value - 16}px - 100%))`
}));




</script>

<style scoped></style>