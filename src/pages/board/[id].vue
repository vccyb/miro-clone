<template>
    <div>
        <info />
        <participants />
        <toolbar :canvasState="canvasState" :setCanvasState="setCanvasState" :canRedo="false" :canUndo="false"
            :undo="() => { }" :redo="() => { }" />
    </div>
</template>

<script setup lang="ts">
import info from '@/components/board/info.vue'
import participants from '@/components/board/participants.vue'
import toolbar from '@/components/board/toolbar.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'


import type { CanvasState } from "@/types/canvas"
import { CanvasMode } from "@/types/canvas"
const canvasState = ref<CanvasState>({
    mode: CanvasMode.None
})
const setCanvasState = (state: CanvasState) => {
    canvasState.value = state
}

const route = useRoute()
const id = route.params.id
</script>
