<template>
  <path
    @pointerdown="handlePointerDown"
    :style="{ transform: `translate(${layer.x}px, ${layer.y}px)` }"
    :x="0"
    :y="0"
    :fill="layer.fill ? colorToCss(layer.fill) : '#000'"
    :strokeWidth="1"
    :d="path"
  >
  </path>
</template>

<script setup lang="ts">
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from '@/utils/canvasUtil.ts'
import { colorToCss } from '@/utils/canvasUtil.ts'
import type { PathLayer } from '@/types/canvas.ts'
import { computed } from 'vue'
interface PathProps {
  id: string
  layer: PathLayer
}

const props = defineProps<PathProps>()

const layer = computed(() => props.layer)
const path = computed(() => {
  return getSvgPathFromStroke(
    getStroke(layer.value.points, {
      size: 16,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    }),
  )
})


const emit = defineEmits<{
  (e: 'layerPointerDown', id: string): void
}>()

// pointer Down event
const handlePointerDown = (event: PointEvent) => {
  // console.log("Rectangle layerPointerDown", event, props.id);
  emit('layerPointerDown', event, props.id)
}
</script>

<style scoped></style>
