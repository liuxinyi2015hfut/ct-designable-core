import { Engine } from './Engine';
export declare enum CursorStatus {
    Normal = "NORMAL",
    DragStart = "DRAG_START",
    Dragging = "DRAGGING",
    DragStop = "DRAG_STOP"
}
export declare enum CursorType {
    Move = "MOVE",
    Selection = "SELECTION"
}
export interface ICursorPosition {
    pageX?: number;
    pageY?: number;
    clientX?: number;
    clientY?: number;
    topPageX?: number;
    topPageY?: number;
    topClientX?: number;
    topClientY?: number;
}
export interface IScrollOffset {
    scrollX?: number;
    scrollY?: number;
}
export interface ICursor {
    status?: CursorStatus;
    position?: ICursorPosition;
    dragStartPosition?: ICursorPosition;
    dragEndPosition?: ICursorPosition;
    view?: Window;
}
export declare class Cursor {
    engine: Engine;
    type: CursorType | string;
    status: CursorStatus;
    position: ICursorPosition;
    dragStartPosition: ICursorPosition;
    dragStartScrollOffset: IScrollOffset;
    dragEndPosition: ICursorPosition;
    dragEndScrollOffset: IScrollOffset;
    view: Window;
    constructor(engine: Engine);
    makeObservable(): void;
    setStatus(status: CursorStatus): void;
    setType(type: CursorType | string): void;
    setStyle(style: string): void;
    setPosition(position?: ICursorPosition): void;
    setDragStartPosition(position?: ICursorPosition): void;
    setDragEndPosition(position?: ICursorPosition): void;
    setDragStartScrollOffset(offset?: IScrollOffset): void;
    setDragEndScrollOffset(offset?: IScrollOffset): void;
}
