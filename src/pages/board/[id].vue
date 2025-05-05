<template>
    <div>
        <info />
        <participants />
        <toolbar :canvasState="canvasState" :setCanvasState="setCanvasState" :canRedo="false" :canUndo="false"
            :undo="() => { }" :redo="() => { }" />
        <svg class="h-[100vh] w-[100vw]" @wheel="handleWheel">
            <g :style="{ transform: `translate(${camera.x}px,${camera.y}px)` }">
                <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import info from '@/components/board/info.vue'
import participants from '@/components/board/participants.vue'
import toolbar from '@/components/board/toolbar.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'


import type { CanvasState, Camera } from "@/types/canvas"
import { CanvasMode } from "@/types/canvas"
const canvasState = ref<CanvasState>({
    mode: CanvasMode.None
})
const setCanvasState = (state: CanvasState) => {

}

const route = useRoute()
const id = route.params.id



/** camera */

const camera = ref<Camera>({
    x: 0,
    y: 0,
})

const setCamera = (newCamera: Camera) => {
    camera.value = newCamera
}

const handleWheel = (event: WheelEvent) => {
    const newCamera = {
        x: camera.value.x - event.deltaX,
        y: camera.value.y - event.deltaY,
    }
    setCamera(newCamera)
}
</script>
