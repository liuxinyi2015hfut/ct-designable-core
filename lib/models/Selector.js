"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = void 0;
var toArray = function (target) {
    return Array.from(target || []);
};
var Selector = /** @class */ (function () {
    function Selector() {
        this.store = new Map();
    }
    Selector.prototype._queryAll = function (target, selector) {
        if (!target)
            return [];
        var results = toArray(target === null || target === void 0 ? void 0 : target.querySelectorAll(selector));
        var cacheKey = selector + '@ALL';
        var caches = this.store.get(cacheKey);
        if (caches) {
            caches.set(target, results);
        }
        else {
            this.store.set(cacheKey, new WeakMap([[target, results]]));
        }
        return results;
    };
    Selector.prototype._query = function (target, selector) {
        if (!target)
            return;
        var results = target === null || target === void 0 ? void 0 : target.querySelector(selector);
        var caches = this.store.get(selector);
        if (caches) {
            caches.set(target, results);
        }
        else {
            this.store.set(selector, new WeakMap([[target, results]]));
        }
        return results;
    };
    Selector.prototype._clean = function (target, key) {
        var caches = this.store.get(key);
        if (caches) {
            caches.delete(target);
        }
    };
    Selector.prototype.queryAll = function (target, selector) {
        var cacheKey = selector + '@ALL';
        var caches = this.store.get(cacheKey);
        var results = { current: null };
        if (caches) {
            results.current = caches.get(target);
            if (Array.isArray(results.current)) {
                if (results.current.length === 0 ||
                    results.current.some(function (node) { return !node.isConnected; })) {
                    this._clean(target, cacheKey);
                    return this._queryAll(target, selector);
                }
                return results.current;
            }
            this._clean(target, cacheKey);
            return this._queryAll(target, selector);
        }
        else {
            return this._queryAll(target, selector);
        }
    };
    Selector.prototype.query = function (target, selector) {
        var caches = this.store.get(selector);
        var results = { current: null };
        if (caches) {
            results.current = caches.get(target);
            if (results.current && !Array.isArray(results.current)) {
                if (!results.current.isConnected) {
                    this._clean(target, selector);
                    return this._query(target, selector);
                }
                return results.current;
            }
            this._clean(target, selector);
            return this._query(target, selector);
        }
        else {
            return this._query(target, selector);
        }
    };
    return Selector;
}());
exports.Selector = Selector;
