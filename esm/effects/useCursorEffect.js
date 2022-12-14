import { CursorStatus } from '../models';
import { MouseMoveEvent, DragStartEvent, DragMoveEvent, DragStopEvent, } from '../events';
import { requestIdle } from '@designable/shared';
export var useCursorEffect = function (engine) {
    engine.subscribeTo(MouseMoveEvent, function (event) {
        engine.cursor.setStatus(engine.cursor.status === CursorStatus.Dragging ||
            engine.cursor.status === CursorStatus.DragStart
            ? engine.cursor.status
            : CursorStatus.Normal);
        engine.cursor.setPosition(event.data);
    });
    engine.subscribeTo(DragStartEvent, function (event) {
        engine.cursor.setStatus(CursorStatus.DragStart);
        engine.cursor.setDragStartPosition(event.data);
    });
    engine.subscribeTo(DragMoveEvent, function () {
        engine.cursor.setStatus(CursorStatus.Dragging);
    });
    engine.subscribeTo(DragStopEvent, function (event) {
        engine.cursor.setStatus(CursorStatus.DragStop);
        engine.cursor.setDragEndPosition(event.data);
        requestIdle(function () {
            engine.cursor.setStatus(CursorStatus.Normal);
        });
    });
    engine.subscribeTo(MouseMoveEvent, function (event) {
        var _a, _b;
        var currentWorkspace = (_a = event === null || event === void 0 ? void 0 : event.context) === null || _a === void 0 ? void 0 : _a.workspace;
        if (!currentWorkspace)
            return;
        var operation = currentWorkspace.operation;
        if (engine.cursor.status !== CursorStatus.Normal) {
            operation.hover.clear();
            return;
        }
        var target = event.data.target;
        var el = (_b = target === null || target === void 0 ? void 0 : target.closest) === null || _b === void 0 ? void 0 : _b.call(target, "\n      *[" + engine.props.nodeIdAttrName + "],\n      *[" + engine.props.outlineNodeIdAttrName + "]\n    ");
        if (!(el === null || el === void 0 ? void 0 : el.getAttribute)) {
            return;
        }
        var nodeId = el.getAttribute(engine.props.nodeIdAttrName);
        var outlineNodeId = el.getAttribute(engine.props.outlineNodeIdAttrName);
        var node = operation.tree.findById(nodeId || outlineNodeId);
        if (node) {
            operation.hover.setHover(node);
        }
        else {
            operation.hover.clear();
        }
    });
};
