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
exports.UpdateChildrenEvent = void 0;
var AbstractMutationNodeEvent_1 = require("./AbstractMutationNodeEvent");
var UpdateChildrenEvent = /** @class */ (function (_super) {
    __extends(UpdateChildrenEvent, _super);
    function UpdateChildrenEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'update:children';
        return _this;
    }
    return UpdateChildrenEvent;
}(AbstractMutationNodeEvent_1.AbstractMutationNodeEvent));
exports.UpdateChildrenEvent = UpdateChildrenEvent;
