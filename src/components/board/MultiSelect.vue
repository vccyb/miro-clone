<template>
  <rect class="fill-blue-500/5 stroke-blue-50 stroke-1"
  :x="x"
  :y="y"
  :width="width"
  :height="height"
  ></rect>
</template>

<script setup lang="ts">
import { computed } from "vue"

import type { Point } from '@/types/canvas.ts'

interface MultiSelectProps {
  origin: Point;
  current: Point
}

const props =  defineProps<MultiSelectProps>()

const x = computed(() => {
  return Math.min(props.origin.x, props.current.x)
})

const y = computed(() => {
  return Math.min(props.origin.y, props.current.y)
})

const width = computed(() => {
  return Math.abs(props.origin.x - props.current.x)
})

const height = computed(() => {
  return Math.abs(props.origin.y - props.current.y)
})

</script>

<style scoped>

</style>
