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
import api from '../api';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import icons from '../icons-svg';
import getMess from '../translations';
import { readLocalFile } from '../utils/upload';
import emitter from '../emitter';
var fs = require('fs.promises');
var path = require('path');
var readDirRecursive = require('fs-readdir-recursive');
var label = 'upload';
function handler(apiOptions, actions) {
    return __awaiter(this, void 0, void 0, function () {
        var paths, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readLocalFile(apiOptions.uploadType)];
                case 2:
                    paths = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log('catching on fail for fetching path', e_1);
                    return [2 /*return*/];
                case 4:
                    uploadLogic(actions)(paths);
                    return [2 /*return*/];
            }
        });
    });
}
function uploadLogic(actions) {
    var _this = this;
    return function (paths) { return __awaiter(_this, void 0, void 0, function () {
        var navigateToDir, updateNotifications, getResource, getNotifications, onFail, resource, _i, paths_1, eachPath, fileStatus, files, _a, files_1, subPath, folderName, uploadPath, combinedPath, uploPath, err_1, fileName, combinedPath, uploPath, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    navigateToDir = actions.navigateToDir, updateNotifications = actions.updateNotifications, getResource = actions.getResource, getNotifications = actions.getNotifications;
                    onFail = function (err) { return emitter.emit('notification', err); };
                    resource = getResource();
                    _i = 0, paths_1 = paths;
                    _b.label = 1;
                case 1:
                    if (!(_i < paths_1.length)) return [3 /*break*/, 14];
                    eachPath = paths_1[_i];
                    return [4 /*yield*/, fs.stat(eachPath)
                        // Handler for directories
                    ];
                case 2:
                    fileStatus = _b.sent();
                    if (!fileStatus.isDirectory()) return [3 /*break*/, 9];
                    files = readDirRecursive(eachPath);
                    _a = 0, files_1 = files;
                    _b.label = 3;
                case 3:
                    if (!(_a < files_1.length)) return [3 /*break*/, 8];
                    subPath = files_1[_a];
                    folderName = path.basename(eachPath);
                    uploadPath = path.join(eachPath, subPath);
                    combinedPath = path.posix
                        .join(resource.id, folderName, subPath)
                        .split(path.posix.sep);
                    uploPath = combinedPath.slice(1).join(path.posix.sep);
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, api.uploadFileToId(uploPath, uploadPath)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    console.log('error uploading file', err_1);
                    return [3 /*break*/, 7];
                case 7:
                    _a++;
                    return [3 /*break*/, 3];
                case 8:
                    navigateToDir(resource.id, null, false, false);
                    return [3 /*break*/, 13];
                case 9:
                    fileName = path.basename(eachPath);
                    combinedPath = path.posix.join(resource.id, fileName).split(path.posix.sep);
                    uploPath = combinedPath.slice(1).join(path.posix.sep);
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, api.uploadFileToId(uploPath, eachPath)];
                case 11:
                    _b.sent();
                    navigateToDir(resource.id, null, false, false);
                    return [3 /*break*/, 13];
                case 12:
                    err_2 = _b.sent();
                    console.log('error uploading file', err_2);
                    onFail(err_2);
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 1];
                case 14: return [2 /*return*/];
            }
        });
    }); };
}
var updateNotifications = function (apiOptions, actions) { return __awaiter(_this, void 0, void 0, function () {
    var updateNotifications, getSelectedResources, navigateToDir, getNotifications, getResource, getMessage, ds, itemsUploading, notifications, notification, oldNotificationsExist, newNotifications_1, notificationExists, n, notificationChildId_1, child, newChild, newChildren_1, newNotifications_2, childElement, notificationChildId, newChildren, newNotification, newNotifications, notifications, notification, multiuploadExists, newNotifications, childrenExists, newNotifications;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateNotifications = actions.updateNotifications, getSelectedResources = actions.getSelectedResources, navigateToDir = actions.navigateToDir, getNotifications = actions.getNotifications, getResource = actions.getResource;
                getMessage = getMess.bind(null, apiOptions.locale);
                return [4 /*yield*/, api.allUploads()
                    // filter number of files that are less than 2.5 redundancy
                ];
            case 1:
                ds = _a.sent();
                itemsUploading = ds.filter(function (x) { return x.redundancy < 2.5; }).length;
                // loop for more than 5 items uploading
                if (itemsUploading > 5) {
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
                        newChild = __assign({}, child, { element: __assign({}, child.element, { elementProps: __assign({}, child.element.elementProps, { title: itemsUploading + " Items Uploading", progress: 11 }) }) });
                        newChildren_1 = notifUtils.updateChild(notification.children, notificationChildId_1, newChild);
                        newNotifications_2 = notifUtils.updateNotification(notifications, label, {
                            title: getMessage('uploadingItems', { quantity: itemsUploading }),
                            children: newChildren_1
                        });
                        return [2 /*return*/, updateNotifications(newNotifications_2)];
                    }
                    childElement = {
                        elementType: 'NotificationProgressItem',
                        elementProps: {
                            title: itemsUploading + " Items Uploading",
                            path: '_multipleitems',
                            progress: 10,
                            icon: getIcon({ title: 'archive.zip' })
                        }
                    };
                    notificationChildId = nanoid();
                    newChildren = notifUtils.addChild((notification && notification.children) || [], notificationChildId, childElement);
                    newNotification = {
                        title: getMessage('uploadingItems', { quantity: itemsUploading }),
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
                        var progress = d.uploadprogress;
                        var notificationExists = (notification && notification.children
                            ? notification.children
                            : []).filter(function (c) { return c.element.elementProps.path === d.uplopath; });
                        // if the child notification already exists, just update progress
                        if (notificationExists.length > 0) {
                            var n = notificationExists[0];
                            var notificationChildId = n.id;
                            // if the download is completed, remove the notification
                            if (d.available) {
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
                                var resource = getResource();
                                navigateToDir(resource.id, null, false, false);
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
                            if (d.redundancy >= 2.5 || d.uploadprogress >= 100) {
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
                                    ? getMessage('uploadingItems', { quantity: newChildren.length })
                                    : getMessage('uploadingItem'),
                                children: newChildren
                            };
                            var newNotifications = notification
                                ? notifUtils.updateNotification(notifications, label, newNotification)
                                : notifUtils.addNotification(notifications, label, newNotification);
                            return updateNotifications(newNotifications);
                        }
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
export var uploadFile = function (apiOptions, actions) {
    var localeLabel = getMess(apiOptions.locale, label, null);
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
    emitter.on('startuploadpoll', function () {
        console.log('polling uploads');
        hoistNotifications();
    });
    return {
        id: label,
        icon: { svg: icons.fileUpload },
        label: localeLabel,
        shouldBeAvailable: function (apiOptions) { return true; },
        availableInContexts: ['files-view', 'new-button'],
        handler: function () { return handler(__assign({}, apiOptions, { uploadType: 'file' }), actions); }
    };
};
export var uploadFolder = function (apiOptions, actions) {
    var localeLabel = 'Upload Folder';
    return {
        id: label,
        icon: { svg: icons.folderUpload },
        label: localeLabel,
        shouldBeAvailable: function (apiOptions) { return true; },
        availableInContexts: ['files-view', 'new-button'],
        handler: function () { return handler(__assign({}, apiOptions, { uploadType: 'folder' }), actions); },
        uploadLogic: uploadLogic(actions)
    };
};
//# sourceMappingURL=upload.js.map