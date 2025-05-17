<template>
  <div>
    <info />
    <participants />
    <toolbar
      :canvasState="canvasState"
      :setCanvasState="setCanvasState"
      :canRedo="false"
      :canUndo="false"
      :undo="() => {}"
      :redo="() => {}"
    />
    <selected-tools :camera="camera" @setLastUsedColor="() => {}"></selected-tools>
    <svg
      class="h-[100vh] w-[100vw]"
      @wheel="handleWheel"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointermove="onPointerMove"
    >
      <g :style="{ transform: `translate(${camera.x}px,${camera.y}px)` }">
        <layer-preview
          v-for="id of layerIds"
          :key="id"
          :id="id"
          @layerPointerDown="handleLayerPointerDown"
        ></layer-preview>

        <selection-box @resizeHandlePointerDown="handleResizeHandlePointerDown"></selection-box>
        <MultiSelect
          v-if="canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null"
          :origin="canvasState.origin"
          :current="canvasState.current"
        />
        <PathDraft
          v-if="pencilState.pencilDraft !== null"
          :points="pencilState.pencilDraft"
          :fill="colorToCss(canvasStore.lastUsedColor)"
          :x="0"
          :y="0"
        ></PathDraft>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
// 内部组件
import Info from '@/components/board/Info.vue'
import Participants from '@/components/board/Participants.vue'
import Toolbar from '@/components/board/Toolbar.vue'
import LayerPreview from '@/components/board/LayerPreview.vue'
import SelectionBox from '@/components/board/SelectionBox.vue'
import SelectedTools from '@/components/board/SelectedTools.vue'
import MultiSelect from '@/components/board/MultiSelect.vue'
import PathDraft from '@/components/board/PathDraft.vue'
// vue
import { useRoute } from 'vue-router'
import { ref, provide, watch } from 'vue'

// 内部方法
import {
  colorToCss,
  findIntersectingLayerWithRectangle,
  pointEventTocavansPoint,
  resizeBounds,
} from '@/utils/canvasUtil'

// 类型
import { type CanvasState, type Camera, type Point, Side, type XYWH } from '@/types/canvas'
import { CanvasMode } from '@/types/canvas'

import { computed } from 'vue'

// store
import { useCanvasStore } from '@/stores/canvas.ts'

const canvasStore = useCanvasStore()

// get layerIds from canvasStore
const layerIds = computed(() => {
  return canvasStore.layerIds
})
const canvasState = ref<CanvasState>({
  mode: CanvasMode.None,
})

const pencilState = computed(() => canvasStore.pencilState)

const setCanvasState = (state: CanvasState) => {
  if (state.mode === CanvasMode.Inserting || state.mode === CanvasMode.Pencil) {
    canvasStore.setCurrentLayerIds(null)
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
  canvasStore.setCurrentLayerIds(null)
}

const startDrawing = (point: Point, pressure: number) => {
  canvasStore.setPencilState({
    pencilDraft: [[point.x, point.y, pressure]],
    pencilColor: Object.assign({}, canvasStore.lastUsedColor),
  })
}

const continueDrawing = (point: Point, event: MouseEvent) => {
  if (canvasState.value.mode !== CanvasMode.Pencil) {
    return
  }
  const pencilState = canvasStore.pencilState
  const { pencilDraft } = pencilState
  if (pencilDraft === null || pencilDraft.length === 0) {
    return
  }
  const newState = {
    ...pencilState,
    pencilDraft:
      pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
        ? pencilDraft
        : [...pencilDraft, [point.x, point.y, event.pressure]],
  }
  canvasStore.setPencilState(newState)
}

/** on Poniter up */
const onPointerUp = (event: MouseEvent) => {
  // point 是相对于 camera的
  const point = pointEventTocavansPoint(event, camera.value)
  if (
    canvasState.value.mode === CanvasMode.None ||
    canvasState.value.mode === CanvasMode.Pressing
  ) {
    unSelectLayers()
    setCanvasState({ mode: CanvasMode.None })
  } else if (canvasState.value.mode === CanvasMode.Pencil) {
    canvasStore.insertPath()
    setCanvasState({ mode: CanvasMode.Pencil })
  } else if (canvasState.value.mode === CanvasMode.Inserting) {
    canvasStore.insertLayer(canvasState.value.layerType, point)
  } else {
    // default up set mode to none
    setCanvasState({ mode: CanvasMode.None })
  }
}

/** on Pointer down */
const onPointerDown = (event: MouseEvent) => {
  const point = pointEventTocavansPoint(event, camera.value)
  if (canvasState.value.mode === CanvasMode.Inserting) {
    return
  }

  if (canvasState.value.mode === CanvasMode.Pencil) {
    startDrawing(point, event.pressure)
    return
  }

  setCanvasState({
    mode: CanvasMode.Pressing,
    origin: point,
  })
}

/**
 * * handle layer pointer down
 */
const handleLayerPointerDown = (event: PointerEvent, layerId: string) => {
  // console.log("canvas[id] layerPointerDown", event, layerId);
  if (canvasState.value.mode === CanvasMode.Inserting) {
    return
  }

  if (canvasState.value.mode === CanvasMode.Pencil) {
    return
  }

  event.stopPropagation()
  const point = pointEventTocavansPoint(event, camera.value)

  // update current layerId
  const currentLayerIds = canvasStore.currentLayerIds
  if (currentLayerIds === null || !currentLayerIds.includes(layerId)) {
    // 说明是单选
    canvasStore.setCurrentLayerIds([layerId])
  }
  // set mode to translating, and set current point
  setCanvasState({
    mode: CanvasMode.Translating,
    current: point,
  })
}

watch(
  canvasState,
  (newState, oldState) => {
    // console.log('canvasState changed', newState, oldState);
  },
  { deep: true },
)

/** resize handle */
const handleResizeHandlePointerDown = (corner: Side, initialBounds: XYWH) => {
  // console.log("canvas[id] handleResizeHandlePointerDown", corner, initialBounds);

  // update state to resizing
  setCanvasState({
    mode: CanvasMode.Resizing,
    initialBounds,
    corner,
  })
}

const onPointerMove = (event: MouseEvent) => {
  event.preventDefault()
  // get currentPoint with camera
  // point 是相对于 camera的
  const currentPoint = pointEventTocavansPoint(event, camera.value)

  if (canvasState.value.mode === CanvasMode.Resizing) {
    // console.log("this is resizing and we are moving");

    resizeSelectedLayer(currentPoint)
  }

  if (canvasState.value.mode === CanvasMode.Pressing) {
    // 当你按压的时候，且移动你的鼠标，超过门限制，我们进行设置为 multi select
    startMultiSelect(currentPoint, canvasState.value.origin)
  }

  if (canvasState.value.mode === CanvasMode.SelectionNet) {
    updateSelectionNet(currentPoint, canvasState.value.origin)
  }

  // mode translating
  if (canvasState.value.mode === CanvasMode.Translating) {
    // console.log("this is translating and we are moving");

    translateSelectedLayer(currentPoint)
  }

  if (canvasState.value.mode === CanvasMode.Pencil) {
    continueDrawing(currentPoint, event)
  }
}

// resize selected layer
const resizeSelectedLayer = (point: Point) => {
  if (canvasState.value.mode !== CanvasMode.Resizing) {
    return
  }

  const bounds = resizeBounds(canvasState.value.initialBounds, canvasState.value.corner, point)
  const currentLayerIds = canvasStore.currentLayerIds
  if (!currentLayerIds || currentLayerIds.length > 1) return
  canvasStore.updateLayerWithBoundsAndId(currentLayerIds[0], bounds)
}

// translate selected layer
const translateSelectedLayer = (point: Point) => {
  // if not translating, return
  if (canvasState.value.mode !== CanvasMode.Translating) {
    return
  }

  // calculate offset  计算 鼠标移动相对于当前的偏移
  const offset = {
    x: point.x - canvasState.value.current.x,
    y: point.y - canvasState.value.current.y,
  }
  // update current point

  const currentLayerIds = canvasStore.currentLayerIds
  if (!currentLayerIds) return
  for (const id of currentLayerIds) {
    canvasStore.updateLayerWithOffsetAndId(id, offset)
  }

  // set canvas state, 这里是继续设置为 translating，后面才能持续的move
  setCanvasState({
    mode: CanvasMode.Translating,
    current: point,
  })
}

// multi select
const startMultiSelect = (current: Point, origin: Point) => {
  if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) < 5) {
    setCanvasState({
      mode: CanvasMode.SelectionNet,
      origin,
      current,
    })
  }
}

const updateSelectionNet = (current: Point, origin: Point) => {
  setCanvasState({
    mode: CanvasMode.SelectionNet,
    origin,
    current,
  })

  const ids = findIntersectingLayerWithRectangle(
    canvasStore.layerIds,
    canvasStore.layers,
    canvasState.value.origin,
    canvasState.value.current,
  )

  canvasStore.setCurrentLayerIds(ids)
}
</script>
