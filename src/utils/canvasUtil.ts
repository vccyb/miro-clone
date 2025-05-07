import type { Camera, Color } from "@/types/canvas";

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