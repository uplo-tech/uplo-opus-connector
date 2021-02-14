"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MemCache = /** @class */ (function () {
    function MemCache() {
        var _this = this;
        this.get = function (key) {
            if (_this.cacheData.hasOwnProperty(key) && _this.cacheData[key].val) {
                return _this.cacheData[key].val;
            }
            return false;
        };
        this.set = function (key, value, expiry) {
            _this.clear(key);
            var to = false;
            if (expiry && parseInt(expiry) > 0) {
                to = setTimeout(function () {
                    _this.clear(key);
                }, parseInt(expiry));
            }
            _this.cacheData[key] = {
                expiry: expiry,
                val: value,
                timeout: to
            };
        };
        this.clear = function (key) {
            if (_this.cacheData.hasOwnProperty(key)) {
                if (_this.cacheData[key].to) {
                    clearTimeout(_this.cacheData[key].to);
                }
                delete _this.cacheData[key];
                return true;
            }
            return false;
        };
        this.cacheData = {};
    }
    return MemCache;
}());
var newMemCache = new MemCache();
exports.default = newMemCache;
//# sourceMappingURL=cache.js.map