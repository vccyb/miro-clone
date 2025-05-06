<template>
  <path :style="transform: `translate(${x}px, ${y}px)`" :d="getSvgPathFromStroke()" :x="0" :y="0">

  </path>
</template>

<script setup lang="ts">
import { getSvgPathFromStroke } from "@/utils/canvasUtil.ts"


interface PathProps {
  x: number
  y: number
  points: number[][]
  fill: string
  onPointerDown?: (e) => void
  stroke: string
}

defineProps<PathProps>();
</script>

<style scoped></style>