export type Color = {
    r: number
    g: number
    b: number
}

export type Camera = {
    x: number
    y: number
}

export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note,
}

export type RectangleLayer = {
    id: string
    type: LayerType.Rectangle
    x: number
    y: number
    height: number
    width: number
    full: Color
    value?: string
}

export type EllipaseLayer = {
    id: string;
    type: LayerType.Ellipse;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

export type PathLayer = {
    id: string
    type: LayerType.Path
    x: number
    y: number
    height: number
    width: number
    full: Color
    points: number[][]
    value?: string
}


export type TextLayer = {
    id: string
    type: LayerType.Text
    x: number
    y: number
    height: number
    width: number
    full: Color
    value?: string
}

export type NoteLayer = {
    id: string
    type: LayerType.Note
    x: number
    y: number
    height: number
    width: number
    full: Color
    value?: string
}

export type Point = {
    x: number
    y: number
}

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}

export type XYWH = {
    x: number;
    y: number;
    height: number;
    width: number;
};

export type CanvasState =
    | {
        mode: CanvasMode.None
    }
    | {
        mode: CanvasMode.Pressinng
        origin: Point
    }
    | {
        mode: CanvasMode.SelecctionNet
        origin: Point
        current?: Point
    }
    | {
        mode: CanvasMode.Translating
        current: Point
    }
    | {
        mode: CanvasMode.Inserting
        layerType:
        | LayerType.Ellipse
        | LayerType.Note
        | LayerType.Rectangle
        | LayerType.Text
    }
    | {
        mode: CanvasMode.Resizing
        initialBounds: XYWH
        corner: Side
    }
    | {
        mode: CanvasMode.Pencil
    }

export enum CanvasMode {
    None,
    Pressinng,
    SelecctionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}

export type Layer =
    | RectangleLayer
    | EllipaseLayer
    | PathLayer
    | TextLayer
    | NoteLayer;