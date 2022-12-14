"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragon = exports.ClosestPosition = void 0;
var reactive_1 = require("@formily/reactive");
var shared_1 = require("@designable/shared");
var events_1 = require("../events");
var ClosestPosition;
(function (ClosestPosition) {
    ClosestPosition["Before"] = "BEFORE";
    ClosestPosition["ForbidBefore"] = "FORBID_BEFORE";
    ClosestPosition["After"] = "After";
    ClosestPosition["ForbidAfter"] = "FORBID_AFTER";
    ClosestPosition["Upper"] = "UPPER";
    ClosestPosition["ForbidUpper"] = "FORBID_UPPER";
    ClosestPosition["Under"] = "UNDER";
    ClosestPosition["ForbidUnder"] = "FORBID_UNDER";
    ClosestPosition["Inner"] = "INNER";
    ClosestPosition["ForbidInner"] = "FORBID_INNER";
    ClosestPosition["InnerAfter"] = "INNER_AFTER";
    ClosestPosition["ForbidInnerAfter"] = "FORBID_INNER_AFTER";
    ClosestPosition["InnerBefore"] = "INNER_BEFORE";
    ClosestPosition["ForbidInnerBefore"] = "FORBID_INNER_BEFORE";
    ClosestPosition["Forbid"] = "FORBID";
})(ClosestPosition = exports.ClosestPosition || (exports.ClosestPosition = {}));
var Dragon = /** @class */ (function () {
    function Dragon(props) {
        this.dragNodes = [];
        this.touchNode = null;
        this.dropNode = null;
        this.closestNode = null;
        this.closestRect = null;
        this.closestOffsetRect = null;
        this.closestDirection = null;
        this.sensitive = true;
        this.forceBlock = false;
        this.viewport = null;
        this.operation = props.operation;
        this.viewport = props.viewport;
        this.sensitive = props.sensitive;
        this.forceBlock = props.forceBlock;
        this.rootNode = this.operation.tree;
        this.makeObservable();
    }
    Dragon.prototype.getClosestLayout = function () {
        return this.viewport.getValidNodeLayout(this.closestNode);
    };
    /**
     * ???????????????????????????
     * @readonly
     * @type {ClosestPosition}
     * @memberof Dragon
     */
    Dragon.prototype.getClosestPosition = function (point) {
        var _this = this;
        var closestNode = this.closestNode;
        if (!closestNode)
            return ClosestPosition.Forbid;
        var closestRect = this.viewport.getValidNodeRect(closestNode);
        var isInline = this.getClosestLayout() === 'horizontal';
        if (!closestRect) {
            return;
        }
        var isAfter = shared_1.isNearAfter(point, closestRect, this.forceBlock ? false : isInline);
        var getValidParent = function (node) {
            var _a;
            if (!node)
                return;
            if ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.allowSibling(_this.dragNodes))
                return node.parent;
            return getValidParent(node.parent);
        };
        if (shared_1.isPointInRect(point, closestRect, this.sensitive)) {
            if (!closestNode.allowAppend(this.dragNodes)) {
                if (!closestNode.allowSibling(this.dragNodes)) {
                    var parentClosestNode = getValidParent(closestNode);
                    if (parentClosestNode) {
                        this.closestNode = parentClosestNode;
                    }
                    if (isInline) {
                        if (parentClosestNode) {
                            if (isAfter) {
                                return ClosestPosition.After;
                            }
                            return ClosestPosition.Before;
                        }
                        if (isAfter) {
                            return ClosestPosition.ForbidAfter;
                        }
                        return ClosestPosition.ForbidBefore;
                    }
                    else {
                        if (parentClosestNode) {
                            if (isAfter) {
                                return ClosestPosition.Under;
                            }
                            return ClosestPosition.Upper;
                        }
                        if (isAfter) {
                            return ClosestPosition.ForbidUnder;
                        }
                        return ClosestPosition.ForbidUpper;
                    }
                }
                else {
                    if (isInline) {
                        return isAfter ? ClosestPosition.After : ClosestPosition.Before;
                    }
                    else {
                        return isAfter ? ClosestPosition.Under : ClosestPosition.Upper;
                    }
                }
            }
            if (closestNode.contains.apply(closestNode, __spread(this.dragNodes))) {
                if (isAfter) {
                    return ClosestPosition.InnerAfter;
                }
                return ClosestPosition.InnerBefore;
            }
            else {
                return ClosestPosition.Inner;
            }
        }
        else if (closestNode === closestNode.root) {
            return isAfter ? ClosestPosition.InnerAfter : ClosestPosition.InnerBefore;
        }
        else {
            if (!closestNode.allowSibling(this.dragNodes)) {
                var parentClosestNode = getValidParent(closestNode);
                if (parentClosestNode) {
                    this.closestNode = parentClosestNode;
                }
                if (isInline) {
                    if (parentClosestNode) {
                        if (isAfter) {
                            return ClosestPosition.After;
                        }
                        return ClosestPosition.Before;
                    }
                    return isAfter
                        ? ClosestPosition.ForbidAfter
                        : ClosestPosition.ForbidBefore;
                }
                else {
                    if (parentClosestNode) {
                        if (isAfter) {
                            return ClosestPosition.Under;
                        }
                        return ClosestPosition.Upper;
                    }
                    return isAfter
                        ? ClosestPosition.ForbidUnder
                        : ClosestPosition.ForbidUpper;
                }
            }
            if (isInline) {
                return isAfter ? ClosestPosition.After : ClosestPosition.Before;
            }
            else {
                return isAfter ? ClosestPosition.Under : ClosestPosition.Upper;
            }
        }
    };
    Dragon.prototype.setClosestPosition = function (direction) {
        this.closestDirection = direction;
    };
    /**
     * ??????????????????????????????
     *
     * @readonly
     * @type {TreeNode}
     * @memberof Dragon
     */
    Dragon.prototype.getClosestNode = function (point) {
        var _this = this;
        var _a, _b;
        if (this.touchNode) {
            var touchNodeRect = this.viewport.getValidNodeRect(this.touchNode);
            if (!touchNodeRect)
                return;
            if ((_b = (_a = this.touchNode) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.length) {
                var touchDistance = shared_1.calcDistancePointToEdge(point, touchNodeRect);
                var minDistance_1 = touchDistance;
                var minDistanceNode_1 = this.touchNode;
                this.touchNode.eachChildren(function (node) {
                    var rect = _this.viewport.getElementRectById(node.id);
                    if (!rect)
                        return;
                    var distance = shared_1.isPointInRect(point, rect, _this.sensitive)
                        ? 0
                        : shared_1.calcDistanceOfPointToRect(point, rect);
                    if (distance <= minDistance_1) {
                        minDistance_1 = distance;
                        minDistanceNode_1 = node;
                    }
                });
                return minDistanceNode_1;
            }
            else {
                return this.touchNode;
            }
        }
        return null;
    };
    Dragon.prototype.setClosestNode = function (node) {
        this.closestNode = node;
    };
    /**
     * ??????????????????????????????????????????
     *
     * @readonly
     * @type {DOMRect}
     * @memberof Dragon
     */
    Dragon.prototype.getClosestRect = function () {
        var closestNode = this.closestNode;
        var closestDirection = this.closestDirection;
        if (!closestNode || !closestDirection)
            return;
        var closestRect = this.viewport.getValidNodeRect(closestNode);
        if (closestDirection === ClosestPosition.InnerAfter ||
            closestDirection === ClosestPosition.InnerBefore) {
            return this.viewport.getChildrenRect(closestNode);
        }
        else {
            return closestRect;
        }
    };
    Dragon.prototype.setClosestRect = function (rect) {
        this.closestRect = rect;
    };
    Dragon.prototype.getClosestOffsetRect = function () {
        var closestNode = this.closestNode;
        var closestDirection = this.closestDirection;
        if (!closestNode || !closestDirection)
            return;
        var closestRect = this.viewport.getValidNodeOffsetRect(closestNode);
        if (closestDirection === ClosestPosition.InnerAfter ||
            closestDirection === ClosestPosition.InnerBefore) {
            return this.viewport.getChildrenOffsetRect(closestNode);
        }
        else {
            return closestRect;
        }
    };
    Dragon.prototype.setClosestOffsetRect = function (rect) {
        this.closestOffsetRect = rect;
    };
    Dragon.prototype.setDragNodes = function (dragNodes) {
        if (dragNodes === void 0) { dragNodes = []; }
        this.dragNodes = dragNodes;
        this.trigger(new events_1.DragNodeEvent({
            target: this.operation.tree,
            source: dragNodes,
        }));
    };
    Dragon.prototype.setTouchNode = function (node) {
        this.touchNode = node;
        if (!node) {
            this.closestNode = null;
            this.closestDirection = null;
            this.closestOffsetRect = null;
            this.closestRect = null;
        }
    };
    Dragon.prototype.calculate = function (props) {
        var point = props.point, touchNode = props.touchNode, closestNode = props.closestNode, closestDirection = props.closestDirection;
        this.setTouchNode(touchNode);
        this.closestNode = closestNode || this.getClosestNode(point);
        this.closestDirection = closestDirection || this.getClosestPosition(point);
        this.closestRect = this.getClosestRect();
        this.closestOffsetRect = this.getClosestOffsetRect();
    };
    Dragon.prototype.setDropNode = function (node) {
        this.dropNode = node;
        this.trigger(new events_1.DropNodeEvent({
            target: this.operation.tree,
            source: node,
        }));
    };
    Dragon.prototype.trigger = function (event) {
        if (this.operation) {
            return this.operation.dispatch(event);
        }
    };
    Dragon.prototype.clear = function () {
        this.dragNodes = [];
        this.touchNode = null;
        this.dropNode = null;
        this.closestNode = null;
        this.closestDirection = null;
        this.closestOffsetRect = null;
        this.closestRect = null;
    };
    Dragon.prototype.makeObservable = function () {
        reactive_1.define(this, {
            dragNodes: reactive_1.observable.shallow,
            touchNode: reactive_1.observable.ref,
            closestNode: reactive_1.observable.ref,
            closestDirection: reactive_1.observable.ref,
            closestRect: reactive_1.observable.ref,
            setDragNodes: reactive_1.action,
            setTouchNode: reactive_1.action,
            setDropNode: reactive_1.action,
            setClosestNode: reactive_1.action,
            setClosestPosition: reactive_1.action,
            setClosestOffsetRect: reactive_1.action,
            setClosestRect: reactive_1.action,
            clear: reactive_1.action,
            calculate: reactive_1.action,
        });
    };
    return Dragon;
}());
exports.Dragon = Dragon;
