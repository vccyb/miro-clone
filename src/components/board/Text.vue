<template>
  <foreignObject :x="layer.x" :y="layer.y" :width="layer.width" :height="layer.height" @pointerdown="handlePointerDown">
    <div @wheel.stop="() => { }" class="h-full w-full" :style="{
    overflow: 'hidden'
  }">
      <textarea v-model="textContent"  :readonly="!editFlag" @blur="handleBlur" class="text-area h-full w-full kalam-font" :style="{
    fontSize: `${calculateFontSize(layer.width, layer.height)}px`,
    color: layer.fill ? colorToCss(layer.fill) : '#000',
  }"></textarea>
    </div>
  </foreignObject>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { CanvasMode, type TextLayer } from '@/types/canvas.ts'
import { colorToCss } from '@/utils/canvasUtil.ts'
import { useCanvasStore } from '@/stores/canvas.ts'

const canvasStore = useCanvasStore()
interface TextProps {
  id: string
  layer: TextLayer
}

const props = defineProps<TextProps>()

const editFlag = ref(false)
// 使用本地状态管理文本内容
const textContent = ref(props.layer.value || 'text')

// 监听 textContent 变化，同步到 layer
watch(textContent, (newValue) => {
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
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBaseOnHeight = height * scaleFactor;
  const fontSizeBaseOnWidth = width * scaleFactor;

  return Math.min(maxFontSize, fontSizeBaseOnHeight, fontSizeBaseOnWidth);
};
</script>

<style scoped>
.text-area {
  background-color: transparent;
  border: none;
  outline: none;
  resize: none;
  text-align: center;
  padding: 10px;
  font-family: 'Kalam', cursive, sans-serif;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 隐藏滚动条 */
.text-area::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

/* 隐藏调整手柄 */
.text-area::-webkit-resizer {
  display: none;
}
</style>
