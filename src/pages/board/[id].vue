<template>
    <div>
        <info />
        <participants />
        <toolbar :canvasState="canvasState" :setCanvasState="setCanvasState" :canRedo="false" :canUndo="false"
            :undo="() => { }" :redo="() => { }" />
        <svg class="h-[100vh] w-[100vw]" @wheel="handleWheel" @pointerdown="onPointerDown" @pointerup="onPointertUp">
            <g :style="{ transform: `translate(${camera.x}px,${camera.y}px)` }">
                <layer-preview v-for="id of layerIds" :key="id" :id="id"
                    @layerPointerDown="handleLayerPointerDown"></layer-preview>
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
import { LayerType, CanvasMode } from "@/types/canvas"


import { useCanvasStore } from '@/stores/canvas.ts'
const canvasStore = useCanvasStore()

// get layerIds from canvasStore
const layerIds = canvasStore.layerIds



const canvasState = ref<CanvasState>({
    mode: CanvasMode.None
})
const setCanvasState = (state: CanvasState) => {
    canvasState.value = state
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



/** on Poniter up */
const onPointertUp = (event: MouseEvent) => {
    // point 是相对于 camera的
    const point = pointEventTocavansPoint(event, camera.value)
    if (canvasState.value.mode === CanvasMode.Inserting) {
        canvasStore.insertLayer(canvasState.value.layerType, point)
    } else {
        setCanvasState({ mode: CanvasMode.None })
    }
}

/** on Pointer down */
const onPointerDown = (event: MouseEvent) => {
    const point = pointEventTocavansPoint(event, camera.value)
    if (canvasState.value.mode === CanvasMode.Inserting) {
        return;
    }

    if (canvasState.value.mode === CanvasMode.Pencil) {
        //TODO
    }

}


/**
 * * handle layer pointer down
 */
const handleLayerPointerDown = (event: PointEvent, layerId: string) => {
    // console.log("canvas[id] layerPointerDown", event, layerId);
    if (canvasState.value.mode === CanvasMode.Inserting) {
        return;
    }

    if (canvasState.value.mode === CanvasMode.Pencil) {
        return
    }

    const point = pointEventTocavansPoint(event, camera.value)

    setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
    })



}
</script>
