<template>
  <div
    v-if="currentLayerIds"
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
import { type Camera, type Color, type XYWH } from '@/types/canvas.ts'
import { boundingBox } from '@/hook/useSelectionBounds.ts'

// props
interface SelectedToolsProps {
  camera: Camera
}

const props = defineProps<SelectedToolsProps>()

const canvasStore = useCanvasStore()




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

const x = computed(() => {
  if(!bounds.value) return 0
  return bounds.value?.x + bounds.value?.width / 2 + props.camera.x
})

const y = computed(() => {
  if(!bounds.value) return 0
  return bounds.value?.y + props.camera.y
})

const transformStyle = computed(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value - 16}px - 100%))`,
}))

// color
const handleColorChange = (color: Color) => {
  // 1. update current layer's color
  const currentLayerIds = canvasStore.currentLayerIds
  if (currentLayerIds) {
    console.log(Date.now(), "currentLayerIds", currentLayerIds)
    canvasStore.updateLayerWithColorAndId(currentLayerIds, color)
  }
  // 2. update last used color
  canvasStore.setLastUsedColor(color)
}


// delete
const handleDelete = () => {
  const currentLayerIds = canvasStore.currentLayerIds
  if (currentLayerIds) {
    canvasStore.deleteCurrentLayer()
  }
}



// to back or to front
const handleBringToFront = () => {
  // ids index越往后，渲染越在前面
  // 1. get currentLayerId
  const currentLayerIds = canvasStore.currentLayerIds
  if (!currentLayerIds ) return // 如果没有选中图层，直接返回
 // 移动到数组的最后面，且current的内的保持顺序
  const newLayerIds = [...canvasStore.layerIds.filter(id => !currentLayerIds.includes(id)),...currentLayerIds];
  canvasStore.setLayerIds(newLayerIds);
}

const handleSendToBack = () => {
  // ids index越往后，渲染越在前面
  // 1. get currentLayerId
  const currentLayerIds = canvasStore.currentLayerIds
  if (!currentLayerIds) return // 如果没有选中图层，直接返回
  const newLayerIds = [...currentLayerIds, ...canvasStore.layerIds.filter(id => !currentLayerIds.includes(id))];
  canvasStore.setLayerIds(newLayerIds);
}
</script>

<style scoped></style>
