import { IEventProps, Event } from '@designable/shared';
import { ISchema } from '@formily/json-schema';
import { Engine, ITreeNode, ScreenType, Shortcut, Viewport, Workbench, Workspace, TreeNode } from './models';
export declare type IEngineProps<T = Event> = IEventProps<T> & {
    shortcuts?: Shortcut[];
    sourceIdAttrName?: string;
    nodeIdAttrName?: string;
    contentEditableAttrName?: string;
    contentEditableNodeIdAttrName?: string;
    clickStopPropagationAttrName?: string;
    outlineNodeIdAttrName?: string;
    nodeSelectionIdAttrName?: string;
    nodeDragHandlerAttrName?: string;
    screenResizeHandlerAttrName?: string;
    nodeResizeHandlerAttrName?: string;
    nodeTranslateAttrName?: string;
    defaultComponentTree?: ITreeNode;
    defaultScreenType?: ScreenType;
    rootComponentName?: string;
};
export declare type IEngineContext = {
    workspace: Workspace;
    workbench: Workbench;
    engine: Engine;
    viewport: Viewport;
};
export declare type IResizable = {
    width?: (node: TreeNode, element: Element) => {
        plus: () => void;
        minus: () => void;
    };
    height?: (node: TreeNode, element: Element) => {
        plus: () => void;
        minus: () => void;
    };
};
export declare type ITranslate = {
    x: (node: TreeNode, element: HTMLElement, diffX: string | number) => {
        translate: () => void;
    };
    y: (node: TreeNode, element: HTMLElement, diffY: string | number) => {
        translate: () => void;
    };
};
export interface IDesignerProps {
    package?: string;
    registry?: string;
    version?: string;
    path?: string;
    title?: string;
    description?: string;
    icon?: string;
    droppable?: boolean;
    draggable?: boolean;
    deletable?: boolean;
    cloneable?: boolean;
    resizable?: IResizable;
    translatable?: ITranslate;
    inlineChildrenLayout?: boolean;
    selfRenderChildren?: boolean;
    propsSchema?: ISchema;
    defaultProps?: any;
    getDragNodes?: (node: TreeNode) => TreeNode | TreeNode[];
    getDropNodes?: (node: TreeNode, parent: TreeNode) => TreeNode | TreeNode[];
    getComponentProps?: (node: TreeNode) => any;
    allowAppend?: (target: TreeNode, sources?: TreeNode[]) => boolean;
    allowSiblings?: (target: TreeNode, sources?: TreeNode[]) => boolean;
    allowDrop?: (target: TreeNode) => boolean;
    [key: string]: any;
}
export declare type IDesignerPropsMap = Record<string, IDesignerProps>;
export declare type IDesignerControllerProps = IDesignerProps | ((node: TreeNode) => IDesignerProps);
export declare type IDesignerControllerPropsMap = Record<string, IDesignerControllerProps>;
export interface IDesignerLocales {
    [ISOCode: string]: {
        [key: string]: any;
    };
}
export interface IDesignerMiniLocales {
    [ISOCode: string]: string;
}
export interface IDesignerBehaviors {
    [key: string]: IBehaviorHost;
}
export interface IDesignerStore<P> {
    value: P;
}
export declare type IDesignerIcons = Record<string, any>;
export declare type IDesignerIconsStore = IDesignerStore<IDesignerIcons>;
export declare type IDesignerLocaleStore = IDesignerStore<IDesignerLocales>;
export declare type IDesignerBehaviorStore = IDesignerStore<IBehavior[]>;
export declare type IDesignerLanguageStore = IDesignerStore<string>;
export declare type WorkbenchTypes = 'DESIGNABLE' | 'PREVIEW' | 'JSONTREE' | 'MARKUP' | (string & {});
export interface IBehavior {
    name: string;
    extends?: string[];
    selector: (node: TreeNode) => boolean;
    designerProps?: IDesignerControllerProps;
    designerLocales?: IDesignerLocales;
}
export interface IBehaviorCreator {
    name: string;
    extends?: string[];
    selector: string | ((node: TreeNode) => boolean);
    designerProps?: IDesignerControllerProps;
    designerLocales?: IDesignerLocales;
}
export interface IBehaviorHost {
    Behavior?: IBehavior[];
}
export declare type IBehaviorLike = IBehavior[] | IBehaviorHost;
export interface IResource {
    title?: string | IDesignerMiniLocales;
    description?: string | IDesignerMiniLocales;
    icon?: any;
    thumb?: string;
    span?: number;
    node?: TreeNode;
}
export interface IResourceHost {
    Resource?: IResource[];
}
export declare type IResourceLike = IResource[] | IResourceHost;
export interface IResourceCreator {
    title?: string | IDesignerMiniLocales;
    description?: string | IDesignerMiniLocales;
    icon?: any;
    thumb?: string;
    span?: number;
    elements?: ITreeNode[];
}
