<template>
  <foreignObject :x="layer.x" :y="layer.y" :width="layer.width" :height="layer.height"
    :style="{ backgroundColor: fill ? colorToCss(fill) : '#fff9b1' }" @pointerdown="handlePointerDown"
    class="shadow-md drop-shadow-xl">
    <div @wheel.stop="() => { }" class="kalam-font h-full w-full" :style="{
    color: `${fill ? getConstrastingTextColor(fill) : '#000'}`,
    fontSize: `${calculateFontSize(layer.width, layer.height)}px`,
    overflow: 'hidden'
  }">
      <n-input :style="{
    backgroundColor: layer.fill ? colorToCss(layer.fill) : '#fff9b1',
    fontSize: `${calculateFontSize(layer.width, layer.height)}px`,
  }" v-model:value="noteContent" type="textarea" :autosize="false" :readonly="!editFlag" @blur="handleBlur"
        class="note-textarea h-full w-full" />
    </div>
  </foreignObject>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { CanvasMode, NoteLayer } from '@/types/canvas.ts'
import { colorToCss, getConstrastingTextColor } from '@/utils/canvasUtil.ts'
import { useCanvasStore } from '@/stores/canvas.ts'
import { NInput } from 'naive-ui'

const canvasStore = useCanvasStore()
interface NoteProps {
  id: string
  layer: NoteLayer
}

const props = defineProps<NoteProps>()

const { fill } = props?.layer ?? {}

const editFlag = ref(false)
// 使用本地状态管理文本内容
const noteContent = ref(props.layer.value || '')

// 监听 noteContent 变化，同步到 layer
watch(noteContent, (newValue) => {
  canvasStore.updateLayerWithValueAndId(props.id, newValue)
})

const emit = defineEmits<{
  (e: 'layerPointerDown', id: string, event: PointerEvent): void
}>()

const canvasState = inject('canvasState', canvasStore)

// pointer Down event
const handlePointerDown = (event: PointerEvent) => {
  if (canvasState.value.mode === CanvasMode.None) {
    editFlag.value = true
  }
  emit('layerPointerDown', event, props.id)
}

const handleBlur = () => {
  editFlag.value = false
}

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96
  const scaleFactor = 0.15
  const fontSizeBaseOnHeight = height * scaleFactor
  const fontSizeBaseOnWidth = width * scaleFactor

  return Math.min(maxFontSize, fontSizeBaseOnHeight, fontSizeBaseOnWidth)
}
</script>

<style scoped>
.note-textarea {
  height: 100%;
  width: 100%;
}

.note-textarea :deep(.n-input__textarea) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  font-family: 'Kalam', cursive, sans-serif;
  height: 100% !important;
  width: 100% !important;
}

.note-textarea :deep(.n-input__placeholder) {
  left: 10px!important;
}
.note-textarea :deep(.n-input__textarea-el) {
  background-color: transparent !important;
  color: inherit !important;
  font-size: inherit !important;
  height: 100% !important;
  width: 100% !important;
  padding: 10px !important;
  resize: none !important;
}

.note-textarea :deep(.n-input-wrapper) {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  height: 100% !important;
  width: 100% !important;
}

.note-textarea :deep(.n-input) {
  height: 100% !important;
  width: 100% !important;
}

/* 移除 hover 特效 */
.note-textarea :deep(.n-input:hover .n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
}

.note-textarea :deep(.n-input:hover) {
  background-color: transparent !important;
}

.note-textarea :deep(.n-input:focus) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.note-textarea :deep(.n-input__state-border) {
  display: none !important;
}
</style>
