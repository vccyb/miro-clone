<template>
    <div>
        <info />
        <participants />
        <toolbar :canvasState="canvasState" :setCanvasState="setCanvasState" :canRedo="false" :canUndo="false"
            :undo="() => { }" :redo="() => { }" />
        <svg class="h-[100vh] w-[100vw]" @wheel="handleWheel" @pointerdown="onPointerDown" @pointerup="onPointertUp"
            @pointermove="onPointerMove">
            <g :style="{ transform: `translate(${camera.x}px,${camera.y}px)` }">
                <layer-preview v-for="id of layerIds" :key="id" :id="id"
                    @layerPointerDown="handleLayerPointerDown"></layer-preview>
                <selection-box @resizeHandlePointerDown="handleResizeHandlePointerDown"></selection-box>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import Info from '@/components/board/Info.vue'
import Participants from '@/components/board/Participants.vue'
import Toolbar from '@/components/board/Toolbar.vue'
import LayerPreview from '@/components/board/LayerPreview.vue'
import SelectionBox from "@/components/board/SelectionBox.vue"
import { useRoute } from 'vue-router'
import { ref, provide, watch } from 'vue'

import { pointEventTocavansPoint, resizeBounds } from '@/utils/canvasUtil'
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
    if (state.mode === CanvasMode.Inserting || state.mode === CanvasMode.Pencil) {
        canvasStore.setCurrentLayerId(null)
    }
    canvasState.value = state
}

provide('canvasState', canvasState)


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


const unSelectLayers = () => {
    canvasStore.setCurrentLayerId(null)
}


/** on Poniter up */
const onPointertUp = (event: MouseEvent) => {
    // point 是相对于 camera的
    const point = pointEventTocavansPoint(event, camera.value)
    if (canvasState.value.mode === CanvasMode.None) {
        unSelectLayers()
        setCanvasState({ mode: CanvasMode.None })
    }
    else if (canvasState.value.mode === CanvasMode.Pencil) {
        return //TODO
    }
    else if (canvasState.value.mode === CanvasMode.Inserting) {
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

    event.stopPropagation()
    const point = pointEventTocavansPoint(event, camera.value)

    // update current layerid
    canvasStore.setCurrentLayerId(layerId)
    setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
    })

}

watch(canvasState, (newState, oldState) => {
    debugger
    console.log(newState, oldState);
}, { deep: true })




/** resize handle */
const handleResizeHandlePointerDown = (corner: Side, initialBounds: XYWH) => {
    console.log("canvas[id] handleResizeHandlePointerDown", corner, initialBounds);

    // update state to resizing
    setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
    })
}


const onPointerMove = (event: MouseEvent) => {
    event.preventDefault()
    const currentPoint = pointEventTocavansPoint(event, camera.value)

    if (canvasState.value.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(currentPoint)
    }

}



const resizeSelectedLayer = (point: Point) => {
    if (canvasState.value.mode !== CanvasMode.Resizing) {
        return
    }

    const bounds = resizeBounds(
        canvasState.value.initialBounds,
        canvasState.value.corner,
        point
    )
    canvasStore.updateLayerWithBoundsAndId(canvasStore.currentLayerId, bounds)
}
</script>
