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
exports.PrependNodeEvent = void 0;
var AbstractMutationNodeEvent_1 = require("./AbstractMutationNodeEvent");
var PrependNodeEvent = /** @class */ (function (_super) {
    __extends(PrependNodeEvent, _super);
    function PrependNodeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'prepend:node';
        return _this;
    }
    return PrependNodeEvent;
}(AbstractMutationNodeEvent_1.AbstractMutationNodeEvent));
exports.PrependNodeEvent = PrependNodeEvent;
