

import { ref, computed, h } from 'vue'
import { nanoid } from "nanoid";
import { defineStore } from 'pinia'
import type { Point, Color, Layer } from '@/types/canvas'
import { LayerType } from "@/types/canvas"
type InsertLayerType =
  | LayerType.Ellipse
  | LayerType.Rectangle
  | LayerType.Text
  | LayerType.Note


export const useCanvasStore = defineStore('canvas-board', () => {
  const layerIds = ref<string[]>([])


  const layers = ref<Record<string, any>>({})

  const currentLayerId = ref<string | null>(null)


  const lastUsedColor = ref<Color>({
    r: 255,
    g: 255,
    b: 0
  })

  const insertLayer = (layerType: InsertLayerType, position: Point) => {
    const layerId = nanoid();
    layerIds.value.push(layerId)
    const layer = {
      id: layerId,
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: lastUsedColor.value,
    }
    layers.value[layerId] = layer
  }


  const getLayerById = (layerId: string) => {
    return layers.value[layerId]
  }


  const lastLayer = computed<Layer | null>(() => {
    if (layerIds.value.length === 0) return null
    const lastId = layerIds.value[layerIds.value.length - 1]
    return layers.value[lastId] || null
  })

  const setCurrentLayerId = (layerId: string | null) => {
    currentLayerId.value = layerId
  }



  return {
    layerIds,
    layers,
    insertLayer,
    getLayerById,
    lastLayer,
    currentLayerId,
    setCurrentLayerId
  }
})
