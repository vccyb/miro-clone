<template>
  <foreignObject :x="layer.x" :y="layer.y" :width="layer.width" :height="layer.height"
                 @pointerdown="handlePointerDown"  >
    <div
      ref="editableDiv"
      :contenteditable="editFlag"
      :focus="editFlag"
      class="h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none bg-transparent"
      :style="{
        color: layer.fill ? colorToCss(layer.fill) : '#000',
        fontSize: `${calculateFontSize(layer.width, layer.height)}px`,
       }"
      @input="handleContentChange"
      @blur="editFlag = false"
    >
      {{ layer.value || "text"}}
    </div>
  </foreignObject>
</template>

<script setup lang="ts">
import { ref, watch, nextTick , inject} from 'vue'
import { CanvasMode, type TextLayer } from '@/types/canvas.ts'
import { colorToCss } from '@/utils/canvasUtil.ts'

import { useCanvasStore } from '@/stores/canvas.ts'
const canvasStore = useCanvasStore()

interface TextProps {
  id: string
  layer: TextLayer
}

const editFlag = ref(false)
const editableDiv = ref<HTMLElement | null>(null)

const props = defineProps<TextProps>()


const emit = defineEmits<{
  (e: 'layerPointerDown', id: string): void
}>()

const canvasState = inject('canvasState', canvasStore)





const handlePointerDown = (event: PointerEvent) => {
  if(canvasState.value.mode === CanvasMode.None) {
    editFlag.value = true
  }
  // console.log("Rectangle layerPointerDown", event, props.id);
  emit('layerPointerDown', event, props.id)
}

const handleContentChange = (event: Event) => {
  const target = event.target as HTMLElement
  const newValue = target.innerText
  const currentLayer = canvasStore.getLayerById(props.id)
  if (currentLayer) {
    canvasStore.updateLayerWithValueAndId(props.id, newValue)
  }
}


const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBaseOnHeight = height * scaleFactor;
  const fontSizeBaseOnWidth = width * scaleFactor;

  return Math.min(maxFontSize, fontSizeBaseOnHeight, fontSizeBaseOnWidth);
};



</script>

<style scoped></style>
