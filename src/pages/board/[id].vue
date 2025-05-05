<template>
    <div>
        <info />
        <participants />
        <toolbar :canvasState="canvasState" :setCanvasState="setCanvasState" :canRedo="false" :canUndo="false"
            :undo="() => { }" :redo="() => { }" />
        <svg class="h-[100vh] w-[100vw]" @wheel="handleWheel">
            <g :style="{ transform: `translate(${camera.x}px,${camera.y}px)` }">
                <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
                <layer-preview :id="testId"></layer-preview>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import info from '@/components/board/info.vue'
import participants from '@/components/board/participants.vue'
import toolbar from '@/components/board/toolbar.vue'
import layerPreview from '@/components/board/layerPreview.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

import { pointEventTocavansPoint } from '@/utils/canvasUtil'


import type { CanvasState, Camera } from "@/types/canvas"
import { LayerType } from "@/types/canvas"

import { CanvasMode } from "@/types/canvas"
const canvasState = ref<CanvasState>({
    mode: CanvasMode.None
})
const setCanvasState = (state: CanvasState) => {
    canvasState.value = state
}

const route = useRoute()
const id = route.params.id


const testId = ref<string>("123456")

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



/** on Poniter uo */
const onPointertUp = (event: MouseEvent) => {
    // point 是相对于 camera的
    const point = pointEventTocavansPoint(event, camera.value)
    if (canvasState.value.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.value.layerType, point)
    } else {
        setCanvasState({ mode: CanvasMode.None })
    }
}
</script>
