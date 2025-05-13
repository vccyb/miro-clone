<template>
  <rect
    class="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
    :style="{ transform: `translate(${bounds?.x}px,${bounds?.y}px` }"
    :x="0"
    :y="0"
    :height="bounds?.height"
    :width="bounds?.width"
  >
  </rect>
  <template v-if="isShowingHandles">
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'nwse-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x - HANDLE_WIDTH / 2}px,${bounds?.y - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Top + Side.Left, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'ns-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x + bounds?.width / 2 - HANDLE_WIDTH / 2}px,${bounds?.y - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Top, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'nesw-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x + bounds?.width - HANDLE_WIDTH / 2}px,${bounds?.y - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Top + Side.Right, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'ew-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height / 2 - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Left, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'ew-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x + bounds?.width - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height / 2 - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Right, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'nesw-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Bottom + Side.Left, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'ns-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x + bounds?.width / 2 - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Bottom, bounds)"
    ></rect>
    <rect
      class="fill-white stroke-1 stroke-blue-500"
      :x="0"
      :y="0"
      :style="{
        cursor: 'nwse-resize',
        width: `${HANDLE_WIDTH}px`,
        height: `${HANDLE_WIDTH}px`,
        transform: `translate(${bounds?.x + bounds?.width - HANDLE_WIDTH / 2}px,${bounds?.y + bounds?.height - HANDLE_WIDTH / 2}px)`,
      }"
      @pointerdown="(e) => handlePointerDown(e, Side.Bottom + Side.Right, bounds)"
    ></rect>
  </template>
</template>

<script setup lang="ts">
import { LayerType, XYWH, Side } from '@/types/canvas.ts'
import { computed, inject, watch, ref } from 'vue'
import { useCanvasStore } from '@/stores/canvas.ts'
import { boundingBox } from '@/hook/useSelectionBounds.ts'

const canvasStore = useCanvasStore()
// 结构layers

const canvasState = inject('canvasState', canvasStore)

const HANDLE_WIDTH = 8

const emit = defineEmits<{
  resizeHandlePointerDown: [corner: Side, initialBounds: XYWH]
}>()

const handlePointerDown = ($event: PointerEvent, corner: Side, initialBounds: XYWH) => {
  $event.stopPropagation()
  emit('resizeHandlePointerDown', corner, initialBounds)
}

const currentLayerIds = computed(() => canvasStore.currentLayerIds)
const bounds = computed<XYWH | null>(() => {
  if (!currentLayerIds.value) return null
  const layers = []
  for (const id of currentLayerIds.value) {
    const layer = canvasStore.getLayerById(id)
    if (layer) {
      layers.push(layer)
    }
  }
  return boundingBox(layers)
})

const isShowingHandles = ref<boolean>(true)


</script>

<style scoped></style>
