

import { ref, computed, h } from 'vue'
import { nanoid } from "nanoid";
import { defineStore } from 'pinia'
import type { Point } from '@/types/canvas'
import { LayerType } from "@/types/canvas"
type InsertLayerType =
  | LayerType.Ellipse
  | LayerType.Rectangle
  | LayerType.Text
  | LayerType.Note


export const useCanvasStore = defineStore('canvas-board', () => {
  const layerIds = ref<string[]>([])


  const layers = ref<Record<string, any>>({})


  const insertLayer = (layerType: InsertLayerType, position: Point) => {
    const layerId = nanoid();
    layerIds.value.push(layerId)
    const layer = {
      type: layerType,
      x: position.x,
      y: position.y,
      width: 100,
      height: 100,
      fill: "#ccc"
    }
    layers.value[layerId] = layer
  }


  const getLayerById = (layerId: string) => {
    return layers.value[layerId]
  }

  return {
    layerIds,
    layers,
    insertLayer,
    getLayerById
  }
})
