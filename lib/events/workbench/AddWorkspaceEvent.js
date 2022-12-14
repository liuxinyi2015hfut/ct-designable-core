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
exports.AddWorkspaceEvent = void 0;
var AbstractWorkspaceEvent_1 = require("./AbstractWorkspaceEvent");
var AddWorkspaceEvent = /** @class */ (function (_super) {
    __extends(AddWorkspaceEvent, _super);
    function AddWorkspaceEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'add:workspace';
        return _this;
    }
    return AddWorkspaceEvent;
}(AbstractWorkspaceEvent_1.AbstractWorkspaceEvent));
exports.AddWorkspaceEvent = AddWorkspaceEvent;
