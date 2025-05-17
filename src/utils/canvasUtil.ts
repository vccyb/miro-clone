import type { Camera, Color, Layer, Point, XYWH } from '@/types/canvas'
import { Side } from '@/types/canvas'
export function pointEventTocavansPoint(e: MouseEvent, camera: Camera) {
  const x = Math.round(e.clientX) - camera.x
  const y = Math.round(e.clientY) - camera.y
  return {
    x,
    y,
  }
}

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) {
    return ''
  }
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q'],
  )
  d.push('Z')
  return d.join(' ')
}

export function colorToCss(color: Color) {
  const rc = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
  return rc
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    height: bounds.height,
    width: bounds.width,
  }

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width)
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }
  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x)
    result.width = Math.abs(point.x - bounds.x)
  }
  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height)
    result.height = Math.abs(bounds.y + bounds.height - point.y)
  }
  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y)
    result.height = Math.abs(point.y - bounds.y)
  }

  return result
}

export function findIntersectingLayerWithRectangle(
  layerIds: string[],
  layers: Record<string, Layer>,
  origin: Point,
  current: Point,
) {
  const rect = {
    x: Math.min(origin.x, current.x),
    y: Math.min(origin.y, current.y),
    width: Math.abs(origin.x - current.x),
    height: Math.abs(origin.y - current.y),
  }

  const ids = []

  for (const layerId of layerIds) {
    const layer = layers[layerId]

    if (layer === null) {
      continue
    }

    const { x, y, height, width } = layer

    if (
      rect.x < x &&
      rect.x + rect.width > x + width &&
      rect.y < y &&
      rect.y + rect.height > y + height
    ) {
      ids.push(layerId)
    }

  }
  return ids

}


export function getConstrastingTextColor(color: Color) {
  const luminance = 0.299 * color.r + 0.578 * color.g + 0.114 * color.b;
  return luminance > 182 ? "black" : "white";
}
