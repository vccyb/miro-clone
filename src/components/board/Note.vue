<template>
  <foreignObject :x="x" :y="y" :width="width" :height="height"
    :style="{ backgroundColor: fill ? colorToCss(fill) : '#eca006' }">
    <contenteditable
      :style="{ width: '100%', height: '100%', color: '#000', fontSize: '16px', padding: '10px', overflow: 'hidden' }">
      123456
    </contenteditable>
  </foreignObject>
</template>

<script setup lang="ts">

import { NoteLayer } from "@/types/canvas.ts";
import { colorToCss } from "@/utils/canvasUtil.ts";

interface NoteProps {
  id?: string
  layer?: NoteLayer
  onPointerDown?: (e: any, id: string) => void
  selectionColor?: string;
}

const props = defineProps<NoteProps>()

const { x = 0, y = 0, width = 100, height = 100, fill } = props?.layer ?? {}


</script>

<style scoped></style>