import { IPoint } from '@designable/shared';
import { Workspace } from './Workspace';
import { Engine } from './Engine';
import { TreeNode } from './TreeNode';
import { Selector } from './Selector';
export interface IViewportProps {
    engine: Engine;
    workspace: Workspace;
    viewportElement: HTMLElement;
    contentWindow: Window;
    nodeIdAttrName: string;
}
/**
 * 视口模型
 */
export declare class Viewport {
    workspace: Workspace;
    selector: Selector;
    engine: Engine;
    contentWindow: Window;
    viewportElement: HTMLElement;
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
    attachRequest: number;
    nodeIdAttrName: string;
    constructor(props: IViewportProps);
    get isScrollLeft(): boolean;
    get isScrollTop(): boolean;
    get isScrollRight(): boolean;
    get isScrollBottom(): boolean;
    get viewportRoot(): HTMLElement;
    get isMaster(): boolean;
    get isIframe(): boolean;
    get scrollContainer(): Window | HTMLElement;
    get rect(): DOMRect;
    get innerRect(): DOMRect;
    get offsetX(): number;
    get offsetY(): number;
    get scale(): number;
    digestViewport(): void;
    elementFromPoint(point: IPoint): Element;
    matchViewport(target: HTMLElement | Element | Window | Document | EventTarget): boolean;
    attachEvents(): void;
    detachEvents(): void;
    onMount(element: HTMLElement, contentWindow: Window): void;
    onUnmount(): void;
    isPointInViewport(point: IPoint, sensitive?: boolean): boolean;
    isPointInViewportArea(point: IPoint, sensitive?: boolean): boolean;
    isOffsetPointInViewport(point: IPoint, sensitive?: boolean): boolean;
    makeObservable(): void;
    findElementById(id: string): Element;
    findElementsById(id: string): Element[];
    containsElement(element: HTMLElement | Element | EventTarget): boolean;
    getOffsetPoint(topPoint: IPoint): {
        x: number;
        y: number;
    };
    getElementRect(element: HTMLElement | Element): DOMRect;
    /**
     * 相对于主屏幕
     * @param id
     */
    getElementRectById(id: string): DOMRect;
    /**
     * 相对于视口
     * @param id
     */
    getElementOffsetRectById(id: string): DOMRect;
    getValidNodeElement(node: TreeNode): Element;
    getChildrenRect(node: TreeNode): DOMRect;
    getChildrenOffsetRect(node: TreeNode): DOMRect;
    getValidNodeRect(node: TreeNode): DOMRect;
    getValidNodeOffsetRect(node: TreeNode): DOMRect;
    getValidNodeLayout(node: TreeNode): "vertical" | "horizontal";
}
