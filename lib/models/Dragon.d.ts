import { Operation } from './Operation';
import { TreeNode } from './TreeNode';
import { IPoint } from '@designable/shared';
import { Viewport } from './Viewport';
export declare enum ClosestPosition {
    Before = "BEFORE",
    ForbidBefore = "FORBID_BEFORE",
    After = "After",
    ForbidAfter = "FORBID_AFTER",
    Upper = "UPPER",
    ForbidUpper = "FORBID_UPPER",
    Under = "UNDER",
    ForbidUnder = "FORBID_UNDER",
    Inner = "INNER",
    ForbidInner = "FORBID_INNER",
    InnerAfter = "INNER_AFTER",
    ForbidInnerAfter = "FORBID_INNER_AFTER",
    InnerBefore = "INNER_BEFORE",
    ForbidInnerBefore = "FORBID_INNER_BEFORE",
    Forbid = "FORBID"
}
export interface IDragonProps {
    operation: Operation;
    viewport: Viewport;
    sensitive?: boolean;
    forceBlock?: boolean;
}
export interface IDragonCalculateProps {
    touchNode: TreeNode;
    point?: IPoint;
    closestNode?: TreeNode;
    closestDirection?: ClosestPosition;
}
export declare class Dragon {
    operation: Operation;
    rootNode: TreeNode;
    dragNodes: TreeNode[];
    touchNode: TreeNode;
    dropNode: TreeNode;
    closestNode: TreeNode;
    closestRect: DOMRect;
    closestOffsetRect: DOMRect;
    closestDirection: ClosestPosition;
    sensitive: boolean;
    forceBlock: boolean;
    viewport: Viewport;
    constructor(props: IDragonProps);
    getClosestLayout(): "vertical" | "horizontal";
    /**
     * 相对最近节点的位置
     * @readonly
     * @type {ClosestPosition}
     * @memberof Dragon
     */
    getClosestPosition(point: IPoint): ClosestPosition;
    setClosestPosition(direction: ClosestPosition): void;
    /**
     * 拖拽过程中最近的节点
     *
     * @readonly
     * @type {TreeNode}
     * @memberof Dragon
     */
    getClosestNode(point: IPoint): TreeNode;
    setClosestNode(node: TreeNode): void;
    /**
     * 从最近的节点中计算出节点矩形
     *
     * @readonly
     * @type {DOMRect}
     * @memberof Dragon
     */
    getClosestRect(): DOMRect;
    setClosestRect(rect: DOMRect): void;
    getClosestOffsetRect(): DOMRect;
    setClosestOffsetRect(rect: DOMRect): void;
    setDragNodes(dragNodes?: TreeNode[]): void;
    setTouchNode(node?: TreeNode): void;
    calculate(props: IDragonCalculateProps): void;
    setDropNode(node: TreeNode): void;
    trigger(event: any): any;
    clear(): void;
    makeObservable(): void;
}
