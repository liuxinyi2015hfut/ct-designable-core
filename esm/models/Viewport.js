import { calcBoundingRect, calcElementLayout, isHTMLElement, isPointInRect, requestIdle, cancelIdle, globalThisPolyfill, } from '@designable/shared';
import { action, define, observable } from '@formily/reactive';
import { Selector } from './Selector';
/**
 * 视口模型
 */
var Viewport = /** @class */ (function () {
    function Viewport(props) {
        this.scrollX = 0;
        this.scrollY = 0;
        this.width = 0;
        this.height = 0;
        this.workspace = props.workspace;
        this.engine = props.engine;
        this.viewportElement = props.viewportElement;
        this.contentWindow = props.contentWindow;
        this.nodeIdAttrName = props.nodeIdAttrName;
        this.selector = new Selector();
        this.digestViewport();
        this.makeObservable();
        this.attachEvents();
    }
    Object.defineProperty(Viewport.prototype, "isScrollLeft", {
        get: function () {
            return this.scrollX === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isScrollTop", {
        get: function () {
            return this.scrollY === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isScrollRight", {
        get: function () {
            var _a, _b, _c, _d;
            if (this.isIframe) {
                return (this.width + this.scrollX >= ((_c = (_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.scrollWidth));
            }
            else if (this.viewportElement) {
                return this.width + this.scrollX >= ((_d = this.viewportElement) === null || _d === void 0 ? void 0 : _d.scrollWidth);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isScrollBottom", {
        get: function () {
            var _a, _b, _c, _d;
            if (this.isIframe) {
                return (this.height + this.scrollY >= ((_c = (_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.scrollHeight));
            }
            else if (this.viewportElement) {
                return this.height + this.scrollY >= ((_d = this.viewportElement) === null || _d === void 0 ? void 0 : _d.scrollHeight);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "viewportRoot", {
        get: function () {
            var _a, _b;
            return this.isIframe
                ? (_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body : this.viewportElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isMaster", {
        get: function () {
            return this.contentWindow === globalThisPolyfill;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "isIframe", {
        get: function () {
            var _a;
            return !!((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.frameElement) && !this.isMaster;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "scrollContainer", {
        get: function () {
            return this.isIframe ? this.contentWindow : this.viewportElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "rect", {
        get: function () {
            var viewportElement = this.viewportElement;
            if (viewportElement)
                return this.getElementRect(viewportElement);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "innerRect", {
        get: function () {
            var rect = this.rect;
            return (typeof DOMRect !== 'undefined' &&
                new DOMRect(0, 0, rect === null || rect === void 0 ? void 0 : rect.width, rect === null || rect === void 0 ? void 0 : rect.height));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "offsetX", {
        get: function () {
            var rect = this.rect;
            if (!rect)
                return 0;
            return rect.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "offsetY", {
        get: function () {
            var rect = this.rect;
            if (!rect)
                return 0;
            return rect.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Viewport.prototype, "scale", {
        get: function () {
            if (!this.viewportElement)
                return 1;
            var clientRect = this.viewportElement.getBoundingClientRect();
            var offsetWidth = this.viewportElement.offsetWidth;
            return Math.round(clientRect.width / offsetWidth);
        },
        enumerable: false,
        configurable: true
    });
    Viewport.prototype.digestViewport = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.isIframe) {
            this.scrollX = ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.scrollX) || 0;
            this.scrollY = ((_b = this.contentWindow) === null || _b === void 0 ? void 0 : _b.scrollY) || 0;
            this.width = ((_c = this.contentWindow) === null || _c === void 0 ? void 0 : _c.innerWidth) || 0;
            this.height = ((_d = this.contentWindow) === null || _d === void 0 ? void 0 : _d.innerHeight) || 0;
        }
        else if (this.viewportElement) {
            this.scrollX = ((_e = this.viewportElement) === null || _e === void 0 ? void 0 : _e.scrollLeft) || 0;
            this.scrollY = ((_f = this.viewportElement) === null || _f === void 0 ? void 0 : _f.scrollTop) || 0;
            this.width = ((_g = this.viewportElement) === null || _g === void 0 ? void 0 : _g.clientWidth) || 0;
            this.height = ((_h = this.viewportElement) === null || _h === void 0 ? void 0 : _h.clientHeight) || 0;
        }
    };
    Viewport.prototype.elementFromPoint = function (point) {
        var _a;
        if ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document) {
            return this.contentWindow.document.elementFromPoint(point.x, point.y);
        }
    };
    Viewport.prototype.matchViewport = function (target) {
        var _a;
        if (this.isIframe) {
            return (target === this.viewportElement ||
                target === this.contentWindow ||
                target === ((_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
        }
        else {
            return target === this.viewportElement;
        }
    };
    Viewport.prototype.attachEvents = function () {
        var _this = this;
        var engine = this.engine;
        cancelIdle(this.attachRequest);
        this.attachRequest = requestIdle(function () {
            if (!engine)
                return;
            if (_this.isIframe) {
                _this.workspace.attachEvents(_this.contentWindow, _this.contentWindow);
            }
            else if (isHTMLElement(_this.viewportElement)) {
                _this.workspace.attachEvents(_this.viewportElement, _this.contentWindow);
            }
        });
    };
    Viewport.prototype.detachEvents = function () {
        if (this.isIframe) {
            this.workspace.detachEvents(this.contentWindow);
            this.workspace.detachEvents(this.viewportElement);
        }
        else if (this.viewportElement) {
            this.workspace.detachEvents(this.viewportElement);
        }
    };
    Viewport.prototype.onMount = function (element, contentWindow) {
        this.viewportElement = element;
        this.contentWindow = contentWindow;
        this.attachEvents();
        this.digestViewport();
    };
    Viewport.prototype.onUnmount = function () {
        this.detachEvents();
    };
    Viewport.prototype.isPointInViewport = function (point, sensitive) {
        if (!this.rect)
            return false;
        if (!this.containsElement(document.elementFromPoint(point.x, point.y)))
            return false;
        return isPointInRect(point, this.rect, sensitive);
    };
    Viewport.prototype.isPointInViewportArea = function (point, sensitive) {
        if (!this.rect)
            return false;
        return isPointInRect(point, this.rect, sensitive);
    };
    Viewport.prototype.isOffsetPointInViewport = function (point, sensitive) {
        if (!this.innerRect)
            return false;
        if (!this.containsElement(document.elementFromPoint(point.x, point.y)))
            return false;
        return isPointInRect(point, this.innerRect, sensitive);
    };
    Viewport.prototype.makeObservable = function () {
        define(this, {
            scrollX: observable.ref,
            scrollY: observable.ref,
            width: observable.ref,
            height: observable.ref,
            digestViewport: action,
            viewportElement: observable.ref,
            contentWindow: observable.ref,
        });
    };
    Viewport.prototype.findElementById = function (id) {
        return this.selector.query(this.viewportRoot, "*[" + this.nodeIdAttrName + "='" + id + "']\n      ");
    };
    Viewport.prototype.findElementsById = function (id) {
        if (!id)
            return [];
        return this.selector.queryAll(this.viewportRoot, "*[" + this.nodeIdAttrName + "='" + id + "']\n      ");
    };
    Viewport.prototype.containsElement = function (element) {
        var root = this.viewportElement;
        if (root === element)
            return true;
        return root === null || root === void 0 ? void 0 : root.contains(element);
    };
    Viewport.prototype.getOffsetPoint = function (topPoint) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.isIframe) {
            return {
                x: topPoint.x - this.offsetX + ((_b = (_a = this.contentWindow) === null || _a === void 0 ? void 0 : _a.scrollX) !== null && _b !== void 0 ? _b : 0),
                y: topPoint.y - this.offsetY + ((_d = (_c = this.contentWindow) === null || _c === void 0 ? void 0 : _c.scrollY) !== null && _d !== void 0 ? _d : 0),
            };
        }
        else {
            return {
                x: topPoint.x - this.offsetX + ((_f = (_e = this.viewportElement) === null || _e === void 0 ? void 0 : _e.scrollLeft) !== null && _f !== void 0 ? _f : 0),
                y: topPoint.y - this.offsetY + ((_h = (_g = this.viewportElement) === null || _g === void 0 ? void 0 : _g.scrollTop) !== null && _h !== void 0 ? _h : 0),
            };
        }
    };
    Viewport.prototype.getElementRect = function (element) {
        var rect = element.getBoundingClientRect();
        var offsetWidth = element['offsetWidth']
            ? element['offsetWidth']
            : rect.width;
        var offsetHeight = element['offsetHeight']
            ? element['offsetHeight']
            : rect.height;
        return (typeof DOMRect !== 'undefined' &&
            new DOMRect(rect.x, rect.y, this.scale !== 1 ? offsetWidth : rect.width, this.scale !== 1 ? offsetHeight : rect.height));
    };
    /**
     * 相对于主屏幕
     * @param id
     */
    Viewport.prototype.getElementRectById = function (id) {
        var _this = this;
        var elements = this.findElementsById(id);
        var rect = calcBoundingRect(elements.map(function (element) { return _this.getElementRect(element); }));
        if (rect) {
            if (this.isIframe) {
                return (typeof DOMRect !== 'undefined' &&
                    new DOMRect(rect.x + this.offsetX, rect.y + this.offsetY, rect.width, rect.height));
            }
            else {
                return (typeof DOMRect !== 'undefined' &&
                    new DOMRect(rect.x, rect.y, rect.width, rect.height));
            }
        }
    };
    /**
     * 相对于视口
     * @param id
     */
    Viewport.prototype.getElementOffsetRectById = function (id) {
        var _this = this;
        var elements = this.findElementsById(id);
        if (!elements.length)
            return;
        var elementRect = calcBoundingRect(elements.map(function (element) { return _this.getElementRect(element); }));
        if (elementRect) {
            if (this.isIframe) {
                return (typeof DOMRect !== 'undefined' &&
                    new DOMRect(elementRect.x + this.contentWindow.scrollX, elementRect.y + this.contentWindow.scrollY, elementRect.width, elementRect.height));
            }
            else {
                return (typeof DOMRect !== 'undefined' &&
                    new DOMRect((elementRect.x - this.offsetX + this.viewportElement.scrollLeft) /
                        this.scale, (elementRect.y - this.offsetY + this.viewportElement.scrollTop) /
                        this.scale, elementRect.width, elementRect.height));
            }
        }
    };
    Viewport.prototype.getValidNodeElement = function (node) {
        var _this = this;
        var getNodeElement = function (node) {
            if (!node)
                return;
            var ele = _this.findElementById(node.id);
            if (ele) {
                return ele;
            }
            else {
                return getNodeElement(node.parent);
            }
        };
        return getNodeElement(node);
    };
    Viewport.prototype.getChildrenRect = function (node) {
        var _this = this;
        var _a;
        if (!((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length))
            return;
        return calcBoundingRect(node.children.reduce(function (buf, child) {
            var rect = _this.getValidNodeRect(child);
            if (rect) {
                return buf.concat(rect);
            }
            return buf;
        }, []));
    };
    Viewport.prototype.getChildrenOffsetRect = function (node) {
        var _this = this;
        var _a;
        if (!((_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.length))
            return;
        return calcBoundingRect(node.children.reduce(function (buf, child) {
            var rect = _this.getValidNodeOffsetRect(child);
            if (rect) {
                return buf.concat(rect);
            }
            return buf;
        }, []));
    };
    Viewport.prototype.getValidNodeRect = function (node) {
        if (!node)
            return;
        var rect = this.getElementRectById(node.id);
        if (node && node === node.root) {
            if (!rect)
                return this.rect;
            return calcBoundingRect([this.rect, rect]);
        }
        if (rect) {
            return rect;
        }
        else {
            return this.getChildrenRect(node);
        }
    };
    Viewport.prototype.getValidNodeOffsetRect = function (node) {
        if (!node)
            return;
        var rect = this.getElementOffsetRectById(node.id);
        if (node && node === node.root) {
            if (!rect)
                return this.innerRect;
            return calcBoundingRect([this.innerRect, rect]);
        }
        if (rect) {
            return rect;
        }
        else {
            return this.getChildrenOffsetRect(node);
        }
    };
    Viewport.prototype.getValidNodeLayout = function (node) {
        var _a, _b;
        if (!node)
            return 'vertical';
        if ((_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.designerProps) === null || _b === void 0 ? void 0 : _b.inlineChildrenLayout)
            return 'horizontal';
        return calcElementLayout(this.findElementById(node.id));
    };
    return Viewport;
}());
export { Viewport };
