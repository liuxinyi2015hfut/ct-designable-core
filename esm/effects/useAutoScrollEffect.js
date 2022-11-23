import { CursorStatus, CursorType } from '../models';
import { DragMoveEvent, DragStartEvent, DragStopEvent } from '../events';
import { calcAutoScrollBasicInfo, scrollAnimate, Point, } from '@designable/shared';
export var useAutoScrollEffect = function (engine) {
    var xScroller = null;
    var yScroller = null;
    var xScrollerAnimationStop = null;
    var yScrollerAnimationStop = null;
    var scrolling = function (point, viewport) {
        if (engine.cursor.status === CursorStatus.Dragging) {
            xScroller = calcAutoScrollBasicInfo(point, 'x', viewport.rect);
            yScroller = calcAutoScrollBasicInfo(point, 'y', viewport.rect);
            if (xScroller) {
                if (xScrollerAnimationStop) {
                    xScrollerAnimationStop();
                }
                xScrollerAnimationStop = scrollAnimate(viewport.scrollContainer, 'x', xScroller.direction, xScroller.speed);
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
                yScrollerAnimationStop = scrollAnimate(viewport.scrollContainer, 'y', yScroller.direction, yScroller.speed);
            }
            else {
                if (yScrollerAnimationStop) {
                    yScrollerAnimationStop();
                }
            }
        }
    };
    engine.subscribeTo(DragStartEvent, function (event) {
        if (engine.cursor.type !== CursorType.Move &&
            engine.cursor.type !== CursorType.Selection)
            return;
        engine.workbench.eachWorkspace(function (workspace) {
            var viewport = workspace.viewport;
            var outline = workspace.outline;
            var point = new Point(event.data.topClientX, event.data.topClientY);
            if (!viewport.isPointInViewport(point) &&
                !outline.isPointInViewport(point))
                return;
            engine.cursor.setDragStartScrollOffset({
                scrollX: viewport.scrollX,
                scrollY: viewport.scrollY,
            });
        });
    });
    engine.subscribeTo(DragMoveEvent, function (event) {
        if (engine.cursor.type !== CursorType.Move &&
            engine.cursor.type !== CursorType.Selection)
            return;
        engine.workbench.eachWorkspace(function (workspace) {
            var viewport = workspace.viewport;
            var outline = workspace.outline;
            var point = new Point(event.data.topClientX, event.data.topClientY);
            if (outline.isPointInViewport(point)) {
                scrolling(point, outline);
            }
            else if (viewport.isPointInViewport(point)) {
                scrolling(point, viewport);
            }
        });
    });
    engine.subscribeTo(DragStopEvent, function () {
        if (engine.cursor.type !== CursorType.Move &&
            engine.cursor.type !== CursorType.Selection)
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
