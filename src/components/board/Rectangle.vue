<template>
  <rect :style="{ transform: `translate(${x}px, ${y}px)` }" :x="0" :y="0" :width="width" :height="height"
    :stroke-width="1" :fill="fill ? colorToCss(fill) : '#000'" @pointerdown="handlePointerDown">

  </rect>
</template>

<script setup lang="ts">
import { RectangleLayer } from "@/types/canvas.ts"
import { colorToCss } from "@/utils/canvasUtil.ts";
interface RectangleProps {
  id?: string
  layer?: ReactangleLayer
  onPointerDown?: (e: any, id: string) => void
  selectionColor?: string;
}

const props = defineProps<RectangleProps>()

const { x = 0, y = 0, width = 100, height = 100, fill } = props?.layer ?? {}


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