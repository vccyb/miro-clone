<template>

  <div class="cursor-pointer w-8 h-8 flex items-center justify-center hover:opacity-75 transition"
  @click="handleClick">
    <div class="h-8 w-8 rounded-md border border-neutral-300"
    :style="{
      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
    }"></div>
  </div>

</template>

<script setup lang="ts">

import type { Color } from '@/types/canvas.ts'

interface ColorButtonProps {
  color: Color
}


const emit = defineEmits<{
  'change': [color: Color]
}>()

const props = defineProps<ColorButtonProps>()

const handleClick = () => {
  emit('change', props.color)
}

</script>

<style scoped></style>
