<template>
  <ellipse
    class="drop-shadow-md"
    :style="{ transform: `translate(${layer.x}px, ${layer.y}px)` }"
    :cx="layer.width / 2"
    :cy="layer.height / 2"
    :rx="layer.width / 2"
    :ry="layer.height / 2"
    :fill="fill ? colorToCss(fill) : '#000'"
    :stroke-width="1"
    @pointerdown="handlePointerDown"
  >
  </ellipse>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EllipaseLayer } from '@/types/canvas.ts'
import { colorToCss } from '@/utils/canvasUtil.ts'

interface EllipseProps {
  id?: string
  layer: EllipaseLayer
  selectionColor?: string
}
const props = defineProps<EllipseProps>()

const fill = computed(() => {
  return props.layer?.fill
})

const emit = defineEmits<{
  (e: 'layerPointerDown', event: PointerEvent, id: string): void
}>()

// pointer Down event
const handlePointerDown = (event: PointerEvent) => {
  // console.log("Rectangle layerPointerDown", event, props.id);
  emit('layerPointerDown', event, props.id)
}
</script>

<style scoped></style>
