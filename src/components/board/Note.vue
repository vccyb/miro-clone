<template>
  <foreignObject :x="layer.x" :y="layer.y" :width="layer.width" :height="layer.height"
    :style="{ backgroundColor: fill ? colorToCss(fill) : '#eca006' }" @pointerdown="handlePointerDown">
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

const { fill } = props?.layer ?? {}


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