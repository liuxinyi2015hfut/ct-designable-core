import { Operation } from './Operation';
import { IDesignerProps, IDesignerLocales } from '../types';
export interface ITreeNode {
    componentName?: string;
    sourceName?: string;
    operation?: Operation;
    hidden?: boolean;
    isSourceNode?: boolean;
    id?: string;
    props?: Record<string | number | symbol, any>;
    children?: ITreeNode[];
}
export interface INodeFinder {
    (node: TreeNode): boolean;
}
export declare class TreeNode {
    parent: TreeNode;
    root: TreeNode;
    operation: Operation;
    id: string;
    depth: number;
    hidden: boolean;
    componentName: string;
    sourceName: string;
    props: ITreeNode['props'];
    children: TreeNode[];
    isSelfSourceNode: boolean;
    constructor(node?: ITreeNode, parent?: TreeNode);
    makeObservable(): void;
    get designerProps(): IDesignerProps;
    get designerLocales(): IDesignerLocales;
    get previous(): TreeNode;
    get next(): TreeNode;
    get siblings(): TreeNode[];
    get index(): number;
    get descendants(): TreeNode[];
    get isRoot(): boolean;
    get isInOperation(): boolean;
    get lastChild(): TreeNode;
    get firstChild(): TreeNode;
    get isSourceNode(): boolean;
    getPrevious(step?: number): TreeNode;
    getAfter(step?: number): TreeNode;
    getSibling(index?: number): TreeNode;
    getParents(node?: TreeNode): TreeNode[];
    getParentByDepth(depth?: number): any;
    getMessage(token: string): any;
    isMyAncestor(node: TreeNode): boolean;
    isMyParent(node: TreeNode): boolean;
    isMyParents(node: TreeNode): boolean;
    isMyChild(node: TreeNode): boolean;
    isMyChildren(node: TreeNode): boolean;
    takeSnapshot(type?: string): void;
    triggerMutation<T>(event: any, callback?: () => T, defaults?: T): T;
    find(finder: INodeFinder): TreeNode;
    findAll(finder: INodeFinder): TreeNode[];
    distanceTo(node: TreeNode): number;
    crossSiblings(node: TreeNode): TreeNode[];
    allowSibling(nodes: TreeNode[]): boolean;
    allowDrop(parent: TreeNode): boolean;
    allowAppend(nodes: TreeNode[]): boolean;
    allowClone(): boolean;
    allowDrag(): boolean;
    allowResize(): false | Array<'x' | 'y'>;
    allowTranslate(): boolean;
    allowDelete(): boolean;
    findById(id: string): TreeNode;
    contains(...nodes: TreeNode[]): boolean;
    eachChildren(callback?: (node: TreeNode) => void | boolean): void;
    resetNodesParent(nodes: TreeNode[], parent: TreeNode): TreeNode[];
    setProps(props?: any): void;
    setComponentName(componentName: string): void;
    prepend(...nodes: TreeNode[]): TreeNode[];
    append(...nodes: TreeNode[]): TreeNode[];
    wrap(wrapper: TreeNode): TreeNode;
    insertAfter(...nodes: TreeNode[]): TreeNode[];
    insertBefore(...nodes: TreeNode[]): TreeNode[];
    insertChildren(start: number, ...nodes: TreeNode[]): TreeNode[];
    setChildren(...nodes: TreeNode[]): TreeNode[];
    /**
     * @deprecated
     * please use `setChildren`
     */
    setNodeChildren(...nodes: TreeNode[]): TreeNode[];
    remove(): void;
    clone(parent?: TreeNode): TreeNode;
    from(node?: ITreeNode): void;
    serialize(): ITreeNode;
    static create(node: ITreeNode, parent?: TreeNode): TreeNode;
    static findById(id: string): TreeNode;
}
