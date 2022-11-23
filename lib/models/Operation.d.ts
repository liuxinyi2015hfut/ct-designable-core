import { Workspace } from './Workspace';
import { Engine } from './Engine';
import { TreeNode, ITreeNode } from './TreeNode';
import { Selection } from './Selection';
import { Hover } from './Hover';
import { Dragon } from './Dragon';
import { ICustomEvent, IPoint } from '@designable/shared';
export interface IOperation {
    tree?: ITreeNode;
    selected?: string[];
}
export declare class Operation {
    workspace: Workspace;
    engine: Engine;
    tree: TreeNode;
    selection: Selection;
    viewportDragon: Dragon;
    outlineDragon: Dragon;
    hover: Hover;
    requests: {
        snapshot: any;
    };
    constructor(workspace: Workspace);
    dispatch(event: ICustomEvent, callback?: () => void): any;
    getSelectedNodes(): TreeNode[];
    setDragNodes(nodes: TreeNode[]): void;
    getDragNodes(): TreeNode[];
    getDropNodes(parent: TreeNode): any[];
    getClosestNode(): TreeNode;
    getClosestPosition(): import("./Dragon").ClosestPosition;
    setTouchNode(node: TreeNode): void;
    dragWith(point: IPoint, touchNode?: TreeNode): void;
    dragClean(): void;
    getTouchNode(): TreeNode;
    setDropNode(node: TreeNode): void;
    getDropNode(): TreeNode;
    removeNodes(nodes: TreeNode[]): void;
    sortNodes(nodes: TreeNode[]): TreeNode[];
    cloneNodes(nodes: TreeNode[]): void;
    makeObservable(): void;
    snapshot(type?: string): void;
    from(operation?: IOperation): void;
    serialize(): IOperation;
}
