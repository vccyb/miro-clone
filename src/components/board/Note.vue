<template>
  <foreignObject
    :x="layer.x"
    :y="layer.y"
    :width="layer.width"
    :height="layer.height"
    :style="{ backgroundColor: fill ? colorToCss(fill) : '#eca006' }"
    @pointerdown="handlePointerDown"
    class="shadow-md drop-shadow-xl"
  >
    <div
      :style="{
        width: '100%',
        height: '100%',
        color: '#000',
        fontSize: '16px',
        padding: '10px',
        overflow: 'hidden',
      }"
    >
      123456
    </div>
  </foreignObject>
</template>

<script setup lang="ts">
import { NoteLayer } from '@/types/canvas.ts'
import { colorToCss } from '@/utils/canvasUtil.ts'

interface NoteProps {
  id: string
  layer: NoteLayer
}

const props = defineProps<NoteProps>()

const { fill } = props?.layer ?? {}

const emit = defineEmits<{
  (e: 'layerPointerDown', id: string): void
}>()

// pointer Down event
const handlePointerDown = (event: PointerEvent) => {
  // console.log("Rectangle layerPointerDown", event, props.id);
  emit('layerPointerDown', event, props.id)
}
</script>

<style scoped></style>
