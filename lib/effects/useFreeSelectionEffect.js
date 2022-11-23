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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFreeSelectionEffect = void 0;
var events_1 = require("../events");
var models_1 = require("../models");
var shared_1 = require("@designable/shared");
var useFreeSelectionEffect = function (engine) {
    engine.subscribeTo(events_1.DragStopEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Selection)
            return;
        engine.workbench.eachWorkspace(function (workspace) {
            var viewport = workspace.viewport;
            var dragStartPoint = new shared_1.Point(engine.cursor.dragStartPosition.topClientX, engine.cursor.dragStartPosition.topClientY);
            var dragStartOffsetPoint = viewport.getOffsetPoint(new shared_1.Point(engine.cursor.dragStartPosition.topClientX, engine.cursor.dragStartPosition.topClientY));
            var dragEndOffsetPoint = viewport.getOffsetPoint(new shared_1.Point(engine.cursor.position.topClientX, engine.cursor.position.topClientY));
            if (!viewport.isPointInViewport(dragStartPoint, false))
                return;
            var tree = workspace.operation.tree;
            var selectionRect = shared_1.calcRectByStartEndPoint(dragStartOffsetPoint, dragEndOffsetPoint, viewport.scrollX - engine.cursor.dragStartScrollOffset.scrollX, viewport.scrollY - engine.cursor.dragStartScrollOffset.scrollY);
            var selected = [];
            tree.eachChildren(function (node) {
                var nodeRect = viewport.getValidNodeOffsetRect(node);
                if (nodeRect && shared_1.isCrossRectInRect(selectionRect, nodeRect)) {
                    selected.push([node, nodeRect]);
                }
            });
            var selectedNodes = selected.reduce(function (buf, _a) {
                var _b = __read(_a, 2), node = _b[0], nodeRect = _b[1];
                if (shared_1.isRectInRect(nodeRect, selectionRect)) {
                    if (selected.some(function (_a) {
                        var _b = __read(_a, 1), selectNode = _b[0];
                        return selectNode.isMyParents(node);
                    })) {
                        return buf;
                    }
                }
                return buf.concat(node);
            }, []);
            workspace.operation.selection.batchSafeSelect(selectedNodes);
        });
        engine.cursor.setType(models_1.CursorType.Move);
    });
};
exports.useFreeSelectionEffect = useFreeSelectionEffect;
