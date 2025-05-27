import { computed, ref } from 'vue'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import type { Color, Layer, Point, XYWH } from '@/types/canvas'
import { LayerType } from '@/types/canvas'
import { penPointsToPathLayer } from '@/utils/canvasUtil.ts'
import { saveCanvasContent } from '@/service/boards'

type InsertLayerType = LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note

interface History {
  past: Array<{
    layerIds: string[]
    layers: Record<string, any>
  }>
  future: Array<{
    layerIds: string[]
    layers: Record<string, any>
  }>
}

export const useCanvasStore = defineStore('canvas-board', () => {
  const layerIds = ref<string[]>([])

  const setLayerIds = (ids: string[]) => {
    layerIds.value = ids
  }

  const layers = ref<Record<string, any>>({})

  const currentLayerIds = ref<string[] | null>(null)

  const history = ref<History>({
    past: [],
    future: [],
  })

  const canUndo = computed(() => {
    return history.value.past.length > 0
  })

  const canRedo = computed(() => {
    return history.value.future.length > 0
  })

  const undo = () => {
    if (!canUndo.value) return
    // 保存当前的状态到future，也就是未来,让其可以redo
    const currentState = {
      layerIds: [...layerIds.value],
      layers: JSON.parse(JSON.stringify(layers.value)),
    }
    history.value.future.push(currentState)

    // 获取上一个状态
    const previousState = history.value.past.pop()
    if (previousState) {
      layerIds.value = [...previousState.layerIds]
      layers.value = JSON.parse(JSON.stringify(previousState.layers))
    }
  }

  const redo = () => {
    if (!canRedo.value) return

    const nextState = history.value.future.pop()
    if (nextState) {
      // 保存当前的状态到past，也就是过去
      const currentState = {
        layerIds: [...layerIds.value],
        layers: JSON.parse(JSON.stringify(layers.value)),
      }

      history.value.past.push(currentState)
      //恢复到下一个状态
      layerIds.value = [...nextState.layerIds]
      layers.value = JSON.parse(JSON.stringify(nextState.layers))
    }
  }

  const saveToHistory = () => {
    const currentState = {
      layerIds: [...layerIds.value],
      layers: JSON.parse(JSON.stringify(layers.value)),
    }

    history.value.past.push(currentState)
    history.value.future = []
    if (history.value.past.length > 20) {
      history.value.past.shift()
    }
  }

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
    saveToHistory()

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
    saveToHistory()

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
    saveToHistory()

    for (const layerId of ids) {
      const layer = layers.value[layerId]
      if (!layer) continue
      layer.fill.r = color.r
      layer.fill.g = color.g
      layer.fill.b = color.b
    }
  }

  // 更新note的值
  const updateLayerWithValueAndId = (layerId: string, value: string) => {
    saveToHistory()
    const layer = layers.value[layerId]
    if (!layer) return
    layer.value = value
  }

  const deleteCurrentLayer = () => {
    saveToHistory()
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

  // saveBoardWithContent
  const saveContent = async (boardId: string) => {
    // layerIds and layers to json
    const layerIdsJson = JSON.stringify(layerIds.value)
    const layersJson = JSON.stringify(layers.value)
    const contentObject = {
      layerIds: layerIdsJson,
      layers: layersJson,
    }
    // jaon -> string
    const contentString = JSON.stringify(contentObject)

    // 调用api
    try {
      await saveCanvasContent(boardId, contentString)
    } catch (error) {
      console.error('保存画板内容失败:', error)
      return
    }
  }

  const loadContent = (contentString: string | object) => {

    if(contentString instanceof  Object) {
      layerIds.value = contentString?.layerIds ?? []
      layers.value = contentString?.layers ?? {}
      return
    }

    // string -> json
    let contentObject = JSON.parse(contentString)
    // json -> layerIds and layers
    const layerIdsJson = contentObject?.layerIds
    const layersJson = contentObject?.layers
    const networkLayerIds = JSON.parse(layerIdsJson)
    const networkLayers = JSON.parse(layersJson)
    // set layerIds and layers
    layerIds.value = networkLayerIds
    layers.value = networkLayers
  }

  const clearStore = () => {
    layerIds.value = []
    layers.value = {}
    currentLayerIds.value = null
    lastUsedColor.value = {
      r: 0,
      g: 0,
      b: 0,
    }
    pencilState.value = {
      pencilDraft: [],
      pencilColor: null,
    }
    history.value = {
      past: [],
      future: [],
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
    saveContent,
    loadContent,

    // history
    history,
    canUndo,
    canRedo,
    undo,
    redo,
    saveToHistory,

    // clear
    clearStore
  }
})
