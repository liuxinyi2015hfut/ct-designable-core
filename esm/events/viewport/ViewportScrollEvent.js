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
import { AbstractViewportEvent } from './AbstractViewportEvent';
var ViewportScrollEvent = /** @class */ (function (_super) {
    __extends(ViewportScrollEvent, _super);
    function ViewportScrollEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'viewport:scroll';
        return _this;
    }
    return ViewportScrollEvent;
}(AbstractViewportEvent));
export { ViewportScrollEvent };
