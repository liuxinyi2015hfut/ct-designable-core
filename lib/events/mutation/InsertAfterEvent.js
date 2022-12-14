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
exports.InsertAfterEvent = void 0;
var AbstractMutationNodeEvent_1 = require("./AbstractMutationNodeEvent");
var InsertAfterEvent = /** @class */ (function (_super) {
    __extends(InsertAfterEvent, _super);
    function InsertAfterEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'insert:after';
        return _this;
    }
    return InsertAfterEvent;
}(AbstractMutationNodeEvent_1.AbstractMutationNodeEvent));
exports.InsertAfterEvent = InsertAfterEvent;
