<template>
  <div class="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
    <ColorButton
      v-for="item of colorList"
      :color="{ r: item.r, g: item.g, b: item.b }"
      @change="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import ColorButton from '@/components/board/ColorButton.vue'
import { ref } from 'vue'
import type { Color } from '@/types/canvas.ts'

const emit = defineEmits<{
  change: [color: Color]
}>()

const handleClick = (color: Color) => {
  emit('change', color)
}

const colorList = ref<Color[]>([
  {
    r: 243,
    g: 82,
    b: 95,
  },
  {
    r: 255,
    g: 249,
    b: 177,
  },
  {
    r: 68,
    g: 202,
    b: 99,
  },
  {
    r: 30,
    g: 182,
    b: 235,
  },
  {
    r: 143,
    g: 102,
    b: 245,
  },
  {
    r: 253,
    g: 142,
    b: 42,
  },
  {
    r: 255,
    g: 255,
    b: 255,
  },
  {
    r: 0,
    g: 0,
    b: 0,
  }
])
</script>

<style scoped></style>
