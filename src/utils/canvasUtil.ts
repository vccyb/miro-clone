import type { Camera, Color, Point, XYWH } from "@/types/canvas";
import { Side } from "@/types/canvas";
export function pointEventTocavansPoint(e: MouseEvent, camera: Camera) {
    const x = Math.round(e.clientX) - camera.x;
    const y = Math.round(e.clientY) - camera.y;
    return {
        x,
        y
    };
}


export function getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) {
        return "";
    }
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );
    d.push("Z");
    return d.join(" ");
}


export function colorToCss(color: Color) {
    const rc = `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;

    return rc;
}


export function resizeBounds(
    bounds: XYWH,
    corner: Side,
    point: Point
): XYWH {
    const result = {
        x: bounds.x,
        y: bounds.y,
        height: bounds.height,
        width: bounds.width,
    }


    if ((corner & Side.Left) === Side.Left) {
        result.x = Math.min(point.x, bounds.x + bounds.width);
        result.width = Math.abs(bounds.x + bounds.width - point.x);
    }
    if ((corner & Side.Right) === Side.Right) {
        result.x = Math.min(point.x, bounds.x);
        result.width = Math.abs(point.x - bounds.x);
    }
    if ((corner & Side.Top) === Side.Top) {
        result.y = Math.min(point.y, bounds.y + bounds.height);
        result.height = Math.abs(bounds.y + bounds.height - point.y);
    }
    if ((corner & Side.Bottom) === Side.Bottom) {
        result.y = Math.min(point.y, bounds.y);
        result.height = Math.abs(point.y - bounds.y);
    }

    return result
}