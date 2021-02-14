"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function addNotification(notifications, id, props) {
    var index = lodash_1.findIndex(notifications, function (o) { return o.id === id; });
    if (index !== -1) {
        console.error("Can't add notification: " + id + " already exists");
        return notifications;
    }
    return notifications.concat([__assign({ id: id, children: props.children || [] }, props)]);
}
function updateNotification(notifications, id, props) {
    return notifications.map(function (o) {
        if (o.id !== id) {
            return o;
        }
        return lodash_1.extend({}, o, props);
    });
}
function getNotification(notifications, id) {
    return lodash_1.find(notifications, function (o) { return o.id === id; });
}
function removeNotification(notifications, id) {
    return notifications.filter(function (o) { return o.id !== id; });
}
function addChild(notificationChildren, id, element) {
    return notificationChildren.concat([{ id: id, element: element }]);
}
function removeChild(notificationChildren, id) {
    return notificationChildren.filter(function (o) { return o.id !== id; });
}
function updateChild(notificationChildren, id, element) {
    return notificationChildren.map(function (o) {
        if (o.id !== id) {
            return o;
        }
        return lodash_1.extend({}, o, __assign({ id: id }, element));
    });
}
function getChild(notificationChildren, id) {
    return lodash_1.find(notificationChildren, function (o) { return o.id === id; });
}
exports.default = {
    addNotification: addNotification,
    updateNotification: updateNotification,
    removeNotification: removeNotification,
    getNotification: getNotification,
    addChild: addChild,
    removeChild: removeChild,
    updateChild: updateChild,
    getChild: getChild
};
//# sourceMappingURL=notifications.js.map