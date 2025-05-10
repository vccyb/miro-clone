<template>
  <rect class="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
    :style="{ transform: `translate(${bounds?.x}px,${bounds?.y}px` }" :x="0" :y="0" :height="bounds?.height"
    :width="bounds?.width">
  </rect>
  <template v-if="isShowingHandles">
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x - HANDLE_WIDTH / 2}px,${bounds?.y - HANDLE_WIDTH / 2}px)`
    }" @pointerdown="(e) => handlePointerDown(e, Side.Top + Side.Left, bounds)"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'ne-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x + bounds?.width / 2 - HANDLE_WIDTH / 2}px,${bounds?.y - HANDLE_WIDTH / 2}px)`
    }"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x + bounds?.width - HANDLE_WIDTH / 2}px,${bounds?.y - HANDLE_WIDTH / 2}px)`
    }"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height / 2 - HANDLE_WIDTH / 2}px)`
    }"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x + bounds?.width - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height / 2 - HANDLE_WIDTH / 2}px)`
    }"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height - HANDLE_WIDTH / 2}px)`
    }"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x + bounds?.width / 2 - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height - HANDLE_WIDTH / 2}px)`
    }"></rect>
    <rect class="fill-white stroke-1 stroke-blue-500" :x="0" :y="0" :style="{
      cursor: 'nw-resize',
      width: `${HANDLE_WIDTH}px`,
      height: `${HANDLE_WIDTH}px`,
      transform: `translate(${bounds?.x + bounds?.width - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height - HANDLE_WIDTH / 2}px)`
    }"></rect>
  </template>
</template>

<script setup lang="ts">

import { LayerType, XYWH, Side } from "@/types/canvas.ts"
import { computed, inject, watch, ref } from "vue"
import { useCanvasStore } from "@/stores/canvas.ts"
import { boundingBox } from "@/hook/useSelectionBounds.ts"

const canvasStore = useCanvasStore()
// 结构layers

const canvasState = inject("canvasState", canvasStore)

const HANDLE_WIDTH = 8

const emit = defineEmits<{
  resizeHandlePointerDown: [corner: Side, initialBounds: XYWH]
}>()


const handlePointerDown = ($event: PointerEvent, corner: Side, initialBounds: XYWH) => {
  $event.stopPropagation()
  emit('resizeHandlePointerDown', corner, initialBounds)
}


const currentLayerId = computed(() => canvasStore.currentLayerId)
const bounds = computed<XYWH | null>(() => {
  const layer = currentLayerId.value ? canvasStore.getLayerById(currentLayerId.value) : null
  if (layer && layer.type !== LayerType.Path) {
    return boundingBox([layer])
  } else {
    return null
  }
})

const isShowingHandles = ref<boolean>(false)

watch(currentLayerId, (newId) => {
  const layer = newId ? canvasStore.getLayerById(newId) : null

  if (layer && layer.type !== LayerType.Path) {
    isShowingHandles.value = true
  } else {
    isShowingHandles.value = false
  }
}, { immediate: true })





</script>

<style scoped></style>