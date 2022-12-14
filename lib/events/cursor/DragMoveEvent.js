"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragMoveEvent = void 0;
var AbstractCursorEvent_1 = require("./AbstractCursorEvent");
var DragMoveEvent = /** @class */ (function (_super) {
    __extends(DragMoveEvent, _super);
    function DragMoveEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'drag:move';
        return _this;
    }
    return DragMoveEvent;
}(AbstractCursorEvent_1.AbstractCursorEvent));
exports.DragMoveEvent = DragMoveEvent;
