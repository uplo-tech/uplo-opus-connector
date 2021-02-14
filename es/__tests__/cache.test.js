import cache from '../cache';
var testKey = 'key';
var testValue = 'test';
test('can set and get a kv pair', function () {
    cache.set(testKey, testValue);
    expect(cache.get(testKey)).toBe(testValue);
});
test('can delete a kv pair', function () {
    cache.set(testKey, testValue);
    expect(cache.get(testKey)).toBe(testValue);
    cache.clear(testKey);
    expect(cache.get(testKey)).toBe(false);
});
test('can expire a kv pair', function () {
    jest.useFakeTimers();
    cache.set(testKey, testValue, 10000);
    expect(cache.get(testKey)).toBe(testValue);
    jest.advanceTimersByTime(11000);
    expect(cache.get(testKey)).toBe(false);
});
//# sourceMappingURL=cache.test.js.map