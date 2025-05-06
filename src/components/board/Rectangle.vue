<template>
  <rect :style="{ transform: `translate(${x}px, ${y}px)` }" :x="0" :y="0" :width="width" :height="height"
    :stroke-width="1" fill="#000">

  </rect>
</template>

<script setup lang="ts">
import { RectangleLayer } from "@/types/canvas.ts"
interface RectangleProps {
  id?: string
  layer?: ReactangleLayer
  onPointerDown?: (e: any, id: string) => void
  selectionColor?: string;
}

const props = defineProps<RectangleProps>()

const { x = 0, y = 0, width = 100, height = 100, fill } = props?.layer ?? {}

debugger


</script>

<style scoped></style>