<template>
  <rect class="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
    :style="{ transform: `translate(${bounds?.x}px,${bounds?.y}px` }" :x="0" :y="0" :height="bounds?.height"
    :width="bounds?.width">
  </rect>
</template>

<script setup lang="ts">

import type { Side, } from "@/types/canvas.ts"
import { LayerType, XYWH } from "@/types/canvas.ts"
import { computed, inject, watch, ref } from "vue"
import { useCanvasStore } from "@/stores/canvas.ts"
import { boundingBox } from "@/hook/useSelectionBounds.ts"

const canvasStore = useCanvasStore()
// 结构layers


const HANDLE_WIDTH = 8

const emit = defineEmits<{
  resizeHandlePointerDown: [corner: Side, initialBounds: XYWH]
}>()



const currentLayerId = computed(() => canvasStore.currentLayerId)

const bounds = ref<XYWH | null>(null)
watch(currentLayerId, (newId) => {
  const layer = newId ? canvasStore.getLayerById(newId) : null
  bounds.value = layer ? { ...layer } : null
}, { immediate: true })

// const isShowingHandles = computed(() => {
//   const lastLayer = canvasStore.lastLayer

//   if (!lastLayer) return false

//   // 检查是否有 id 和 type 不是 Path
//   return lastLayer.type !== LayerType.Path
// })



</script>

<style scoped></style>