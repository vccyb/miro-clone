import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import type { Point, Color, Layer, XYWH } from '@/types/canvas'
import { LayerType } from '@/types/canvas'
type InsertLayerType = LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note

export const useCanvasStore = defineStore('canvas-board', () => {
  const layerIds = ref<string[]>([])

  const setLayerIds = (ids: string[]) => {
    layerIds.value = ids
  }

  const layers = ref<Record<string, any>>({})

  const currentLayerId = ref<string | null>(null)

  const lastUsedColor = ref<Color>({
    r: 255,
    g: 255,
    b: 0,
  })

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
      width: 100,
      height: 100,
      fill: {...lastUsedColor.value},
    }
    layers.value[layerId] = layer
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

  const getCurrentLayer = computed<Layer | null>(() => {
    return currentLayerId.value ? layers.value[currentLayerId.value] : null
  })

  const lastLayer = computed<Layer | null>(() => {
    if (layerIds.value.length === 0) return null
    const lastId = layerIds.value[layerIds.value.length - 1]
    return layers.value[lastId] || null
  })

  const setCurrentLayerId = (layerId: string | null) => {
    currentLayerId.value = layerId
  }

  const updateLayerWithOffsetAndId = (layerId: string, offset: Point) => {
    const layer = layers.value[layerId]
    if (!layer) return
    // 加上相对位置
    layer.x += offset.x
    layer.y += offset.y
  }

  const updateLayerWithColorAndId = (layerId: string, color: Color) => {
    const layer = layers.value[layerId]
    if (!layer) return
    layer.fill.r = color.r
    layer.fill.g = color.g
    layer.fill.b = color.b
  }


  const deleteCurrentLayer = () => {
    if (!currentLayerId.value) return
    const index = layerIds.value.indexOf(currentLayerId.value)
    if (index === -1) return
    // delete layerIds
    layerIds.value.splice(index, 1)
    // delete layers
    delete layers.value[currentLayerId.value]
    // update currentLayerId
    currentLayerId.value = null
  }


  return {
    layerIds,
    setLayerIds,
    layers,
    insertLayer,
    getLayerById,
    lastLayer,
    currentLayerId,
    getCurrentLayer,
    setLastUsedColor,
    setCurrentLayerId,
    updateLayerWithBoundsAndId,
    updateLayerWithOffsetAndId,
    updateLayerWithColorAndId,
    deleteCurrentLayer
  }
})
