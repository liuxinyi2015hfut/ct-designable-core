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
import { CursorType } from '../models';
import { DragStartEvent, DragMoveEvent, DragStopEvent } from '../events';
import { Point } from '@designable/shared';
export var useTranslateEffect = function (engine) {
    var findStartNodeHandler = function (target) {
        var handler = target === null || target === void 0 ? void 0 : target.closest("*[" + engine.props.nodeTranslateAttrName + "]");
        if (handler) {
            var type = handler.getAttribute(engine.props.nodeTranslateAttrName);
            if (type) {
                var element = handler.closest("*[" + engine.props.nodeSelectionIdAttrName + "]");
                if (element) {
                    var nodeId = element.getAttribute(engine.props.nodeSelectionIdAttrName);
                    if (nodeId) {
                        var node = engine.findNodeById(nodeId);
                        if (node) {
                            return { node: node, element: element };
                        }
                    }
                }
            }
        }
        return;
    };
    var store = {};
    engine.subscribeTo(DragStartEvent, function (event) {
        if (engine.cursor.type !== CursorType.Move)
            return;
        var target = event.data.target;
        var data = findStartNodeHandler(target);
        if (data) {
            var point = new Point(event.data.clientX, event.data.clientY);
            store.value = __assign(__assign({}, data), { point: point });
        }
    });
    engine.subscribeTo(DragMoveEvent, function (event) {
        var _a, _b;
        if (engine.cursor.type !== CursorType.Move)
            return;
        if (store.value) {
            var _c = store.value, node = _c.node, element = _c.element, point = _c.point;
            var allowTranslate = node.allowTranslate();
            if (!allowTranslate)
                return;
            var translatable = node.designerProps.translatable;
            var current = new Point(event.data.clientX, event.data.clientY);
            var diffX = current.x - (point === null || point === void 0 ? void 0 : point.x);
            var diffY = current.y - (point === null || point === void 0 ? void 0 : point.y);
            var horizontal = (_a = translatable.x) === null || _a === void 0 ? void 0 : _a.call(translatable, node, element, diffX);
            var vertical = (_b = translatable.y) === null || _b === void 0 ? void 0 : _b.call(translatable, node, element, diffY);
            horizontal.translate();
            vertical.translate();
            store.value.point = current;
        }
    });
    engine.subscribeTo(DragStopEvent, function () {
        if (engine.cursor.type !== CursorType.Move)
            return;
        if (store.value) {
            store.value = null;
        }
    });
};
