import type { Camera } from "@/types/canvas";

export function pointEventTocavansPoint(e: MouseEvent, camera: Camera) {
    const x = Math.round(e.clientX) - camera.x;
    const y = Math.round(e.clientY) - camera.y;
    return {
        x,
        y
    };
}