<template>
  <div
    v-if="currentLayer"
    class="absolute p-3 rounded-xl bg-white shadow-sm flex select-none"
    :style="transformStyle"
  >
    <ColorPicker @change="handleColorChange"></ColorPicker>
    <div class="flex flex-col gap-y-0.5">
      <n-tooltip placement="right" trigger="hover" >
        <template #trigger>
          <n-button style="font-size: 24px; width: 16px"  :focusable="false" class="toolbar-btn  flex items-center justify-center" type="default" size="large" :quaternary="true"
                    @click="handleBringToFront">
            <template #icon>
              <iconify-icon icon="lucide:bring-to-front"></iconify-icon>
            </template>
          </n-button>
        </template>
        {{ "上层一层"}}
      </n-tooltip>
      <n-tooltip placement="right" trigger="hover" >
        <template #trigger>
          <n-button style="font-size: 24px; width: 16px"  :focusable="false" class="toolbar-btn  flex items-center justify-center" type="default" size="large" :quaternary="true"
                    @click="handleSendToBack">
            <template #icon>
              <iconify-icon icon="lucide:send-to-back"></iconify-icon>
            </template>
          </n-button>
        </template>
        {{ "下降一层"}}
      </n-tooltip>
    </div>
    <div class="flex pl-2 border-l ml-2 items-center  border-neutral-200">
      <n-tooltip placement="right" trigger="hover" >
        <template #trigger>
          <n-button style="font-size: 24px; width: 16px"  :focusable="false" class="toolbar-btn  flex items-center justify-center" type="default" size="large" :quaternary="true"
          @click="handleDelete">
            <template #icon>
              <iconify-icon icon="material-symbols:delete-outline-sharp"></iconify-icon>
            </template>
          </n-button>
        </template>
        {{ "删除"}}
      </n-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
// component
import ColorPicker from '@/components/board/ColorPicker.vue'
import { NTooltip } from 'naive-ui'
import { NButton } from 'naive-ui'

// vue
import { computed } from 'vue'

// store
import { useCanvasStore } from '@/stores/canvas.ts'

// types
import type { Camera, Color } from '@/types/canvas.ts'

// props
interface SelectedToolsProps {
  camera: Camera
}

const props = defineProps<SelectedToolsProps>()

const canvasState = useCanvasStore()

// get selected layer's bound
const currentLayer = computed(() => {
  return canvasState.getCurrentLayer
})

const x = computed(() => {
  if(!currentLayer.value) return 0
  return currentLayer.value?.x + currentLayer.value?.width / 2 + props.camera.x
})

const y = computed(() => {
  if(!currentLayer.value) return 0
  return currentLayer.value?.y + props.camera.y
})

const transformStyle = computed(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value - 16}px - 100%))`,
}))

// color
const handleColorChange = (color: Color) => {
  // 1. update current layer's color
  const currentLayer = canvasState.getCurrentLayer
  if (currentLayer) {
    canvasState.updateLayerWithColorAndId(currentLayer.id, color)
  }
  // 2. update last used color
  canvasState.setLastUsedColor(color)
}


// delete
const handleDelete = () => {
  const currentLayer = canvasState.getCurrentLayer
  if (currentLayer) {
    canvasState.deleteCurrentLayer()
  }
}



// to back or to front
const handleBringToFront = () => {
  // ids index越往后，渲染越在前面
  // 1. get currentLayerId
  const currentLayerId = canvasState.currentLayerId
  if (!currentLayerId) return // 如果没有选中图层，直接返回
  // 2. get currentLayerIndex
  const currentLayerIndex = canvasState.layerIds.indexOf(currentLayerId)
  // 如果当前图层不在图层列表中，或者已经在最底层，直接返回
  if (currentLayerIndex === -1 || currentLayerIndex === canvasState.layerIds.length - 1) return

  // 3. bring to front
  const removedLayerId = canvasState.layerIds.splice(currentLayerIndex, 1)[0];
  // 将当前图层插入到前一个位置
  canvasState.layerIds.splice(currentLayerIndex + 1, 0, removedLayerId);
}

const handleSendToBack = () => {
  // ids index越往后，渲染越在前面
  // 1. get currentLayerId
  const currentLayerId = canvasState.currentLayerId
  if (!currentLayerId) return // 如果没有选中图层，直接返回
  // 2. get currentLayerIndex
  const currentLayerIndex = canvasState.layerIds.indexOf(currentLayerId)
  if (currentLayerIndex === -1 || currentLayerIndex === 0) return // 如果当前图层不在图层列表中，直接返回

  // 3. bring to front
  const removedLayerId = canvasState.layerIds.splice(currentLayerIndex, 1)[0];
  // 将当前图层插入到前一个位置
  canvasState.layerIds.splice(currentLayerIndex - 1, 0, removedLayerId);
}
</script>

<style scoped></style>
