"use strict";
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
exports.Operation = void 0;
var TreeNode_1 = require("./TreeNode");
var Selection_1 = require("./Selection");
var Hover_1 = require("./Hover");
var reactive_1 = require("@formily/reactive");
var Dragon_1 = require("./Dragon");
var shared_1 = require("@designable/shared");
var Operation = /** @class */ (function () {
    function Operation(workspace) {
        this.requests = {
            snapshot: null,
        };
        this.engine = workspace.engine;
        this.workspace = workspace;
        this.tree = new TreeNode_1.TreeNode(__assign(__assign({ componentName: this.engine.props.rootComponentName }, this.engine.props.defaultComponentTree), { operation: this }));
        this.selection = new Selection_1.Selection({
            operation: this,
        });
        this.hover = new Hover_1.Hover({
            operation: this,
        });
        this.outlineDragon = new Dragon_1.Dragon({
            operation: this,
            sensitive: false,
            forceBlock: true,
            viewport: this.workspace.outline,
        });
        this.viewportDragon = new Dragon_1.Dragon({
            operation: this,
            viewport: this.workspace.viewport,
        });
        this.selection.select(this.tree);
        this.makeObservable();
    }
    Operation.prototype.dispatch = function (event, callback) {
        if (this.workspace.dispatch(event) === false)
            return;
        if (shared_1.isFn(callback))
            return callback();
    };
    Operation.prototype.getSelectedNodes = function () {
        var _this = this;
        return this.selection.selected.map(function (id) { return _this.tree.findById(id); });
    };
    Operation.prototype.setDragNodes = function (nodes) {
        var dragNodes = nodes.reduce(function (buf, node) {
            var _a;
            if (shared_1.isFn((_a = node === null || node === void 0 ? void 0 : node.designerProps) === null || _a === void 0 ? void 0 : _a.getDragNodes)) {
                var transformed = node.designerProps.getDragNodes(node);
                return transformed ? buf.concat(transformed) : buf;
            }
            if (node.componentName === '$$ResourceNode$$')
                return buf.concat(node.children);
            return buf.concat([node]);
        }, []);
        this.outlineDragon.setDragNodes(dragNodes);
        this.viewportDragon.setDragNodes(dragNodes);
    };
    Operation.prototype.getDragNodes = function () {
        var _a;
        if ((_a = this.outlineDragon.dragNodes) === null || _a === void 0 ? void 0 : _a.length) {
            return this.outlineDragon.dragNodes;
        }
        return this.viewportDragon.dragNodes;
    };
    Operation.prototype.getDropNodes = function (parent) {
        var dragNodes = this.getDragNodes();
        return dragNodes.reduce(function (buf, node) {
            var _a;
            if (shared_1.isFn((_a = node.designerProps) === null || _a === void 0 ? void 0 : _a.getDropNodes)) {
                var cloned = node.isSourceNode ? node.clone(node.parent) : node;
                var transformed = node.designerProps.getDropNodes(cloned, parent);
                return transformed ? buf.concat(transformed) : buf;
            }
            if (node.componentName === '$$ResourceNode$$')
                return buf.concat(node.children);
            return buf.concat([node]);
        }, []);
    };
    Operation.prototype.getClosestNode = function () {
        return this.viewportDragon.closestNode || this.outlineDragon.closestNode;
    };
    Operation.prototype.getClosestPosition = function () {
        return (this.viewportDragon.closestDirection ||
            this.outlineDragon.closestDirection);
    };
    Operation.prototype.setTouchNode = function (node) {
        this.outlineDragon.setTouchNode(node);
        this.viewportDragon.setTouchNode(node);
    };
    Operation.prototype.dragWith = function (point, touchNode) {
        var viewport = this.workspace.viewport;
        var outline = this.workspace.outline;
        if (outline.isPointInViewport(point, false)) {
            this.outlineDragon.calculate({
                point: point,
                touchNode: touchNode || this.tree,
            });
            this.viewportDragon.calculate({
                touchNode: touchNode || this.tree,
                closestNode: this.outlineDragon.closestNode,
                closestDirection: this.outlineDragon.closestDirection,
            });
        }
        else if (viewport.isPointInViewport(point, false)) {
            this.viewportDragon.calculate({
                point: point,
                touchNode: touchNode || this.tree,
            });
            this.outlineDragon.calculate({
                touchNode: touchNode || this.tree,
                closestNode: this.viewportDragon.closestNode,
                closestDirection: this.viewportDragon.closestDirection,
            });
        }
        else {
            this.setTouchNode(null);
        }
    };
    Operation.prototype.dragClean = function () {
        this.outlineDragon.clear();
        this.viewportDragon.clear();
    };
    Operation.prototype.getTouchNode = function () {
        return this.outlineDragon.touchNode || this.viewportDragon.touchNode;
    };
    Operation.prototype.setDropNode = function (node) {
        this.outlineDragon.setDropNode(node);
        this.viewportDragon.setDropNode(node);
    };
    Operation.prototype.getDropNode = function () {
        return this.outlineDragon.dropNode || this.viewportDragon.dropNode;
    };
    Operation.prototype.removeNodes = function (nodes) {
        for (var i = nodes.length - 1; i >= 0; i--) {
            var node = nodes[i];
            if (node.allowDelete()) {
                var previous = node.previous;
                var next = node.next;
                node.remove();
                this.selection.select(previous ? previous : next ? next : node.parent);
                this.hover.clear();
            }
        }
    };
    Operation.prototype.sortNodes = function (nodes) {
        return nodes.sort(function (before, after) {
            if (before.depth !== after.depth)
                return 0;
            return before.index - after.index >= 0 ? 1 : -1;
        });
    };
    Operation.prototype.cloneNodes = function (nodes) {
        var _this = this;
        var groups = {};
        var lastGroupNode = {};
        var filterNestedNode = this.sortNodes(nodes).filter(function (node) {
            return !nodes.some(function (parent) {
                return node.isMyParents(parent);
            });
        });
        shared_1.each(filterNestedNode, function (node) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (node === node.root)
                return;
            if (!node.allowClone())
                return;
            groups[(_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.id] = groups[(_b = node === null || node === void 0 ? void 0 : node.parent) === null || _b === void 0 ? void 0 : _b.id] || [];
            groups[(_c = node === null || node === void 0 ? void 0 : node.parent) === null || _c === void 0 ? void 0 : _c.id].push(node);
            if (lastGroupNode[(_d = node === null || node === void 0 ? void 0 : node.parent) === null || _d === void 0 ? void 0 : _d.id]) {
                if (node.index > lastGroupNode[(_e = node === null || node === void 0 ? void 0 : node.parent) === null || _e === void 0 ? void 0 : _e.id].index) {
                    lastGroupNode[(_f = node === null || node === void 0 ? void 0 : node.parent) === null || _f === void 0 ? void 0 : _f.id] = node;
                }
            }
            else {
                lastGroupNode[(_g = node === null || node === void 0 ? void 0 : node.parent) === null || _g === void 0 ? void 0 : _g.id] = node;
            }
        });
        var parents = new Map();
        shared_1.each(groups, function (nodes, parentId) {
            var lastNode = lastGroupNode[parentId];
            var insertPoint = lastNode;
            shared_1.each(nodes, function (node) {
                var cloned = node.clone();
                if (!cloned)
                    return;
                if (_this.selection.has(node) &&
                    insertPoint.parent.allowAppend([cloned])) {
                    insertPoint.insertAfter(cloned);
                    insertPoint = insertPoint.next;
                }
                else if (_this.selection.length === 1) {
                    var targetNode = _this.tree.findById(_this.selection.first);
                    var cloneNodes = parents.get(targetNode);
                    if (!cloneNodes) {
                        cloneNodes = [];
                        parents.set(targetNode, cloneNodes);
                    }
                    if (targetNode && targetNode.allowAppend([cloned])) {
                        cloneNodes.push(cloned);
                    }
                }
            });
        });
        parents.forEach(function (nodes, target) {
            if (!nodes.length)
                return;
            target.append.apply(target, __spread(nodes));
        });
    };
    Operation.prototype.makeObservable = function () {
        reactive_1.define(this, {
            hover: reactive_1.observable.ref,
            removeNodes: reactive_1.action,
            cloneNodes: reactive_1.action,
        });
    };
    Operation.prototype.snapshot = function (type) {
        var _this = this;
        shared_1.cancelIdle(this.requests.snapshot);
        if (!this.workspace ||
            !this.workspace.history ||
            this.workspace.history.locking)
            return;
        this.requests.snapshot = shared_1.requestIdle(function () {
            _this.workspace.history.push(type);
        });
    };
    Operation.prototype.from = function (operation) {
        if (!operation)
            return;
        if (operation.tree) {
            this.tree.from(operation.tree);
        }
        if (operation.selected) {
            this.selection.selected = operation.selected;
        }
    };
    Operation.prototype.serialize = function () {
        return {
            tree: this.tree.serialize(),
            selected: [this.tree.id],
        };
    };
    return Operation;
}());
exports.Operation = Operation;
