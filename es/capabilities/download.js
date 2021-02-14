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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import getMess from '../translations';
import emitter from '../emitter';
import nanoid from 'nanoid';
import iconsSvg from '../icons-svg';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import api from '../api';
import { saveLocalFile } from '../utils/download';
import { getDownloadParams } from '../uplo-utils';
var path = require('path');
var label = 'download';
function handler(apiOptions, actions) {
    return __awaiter(this, void 0, void 0, function () {
        var updateNotifications, getSelectedResources, getNotifications, getMessage, notificationId, notificationChildId, onFail, downloadPath, resources, res, params, p, result, dir_1, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateNotifications = actions.updateNotifications, getSelectedResources = actions.getSelectedResources, getNotifications = actions.getNotifications;
                    getMessage = getMess.bind(null, apiOptions.locale);
                    notificationId = label;
                    notificationChildId = nanoid();
                    onFail = function (err) { return console.log('Failed to download:', err); };
                    downloadPath = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    resources = getSelectedResources();
                    return [4 /*yield*/, saveLocalFile(resources.length > 1 ? 'Multi Download Will Save With Original Filenames' : resources[0].title)];
                case 2:
                    downloadPath = _a.sent();
                    if (!(resources.length === 1)) return [3 /*break*/, 4];
                    res = resources[0];
                    params = getDownloadParams(res);
                    p = api.cleanRootFromPath(params.uplopath);
                    return [4 /*yield*/, api.queueDownload(p, downloadPath)];
                case 3:
                    result = _a.sent();
                    console.log('getting download', downloadPath);
                    return [3 /*break*/, 5];
                case 4:
                    dir_1 = path.dirname(downloadPath);
                    resources.forEach(function (r) { return __awaiter(_this, void 0, void 0, function () {
                        var params, downloadPath, p, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    params = getDownloadParams(r);
                                    downloadPath = path.posix.join(dir_1, params.fileName);
                                    p = api.cleanRootFromPath(params.uplopath);
                                    return [4 /*yield*/, api.queueDownload(p, downloadPath)];
                                case 1:
                                    result = _a.sent();
                                    console.log('multi download', result);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    onFail(err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
var updateNotifications = function (apiOptions, actions) { return __awaiter(_this, void 0, void 0, function () {
    var updateNotifications, getSelectedResources, getNotifications, ds, getMessage, itemsDownloading, notifications, notification, oldNotificationsExist, newNotifications_1, notificationExists, n, notificationChildId_1, child, newChild, newChildren_1, newNotifications_2, childElement, notificationChildId, newChildren, newNotification, newNotifications, notifications, notification, multiuploadExists, newNotifications, childrenExists, newNotifications;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateNotifications = actions.updateNotifications, getSelectedResources = actions.getSelectedResources, getNotifications = actions.getNotifications;
                return [4 /*yield*/, api.allDownloads()];
            case 1:
                ds = _a.sent();
                getMessage = getMess.bind(null, apiOptions.locale);
                itemsDownloading = ds.filter(function (x) { return !x.completed; }).length;
                // if more than 5 items downloading, show as one notification
                if (itemsDownloading > 5) {
                    notifications = getNotifications();
                    notification = notifUtils.getNotification(notifications, label);
                    oldNotificationsExist = (notification && notification.children
                        ? notification.children
                        : []).filter(function (c) { return c.element.elementProps.path !== '_multipleitems'; });
                    if (oldNotificationsExist.length > 0) {
                        newNotifications_1 = notifUtils.removeNotification(notifications, label);
                        return [2 /*return*/, updateNotifications(newNotifications_1)];
                    }
                    notificationExists = (notification && notification.children
                        ? notification.children
                        : []).filter(function (c) { return c.element.elementProps.path === '_multipleitems'; });
                    if (notificationExists.length > 0) {
                        n = notificationExists[0];
                        notificationChildId_1 = n.id;
                        child = notifUtils.getChild(notification.children, notificationChildId_1);
                        newChild = __assign({}, child, { element: __assign({}, child.element, { elementProps: __assign({}, child.element.elementProps, { title: itemsDownloading + " Items Downloading", progress: 11 }) }) });
                        newChildren_1 = notifUtils.updateChild(notification.children, notificationChildId_1, newChild);
                        newNotifications_2 = notifUtils.updateNotification(notifications, label, {
                            title: getMessage('downloadingItems', { quantity: itemsDownloading }),
                            children: newChildren_1
                        });
                        return [2 /*return*/, updateNotifications(newNotifications_2)];
                    }
                    childElement = {
                        elementType: 'NotificationProgressItem',
                        elementProps: {
                            title: itemsDownloading + " Items Downloading",
                            path: '_multipleitems',
                            progress: 10,
                            icon: getIcon({ title: 'archive.zip' })
                        }
                    };
                    notificationChildId = nanoid();
                    newChildren = notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
                    newNotification = {
                        title: getMessage('downloadingItems', { quantity: itemsDownloading }),
                        children: newChildren
                    };
                    newNotifications = notification
                        ? notifUtils.updateNotification(notifications, label, newNotification)
                        : notifUtils.addNotification(notifications, label, newNotification);
                    return [2 /*return*/, updateNotifications(newNotifications)];
                }
                else {
                    notifications = getNotifications();
                    notification = notifUtils.getNotification(notifications, label);
                    multiuploadExists = (notification && notification.children
                        ? notification.children
                        : []).filter(function (c) { return c.element.elementProps.path === '_multipleitems'; });
                    // if the multi-items exist, remove it from tree
                    if (multiuploadExists.length > 0) {
                        newNotifications = notifUtils.removeNotification(notifications, label);
                        updateNotifications(newNotifications);
                    }
                    childrenExists = notification && notification.children ? notification.children : [];
                    if (childrenExists.length > ds.length) {
                        newNotifications = notifUtils.removeNotification(notifications, label);
                        updateNotifications(newNotifications);
                    }
                    ds.forEach(function (d) {
                        var notifications = getNotifications();
                        var notification = notifUtils.getNotification(notifications, label);
                        var title = path.basename(d.uplopath);
                        var progress = (d.received / d.length) * 100;
                        var notificationExists = (notification && notification.children
                            ? notification.children
                            : []).filter(function (c) { return c.element.elementProps.path === d.uplopath; });
                        // if the child notification already exists, just update progress
                        if (notificationExists.length > 0) {
                            var n = notificationExists[0];
                            var notificationChildId = n.id;
                            // if the download is completed, remove the notification
                            if (d.completed) {
                                var notificationChildrenCount = notification.children.length;
                                var newNotifications = void 0;
                                if (notificationChildrenCount > 1) {
                                    var newChildren = notifUtils.removeChild(notification.children, notificationChildId);
                                    newNotifications = notifUtils.updateNotification(notifications, label, {
                                        title: newChildren.length > 1
                                            ? getMessage('uploadingItems', { quantity: newChildren.length })
                                            : getMessage('uploadingItem'),
                                        children: newChildren
                                    });
                                }
                                else {
                                    newNotifications = notifUtils.removeNotification(notifications, label);
                                }
                                return updateNotifications(newNotifications);
                            }
                            else {
                                // else update the notification for progress
                                var child = notifUtils.getChild(notification.children, notificationChildId);
                                var newChild = __assign({}, child, { element: __assign({}, child.element, { elementProps: __assign({}, child.element.elementProps, { progress: progress }) }) });
                                var newChildren = notifUtils.updateChild(notification.children, notificationChildId, newChild);
                                var newNotifications = notifUtils.updateNotification(notifications, label, {
                                    children: newChildren
                                });
                                return updateNotifications(newNotifications);
                            }
                        }
                        else {
                            // if we believe the file is done uploading then return
                            if (d.completed) {
                                return;
                            }
                            // otherwise we'll create a new notification
                            var childElement = {
                                elementType: 'NotificationProgressItem',
                                elementProps: {
                                    title: title,
                                    path: d.uplopath,
                                    progress: progress,
                                    icon: getIcon({ title: title })
                                }
                            };
                            var notificationChildId = nanoid();
                            var newChildren = notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
                            var newNotification = {
                                title: newChildren.length > 1
                                    ? getMessage('downloadingItems', { quantity: newChildren.length })
                                    : getMessage('downloadingItem'),
                                children: newChildren
                            };
                            var newNotifications = notification
                                ? notifUtils.updateNotification(notifications, label, newNotification)
                                : notifUtils.addNotification(notifications, label, newNotification);
                            return updateNotifications(newNotifications);
                        }
                    });
                    // // create notification
                    // ds.forEach(d => {
                    //   const notifications = getNotifications()
                    //   const notification = notifUtils.getNotification(notifications, label)
                    //   const title = path.basename(d.uplopath)
                    //   const progress = (d.received / d.length) * 100
                    //   const notificationExists = (notification && notification.children
                    //     ? notification.children
                    //     : []
                    //   ).filter(c => c.element.elementProps.path === d.uplopath)
                    //   // if the child notification already exists, just update progress
                    //   if (notificationExists.length > 0) {
                    //     const n = notificationExists[0]
                    //     const notificationChildId = n.id
                    //     // if the download is completed, remove the notification
                    //     if (d.completed) {
                    //       const notificationChildrenCount = notification.children.length
                    //       let newNotifications
                    //       if (notificationChildrenCount > 1) {
                    //         newNotifications = notifUtils.updateNotification(notifications, label, {
                    //           children: notifUtils.removeChild(notification.children, notificationChildId)
                    //         })
                    //       } else {
                    //         newNotifications = notifUtils.removeNotification(notifications, label)
                    //       }
                    //       return updateNotifications(newNotifications)
                    //     } else {
                    //       // else update the notification for progress
                    //       const child = notifUtils.getChild(notification.children, notificationChildId)
                    //       const newChild = {
                    //         ...child,
                    //         element: {
                    //           ...child.element,
                    //           elementProps: {
                    //             ...child.element.elementProps,
                    //             progress
                    //           }
                    //         }
                    //       }
                    //       const newChildren = notifUtils.updateChild(
                    //         notification.children,
                    //         notificationChildId,
                    //         newChild
                    //       )
                    //       const newNotifications = notifUtils.updateNotification(notifications, label, {
                    //         children: newChildren
                    //       })
                    //       return updateNotifications(newNotifications)
                    //     }
                    //   } else {
                    //     // if completed return
                    //     if (d.completed) {
                    //       return
                    //     }
                    //     // create a new notification
                    //     const childElement = {
                    //       elementType: 'NotificationProgressItem',
                    //       elementProps: {
                    //         title,
                    //         path: d.uplopath,
                    //         progress,
                    //         icon: getIcon({ title })
                    //       }
                    //     }
                    //     const notificationChildId = nanoid()
                    //     const newChildren = notifUtils.addChild(
                    //       (notification && notification.children) || [],
                    //       notificationChildId,
                    //       childElement
                    //     )
                    //     const newNotification = {
                    //       title:
                    //         newChildren.length > 1
                    //           ? getMessage('downloadingItems', { quantity: newChildren.length })
                    //           : getMessage('downloadingItem'),
                    //       children: newChildren
                    //     }
                    //     const newNotifications = notification
                    //       ? notifUtils.updateNotification(notifications, label, newNotification)
                    //       : notifUtils.addNotification(notifications, label, newNotification)
                    //     updateNotifications(newNotifications)
                    //   }
                    // })
                }
                return [2 /*return*/];
        }
    });
}); };
export default (function (apiOptions, actions) {
    var localeLabel = getMess(apiOptions.locale, label, null);
    var getSelectedResources = actions.getSelectedResources;
    var hoistNotifications = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateNotifications(apiOptions, actions)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    emitter.on('startdownloadpoll', function () {
        console.log('polling downloads');
        hoistNotifications();
    });
    return {
        id: label,
        icon: { svg: iconsSvg.fileDownload },
        label: localeLabel,
        shouldBeAvailable: function () {
            var selectedResources = getSelectedResources();
            return selectedResources.length > 0 && selectedResources[0].type !== 'dir';
        },
        handler: function () { return handler(apiOptions, actions); },
        availableInContexts: ['row', 'toolbar']
    };
});
//# sourceMappingURL=download.js.map