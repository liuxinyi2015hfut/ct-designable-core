var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { action, define, observable } from '@formily/reactive';
import { globalThisPolyfill } from '@designable/shared';
export var CursorStatus;
(function (CursorStatus) {
    CursorStatus["Normal"] = "NORMAL";
    CursorStatus["DragStart"] = "DRAG_START";
    CursorStatus["Dragging"] = "DRAGGING";
    CursorStatus["DragStop"] = "DRAG_STOP";
})(CursorStatus || (CursorStatus = {}));
export var CursorType;
(function (CursorType) {
    CursorType["Move"] = "MOVE";
    CursorType["Selection"] = "SELECTION";
})(CursorType || (CursorType = {}));
var DEFAULT_POSITION = {
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    topPageX: 0,
    topPageY: 0,
    topClientX: 0,
    topClientY: 0,
};
var DEFAULT_SCROLL_OFFSET = {
    scrollX: 0,
    scrollY: 0,
};
var setCursorStyle = function (contentWindow, style) {
    var _a, _b, _c, _d;
    var currentRoot = (_b = (_a = document === null || document === void 0 ? void 0 : document.getElementsByTagName) === null || _a === void 0 ? void 0 : _a.call(document, 'html')) === null || _b === void 0 ? void 0 : _b[0];
    var root = (_d = (_c = contentWindow === null || contentWindow === void 0 ? void 0 : contentWindow.document) === null || _c === void 0 ? void 0 : _c.getElementsByTagName('html')) === null || _d === void 0 ? void 0 : _d[0];
    if (root && root.style.cursor !== style) {
        root.style.cursor = style;
    }
    if (currentRoot && currentRoot.style.cursor !== style) {
        currentRoot.style.cursor = style;
    }
};
var Cursor = /** @class */ (function () {
    function Cursor(engine) {
        this.type = CursorType.Move;
        this.status = CursorStatus.Normal;
        this.position = DEFAULT_POSITION;
        this.dragStartPosition = DEFAULT_POSITION;
        this.dragStartScrollOffset = DEFAULT_SCROLL_OFFSET;
        this.dragEndPosition = DEFAULT_POSITION;
        this.dragEndScrollOffset = DEFAULT_SCROLL_OFFSET;
        this.view = globalThisPolyfill;
        this.engine = engine;
        this.makeObservable();
    }
    Cursor.prototype.makeObservable = function () {
        define(this, {
            type: observable.ref,
            status: observable.ref,
            position: observable.ref,
            dragStartPosition: observable.ref,
            dragStartScrollOffset: observable.ref,
            dragEndPosition: observable.ref,
            dragEndScrollOffset: observable.ref,
            view: observable.ref,
            setStyle: action,
            setPosition: action,
            setStatus: action,
            setType: action,
        });
    };
    Cursor.prototype.setStatus = function (status) {
        this.status = status;
    };
    Cursor.prototype.setType = function (type) {
        this.type = type;
    };
    Cursor.prototype.setStyle = function (style) {
        this.engine.workbench.eachWorkspace(function (workspace) {
            setCursorStyle(workspace.viewport.contentWindow, style);
        });
    };
    Cursor.prototype.setPosition = function (position) {
        this.position = __assign(__assign({}, this.position), position);
    };
    Cursor.prototype.setDragStartPosition = function (position) {
        this.dragStartPosition = __assign(__assign({}, this.dragStartPosition), position);
    };
    Cursor.prototype.setDragEndPosition = function (position) {
        this.dragEndPosition = __assign(__assign({}, this.dragEndPosition), position);
    };
    Cursor.prototype.setDragStartScrollOffset = function (offset) {
        this.dragStartScrollOffset = __assign(__assign({}, this.dragStartScrollOffset), offset);
    };
    Cursor.prototype.setDragEndScrollOffset = function (offset) {
        this.dragEndScrollOffset = __assign(__assign({}, this.dragEndScrollOffset), offset);
    };
    return Cursor;
}());
export { Cursor };
