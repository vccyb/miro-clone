<template>
  <path
    :style="{ transform: `translate(${x}px, ${y}px)` }"
    :x="0"
    :y="0"
    :fill="fill"
    :strokeWidth="1"
    :stroke="stroke"
    :d="path"
  >
  </path>
</template>

<script setup lang="ts">
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from '@/utils/canvasUtil.ts'
import { colorToCss } from '@/utils/canvasUtil.ts'
import { computed } from 'vue'
interface PathProps {
  x: number
  y: number
  id: string
  points: number[][]
  fill: string
  stroke?: string
}

const props = defineProps<PathProps>()

const path = computed(() => {
  return getSvgPathFromStroke(
    getStroke(props.points, {
      size: 16,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    }),
  )
})
</script>

<style scoped></style>
