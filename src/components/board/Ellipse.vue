<template>
  <ellipse class="" :style="{ transform: `translate(${x}px, ${y}px)` }" :cx="width / 2" :cy="height / 2" :rx="width / 2"
    :ry="height / 2" :fill="fill ? colorToCss(fill) : '#000'" :stroke-width="1" @pointerdown="handlePointerDown">

  </ellipse>
</template>

<script setup lang="ts">
import { EllipaseLayer } from "@/types/canvas.ts";
import { colorToCss } from "@/utils/canvasUtil.ts";

interface EllipseProps {
  id?: string
  layer?: EllipaseLayer
  selectionColor?: string;
}
const props = defineProps<EllipseProps>()

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