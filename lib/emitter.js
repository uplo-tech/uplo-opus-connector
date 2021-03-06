"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var FileManagerEmitter = /** @class */ (function (_super) {
    __extends(FileManagerEmitter, _super);
    function FileManagerEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FileManagerEmitter;
}(events_1.EventEmitter));
var emitter = new FileManagerEmitter();
exports.default = emitter;
//# sourceMappingURL=emitter.js.map