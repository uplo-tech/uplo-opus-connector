"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = __importDefault(require("../cache"));
var testKey = 'key';
var testValue = 'test';
test('can set and get a kv pair', function () {
    cache_1.default.set(testKey, testValue);
    expect(cache_1.default.get(testKey)).toBe(testValue);
});
test('can delete a kv pair', function () {
    cache_1.default.set(testKey, testValue);
    expect(cache_1.default.get(testKey)).toBe(testValue);
    cache_1.default.clear(testKey);
    expect(cache_1.default.get(testKey)).toBe(false);
});
test('can expire a kv pair', function () {
    jest.useFakeTimers();
    cache_1.default.set(testKey, testValue, 10000);
    expect(cache_1.default.get(testKey)).toBe(testValue);
    jest.advanceTimersByTime(11000);
    expect(cache_1.default.get(testKey)).toBe(false);
});
//# sourceMappingURL=cache.test.js.map