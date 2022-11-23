export declare type SelectorStore = Map<string, WeakMap<object, Element[] | Element>>;
export declare type ElementResults = {
    current: Element[] | Element;
};
export declare class Selector {
    private store;
    private _queryAll;
    private _query;
    private _clean;
    queryAll(target: Element | HTMLDocument, selector: string): Element[];
    query(target: Element | HTMLDocument, selector: string): Element;
}
