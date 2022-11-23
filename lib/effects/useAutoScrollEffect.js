"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoScrollEffect = void 0;
var models_1 = require("../models");
var events_1 = require("../events");
var shared_1 = require("@designable/shared");
var useAutoScrollEffect = function (engine) {
    var xScroller = null;
    var yScroller = null;
    var xScrollerAnimationStop = null;
    var yScrollerAnimationStop = null;
    var scrolling = function (point, viewport) {
        if (engine.cursor.status === models_1.CursorStatus.Dragging) {
            xScroller = shared_1.calcAutoScrollBasicInfo(point, 'x', viewport.rect);
            yScroller = shared_1.calcAutoScrollBasicInfo(point, 'y', viewport.rect);
            if (xScroller) {
                if (xScrollerAnimationStop) {
                    xScrollerAnimationStop();
                }
                xScrollerAnimationStop = shared_1.scrollAnimate(viewport.scrollContainer, 'x', xScroller.direction, xScroller.speed);
            }
            else {
                if (xScrollerAnimationStop) {
                    xScrollerAnimationStop();
                }
            }
            if (yScroller) {
                if (yScrollerAnimationStop) {
                    yScrollerAnimationStop();
                }
                yScrollerAnimationStop = shared_1.scrollAnimate(viewport.scrollContainer, 'y', yScroller.direction, yScroller.speed);
            }
            else {
                if (yScrollerAnimationStop) {
                    yScrollerAnimationStop();
                }
            }
        }
    };
    engine.subscribeTo(events_1.DragStartEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Move &&
            engine.cursor.type !== models_1.CursorType.Selection)
            return;
        engine.workbench.eachWorkspace(function (workspace) {
            var viewport = workspace.viewport;
            var outline = workspace.outline;
            var point = new shared_1.Point(event.data.topClientX, event.data.topClientY);
            if (!viewport.isPointInViewport(point) &&
                !outline.isPointInViewport(point))
                return;
            engine.cursor.setDragStartScrollOffset({
                scrollX: viewport.scrollX,
                scrollY: viewport.scrollY,
            });
        });
    });
    engine.subscribeTo(events_1.DragMoveEvent, function (event) {
        if (engine.cursor.type !== models_1.CursorType.Move &&
            engine.cursor.type !== models_1.CursorType.Selection)
            return;
        engine.workbench.eachWorkspace(function (workspace) {
            var viewport = workspace.viewport;
            var outline = workspace.outline;
            var point = new shared_1.Point(event.data.topClientX, event.data.topClientY);
            if (outline.isPointInViewport(point)) {
                scrolling(point, outline);
            }
            else if (viewport.isPointInViewport(point)) {
                scrolling(point, viewport);
            }
        });
    });
    engine.subscribeTo(events_1.DragStopEvent, function () {
        if (engine.cursor.type !== models_1.CursorType.Move &&
            engine.cursor.type !== models_1.CursorType.Selection)
            return;
        xScroller = null;
        yScroller = null;
        if (xScrollerAnimationStop) {
            xScrollerAnimationStop();
        }
        if (yScrollerAnimationStop) {
            yScrollerAnimationStop();
        }
    });
};
exports.useAutoScrollEffect = useAutoScrollEffect;
