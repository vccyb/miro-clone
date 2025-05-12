<template>
  <div
    v-if="currentLayer"
    class="absolute p-3 rounded-xl bg-white shadow-sm flex select-none"
    :style="transformStyle"
  >
    <ColorPicker @change="handleColorChange"></ColorPicker>
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
</script>

<style scoped></style>
