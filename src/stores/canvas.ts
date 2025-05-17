import { computed, ref, toRefs } from 'vue'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import type { Color, Layer, Point, XYWH } from '@/types/canvas'
import { LayerType } from '@/types/canvas'
import { penPointsToPathLayer } from '@/utils/canvasUtil.ts'

type InsertLayerType = LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note

export const useCanvasStore = defineStore('canvas-board', () => {
  const layerIds = ref<string[]>([])

  const setLayerIds = (ids: string[]) => {
    layerIds.value = ids
  }

  const layers = ref<Record<string, any>>({})

  const currentLayerIds = ref<string[] | null>(null)

  const lastUsedColor = ref<Color>({
    r: 0,
    g: 0,
    b: 0,
  })

  const pencilState = ref<any>({
    pencilDraft: [],
    pencilColor: null,
  })

  const setPencilState = (state: any) => {
    pencilState.value = state
  }

  const setLastUsedColor = (color: Color) => {
    lastUsedColor.value = color
  }

  const insertLayer = (layerType: InsertLayerType, position: Point) => {
    const layerId = nanoid()
    layerIds.value.push(layerId)
    const layer = {
      id: layerId,
      type: layerType,
      x: position.x,
      y: position.y,
      width: 120,
      height: 120,
      fill: { ...lastUsedColor.value },
    }
    layers.value[layerId] = layer
  }

  const insertPath = () => {
    const pencilDraft = pencilState.value.pencilDraft
    const pencilColor = pencilState.value.pencilColor
    if (pencilDraft === null || pencilDraft.length < 2) {
      pencilState.value.pencilDraft = null
      return
    }

    const layerId = nanoid()
    layerIds.value.push(layerId)
    const tempLayer = penPointsToPathLayer(pencilDraft, pencilColor)
    layers.value[layerId] = {
      ...tempLayer,
      id: layerId,
    }
    // 插入完就清空
    pencilState.value.pencilDraft = null
  }

  const updateLayerWithBoundsAndId = (layerId: string, bounds: XYWH) => {
    const layer = layers.value[layerId]
    if (!layer) return
    layer.x = bounds.x
    layer.y = bounds.y
    layer.width = bounds.width
    layer.height = bounds.height
  }

  const getLayerById = (layerId: string) => {
    return layers.value[layerId]
  }

  const getCurrentLayers = computed<Layer[] | null>(() => {
    if (!currentLayerIds.value) {
      return null
    }
    return currentLayerIds.value.map((id) => layers.value[id])
  })

  const lastLayer = computed<Layer | null>(() => {
    if (layerIds.value.length === 0) return null
    const lastId = layerIds.value[layerIds.value.length - 1]
    return layers.value[lastId] || null
  })

  const setCurrentLayerIds = (layerIds: string[] | null) => {
    if (!layerIds) {
      currentLayerIds.value = null
      return
    }
    currentLayerIds.value = [...layerIds]
  }

  const updateLayerWithOffsetAndId = (layerId: string, offset: Point) => {
    const layer = layers.value[layerId]
    if (!layer) return
    // 加上相对位置
    layer.x += offset.x
    layer.y += offset.y
  }

  const updateLayerWithColorAndId = (ids: string[], color: Color) => {
    for (const layerId of ids) {
      const layer = layers.value[layerId]
      if (!layer) continue
      layer.fill.r = color.r
      layer.fill.g = color.g
      layer.fill.b = color.b
    }
  }

  const updateLayerWithValueAndId = (layerId: string, value: string) => {
    const layer = layers.value[layerId]
    if (!layer) return
    layer.value = value
  }

  const deleteCurrentLayer = () => {
    if (!currentLayerIds.value) return
    for (const id of currentLayerIds.value) {
      const index = layerIds.value.indexOf(id)
      if (index === -1) return
      // delete layerIds
      layerIds.value.splice(index, 1)
      // delete layers
      delete layers.value[id]
      currentLayerIds.value = null
    }
  }

  return {
    layerIds,
    setLayerIds,
    layers,
    insertLayer,
    insertPath,
    getLayerById,
    lastLayer,
    currentLayerIds,
    getCurrentLayers,
    lastUsedColor,
    setLastUsedColor,
    setCurrentLayerIds,
    updateLayerWithBoundsAndId,
    updateLayerWithOffsetAndId,
    updateLayerWithColorAndId,
    updateLayerWithValueAndId,
    deleteCurrentLayer,
    pencilState,
    setPencilState,
  }
})
