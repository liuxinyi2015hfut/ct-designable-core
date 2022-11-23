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
exports.useDragDropEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var shared_1 = require("@designable/shared");
var useDragDropEffect = function (engine) {
    engine.subscribeTo(events_1.DragStartEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        var target = event.data.target;
        var el = target === null || target === void 0 ? void 0 : target.closest("\n       *[" + engine.props.nodeIdAttrName + "],\n       *[" + engine.props.sourceIdAttrName + "],\n       *[" + engine.props.outlineNodeIdAttrName + "]\n      ");
        var handler = target === null || target === void 0 ? void 0 : target.closest("*[" + engine.props.nodeDragHandlerAttrName + "]");
        var helper = handler === null || handler === void 0 ? void 0 : handler.closest("*[" + engine.props.nodeSelectionIdAttrName + "]");
        if (!(el === null || el === void 0 ? void 0 : el.getAttribute) && !handler)
            return;
        var sourceId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.sourceIdAttrName);
        var outlineId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.outlineNodeIdAttrName);
        var handlerId = helper === null || helper === void 0 ? void 0 : helper.getAttribute(engine.props.nodeSelectionIdAttrName);
        var nodeId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.nodeIdAttrName);
        engine.workbench.eachWorkspace(function (currentWorkspace) {
            var operation = currentWorkspace.operation;
            if (nodeId || outlineId || handlerId) {
                var node_1 = engine.findNodeById(outlineId || nodeId || handlerId);
                if (node_1) {
                    if (!node_1.allowDrag())
                        return;
                    if (node_1 === node_1.root)
                        return;
                    var validSelected = engine
                        .getAllSelectedNodes()
                        .filter(function (node) { return node.allowDrag(); });
                    if (validSelected.some(function (selectNode) { return selectNode === node_1; })) {
                        operation.setDragNodes(operation.sortNodes(validSelected));
                    }
                    else {
                        operation.setDragNodes([node_1]);
                    }
                }
            }
            else if (sourceId) {
                var sourceNode = engine.findNodeById(sourceId);
                if (sourceNode) {
                    if (!sourceNode.allowDrag())
                        return;
                    operation.setDragNodes([sourceNode]);
                }
            }
        });
        engine.cursor.setStyle('move');
    });
    engine.subscribeTo(events_1.DragMoveEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        var target = event.data.target;
        var el = target === null || target === void 0 ? void 0 : target.closest("\n      *[" + engine.props.nodeIdAttrName + "],\n      *[" + engine.props.outlineNodeIdAttrName + "]\n    ");
        var nodeId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.nodeIdAttrName);
        var outlineId = el === null || el === void 0 ? void 0 : el.getAttribute(engine.props.outlineNodeIdAttrName);
        engine.workbench.eachWorkspace(function (currentWorkspace) {
            var operation = currentWorkspace.operation;
            var tree = operation.tree;
            var point = new shared_1.Point(event.data.topClientX, event.data.topClientY);
            var dragNodes = operation.getDragNodes();
            if (!dragNodes.length)
                return;
            var touchNode = tree.findById(outlineId || nodeId);
            operation.dragWith(point, touchNode);
        });
    });
    engine.subscribeTo(events_1.ViewportScrollEvent, function (event) {
        var _a, _b;
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        var point = new shared_1.Point(engine.cursor.position.topClientX, engine.cursor.position.topClientY);
        var currentWorkspace = (_a = event === null || event === void 0 ? void 0 : event.context) === null || _a === void 0 ? void 0 : _a.workspace;
        if (!currentWorkspace)
            return;
        var operation = currentWorkspace.operation;
        if (!((_b = operation.getDragNodes()) === null || _b === void 0 ? void 0 : _b.length))
            return;
        var tree = operation.tree;
        var viewport = currentWorkspace.viewport;
        var outline = currentWorkspace.outline;
        var viewportTarget = viewport.elementFromPoint(point);
        var outlineTarget = outline.elementFromPoint(point);
        var viewportNodeElement = viewportTarget === null || viewportTarget === void 0 ? void 0 : viewportTarget.closest("\n      *[" + engine.props.nodeIdAttrName + "],\n      *[" + engine.props.outlineNodeIdAttrName + "]\n    ");
        var outlineNodeElement = outlineTarget === null || outlineTarget === void 0 ? void 0 : outlineTarget.closest("\n    *[" + engine.props.nodeIdAttrName + "],\n    *[" + engine.props.outlineNodeIdAttrName + "]\n  ");
        var nodeId = viewportNodeElement === null || viewportNodeElement === void 0 ? void 0 : viewportNodeElement.getAttribute(engine.props.nodeIdAttrName);
        var outlineNodeId = outlineNodeElement === null || outlineNodeElement === void 0 ? void 0 : outlineNodeElement.getAttribute(engine.props.outlineNodeIdAttrName);
        var touchNode = tree.findById(outlineNodeId || nodeId);
        operation.dragWith(point, touchNode);
    });
    engine.subscribeTo(events_1.DragStopEvent, function () {
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        engine.workbench.eachWorkspace(function (currentWorkspace) {
            var operation = currentWorkspace.operation;
            var dragNodes = operation.getDragNodes();
            var closestNode = operation.getClosestNode();
            var closestDirection = operation.getClosestPosition();
            var selection = operation.selection;
            if (!dragNodes.length)
                return;
            if (dragNodes.length && closestNode && closestDirection) {
                if (closestDirection === models_1.ClosestPosition.After ||
                    closestDirection === models_1.ClosestPosition.Under) {
                    if (closestNode.allowSibling(dragNodes)) {
                        selection.batchSafeSelect(closestNode.insertAfter.apply(closestNode, __spread(operation.getDropNodes(closestNode.parent))));
                    }
                }
                else if (closestDirection === models_1.ClosestPosition.Before ||
                    closestDirection === models_1.ClosestPosition.Upper) {
                    if (closestNode.allowSibling(dragNodes)) {
                        selection.batchSafeSelect(closestNode.insertBefore.apply(closestNode, __spread(operation.getDropNodes(closestNode.parent))));
                    }
                }
                else if (closestDirection === models_1.ClosestPosition.Inner ||
                    closestDirection === models_1.ClosestPosition.InnerAfter) {
                    if (closestNode.allowAppend(dragNodes)) {
                        selection.batchSafeSelect(closestNode.append.apply(closestNode, __spread(operation.getDropNodes(closestNode))));
                        operation.setDropNode(closestNode);
                    }
                }
                else if (closestDirection === models_1.ClosestPosition.InnerBefore) {
                    if (closestNode.allowAppend(dragNodes)) {
                        selection.batchSafeSelect(closestNode.prepend.apply(closestNode, __spread(operation.getDropNodes(closestNode))));
                        operation.setDropNode(closestNode);
                    }
                }
            }
            operation.dragClean();
        });
        engine.cursor.setStyle('');
    });
};
exports.useDragDropEffect = useDragDropEffect;
