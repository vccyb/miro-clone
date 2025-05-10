import type { Layer, XYWH } from "@/types/canvas";

/**
 * 
 * @param layers - The layers to calculate the bounding box for.
 * @returns 
 */
const boundingBox = (layers: Layer[]): XYWH | null => {
  const firstLayer = layers[0];

  if (!firstLayer) return null

  let left = firstLayer.x;
  let top = firstLayer.y;
  let right = firstLayer.x + firstLayer.width;
  let bottom = firstLayer.y + firstLayer.height;


  // 整体上就是找到一个最大的范围
  for (let i = 1; i < layers.length; i++) {
    const layer = layers[i];
    const { x, y, width, height } = layer;


    if (x < left) {
      left = x;
    }

    if (y < top) {
      top = y;
    }

    if (x + width > right) {
      right = x + width;
    }

    if (y + height > bottom) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }

}

export {
  boundingBox
}