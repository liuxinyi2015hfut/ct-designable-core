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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResizeEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var shared_1 = require("@designable/shared");
var useResizeEffect = function (engine) {
    var findStartNodeHandler = function (target) {
        var handler = target === null || target === void 0 ? void 0 : target.closest("*[" + engine.props.nodeResizeHandlerAttrName + "]");
        if (handler) {
            var type = handler.getAttribute(engine.props.nodeResizeHandlerAttrName);
            if (type) {
                var element = handler.closest("*[" + engine.props.nodeSelectionIdAttrName + "]");
                if (element) {
                    var nodeId = element.getAttribute(engine.props.nodeSelectionIdAttrName);
                    if (nodeId) {
                        var node = engine.findNodeById(nodeId);
                        if (node) {
                            var axis = type.includes('x') ? 'x' : 'y';
                            return { axis: axis, type: type, node: node, element: element };
                        }
                    }
                }
            }
        }
        return;
    };
    var store = {};
    engine.subscribeTo(events_1.DragStartEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        var target = event.data.target;
        var data = findStartNodeHandler(target);
        if (data) {
            var point = new shared_1.Point(event.data.clientX, event.data.clientY);
            store.value = __assign(__assign({}, data), { point: point });
            if (data.axis === 'x') {
                engine.cursor.setStyle('ew-resize');
            }
            else if (data.axis === 'y') {
                engine.cursor.setStyle('ns-resize');
            }
        }
    });
    engine.subscribeTo(events_1.DragMoveEvent, function (event) {
        var _a, _b;
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        if (store.value) {
            var _c = store.value, axis = _c.axis, type = _c.type, node = _c.node, element = _c.element, point = _c.point;
            var allowResize = node.allowResize();
            if (!allowResize)
                return;
            var resizable = node.designerProps.resizable;
            var rect = element.getBoundingClientRect();
            var current = new shared_1.Point(event.data.clientX, event.data.clientY);
            var plusX = type === 'x-end' ? current.x > point.x : current.x < point.x;
            var plusY = type === 'y-end' ? current.y > point.y : current.y < point.y;
            var allowX = allowResize.includes('x');
            var allowY = allowResize.includes('y');
            var width = (_a = resizable.width) === null || _a === void 0 ? void 0 : _a.call(resizable, node, element);
            var height = (_b = resizable.height) === null || _b === void 0 ? void 0 : _b.call(resizable, node, element);
            if (axis === 'x') {
                if (plusX && type === 'x-end' && current.x < rect.x + rect.width)
                    return;
                if (!plusX && type === 'x-end' && current.x > rect.x + rect.width)
                    return;
                if (plusX && type === 'x-start' && current.x > rect.x)
                    return;
                if (!plusX && type === 'x-start' && current.x < rect.x)
                    return;
                if (allowX) {
                    if (plusX) {
                        width.plus();
                    }
                    else {
                        width.minus();
                    }
                }
            }
            else if (axis === 'y') {
                if (plusY && type === 'y-end' && current.y < rect.y + rect.height)
                    return;
                if (!plusY && type === 'y-end' && current.y > rect.y + rect.height)
                    return;
                if (plusY && type === 'y-start' && current.y > rect.y)
                    return;
                if (!plusY && type === 'y-start' && current.y < rect.y)
                    return;
                if (allowY) {
                    if (plusY) {
                        height.plus();
                    }
                    else {
                        height.minus();
                    }
                }
            }
            store.value.point = current;
        }
    });
    engine.subscribeTo(events_1.DragStopEvent, function () {
        if (engine.cursor.type !== models_1.CursorType.Move)
            return;
        if (store.value) {
            store.value = null;
            engine.cursor.setStyle('');
        }
    });
};
exports.useResizeEffect = useResizeEffect;
