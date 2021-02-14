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
import * as s from 'uplo.js';
import { Client } from 'uplojs-lib';
import * as agent from 'superagent';
var connect = s.connect;
var path = require('path');
var fs = require('fs.promises');
var readDirRecursive = require('fs-readdir-recursive');
import cache from './cache';
var Uplo = null;
var UploAddress = '';
var hasSignedIn = function () { return true; };
var initClient = function (options) { return __awaiter(_this, void 0, void 0, function () {
    var uploClientConfig;
    return __generator(this, function (_a) {
        uploClientConfig = options.uploClientConfig;
        try {
            Uplo = new Client(uploClientConfig);
            return [2 /*return*/, {
                    apiInitialized: true,
                    apiSignedIn: hasSignedIn()
                }];
        }
        catch (e) {
            console.log("Can't init Uplo Client", e);
            return [2 /*return*/, {
                    apiInitialized: false,
                    apiSignedIn: false
                }];
        }
        return [2 /*return*/];
    });
}); };
var init = function (options) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initClient(options)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// measurePerformance takes the method name and t0 t1 items to generate a log
// output. It will filter times lower than the default set time in ms.
var measurePerformance = function (name, t0, t1) {
    // const time = t1 - t0
    // if (time > 250) {
    // console.log(`Call for ${name} took ${time} milliseconds.`)
    // }
};
// const FILE_CACHE_KEY = 'FILE_CACHE'
// const FILE_CACHE_EXPIRE = 1000
var getFiles = function () { return __awaiter(_this, void 0, void 0, function () {
    var t0, files, filesAppendRoot, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                return [4 /*yield*/, Uplo.call('/renter/files')];
            case 1:
                files = (_a.sent()).files;
                filesAppendRoot = files.map(function (f) {
                    return __assign({}, f, { uplopath: path.posix.join('root', f.uplopath) });
                });
                t1 = performance.now();
                measurePerformance('getFiles', t0, t1);
                return [2 /*return*/, filesAppendRoot];
        }
    });
}); };
// const DIR_KEY = 'DIRECTORY_CACHE_'
// const DIR_CACHE_EXPIRE = 5000
var getDirectory = function (p) { return __awaiter(_this, void 0, void 0, function () {
    var t0, dir, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('getDirectory for path', p);
                t0 = performance.now();
                return [4 /*yield*/, Uplo.call("/renter/dir/" + p)
                    // cache.set(DIR_KEY + p, dir, DIR_CACHE_EXPIRE)
                ];
            case 1:
                dir = _a.sent();
                t1 = performance.now();
                measurePerformance('getDirectory', t0, t1);
                return [2 /*return*/, dir];
        }
    });
}); };
// Returns 'root' id
var getRootId = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, 'root'];
    });
}); };
var NORMALIZE_RESOURCE_CACHE_KEY = 'NORMALIZE_RESOURCE_CACHE_KEY_';
var NORMALIZE_RESOURCE_EXPIRE = 5000;
var normalizedResource = function (resource, filetype) {
    if (filetype === void 0) { filetype = 'file'; }
    return __awaiter(_this, void 0, void 0, function () {
        var t0, cacheKey, res, t1;
        return __generator(this, function (_a) {
            t0 = performance.now();
            cacheKey = NORMALIZE_RESOURCE_CACHE_KEY + resource.uplopath;
            if (cache.get(cacheKey)) {
                return [2 /*return*/, cache.get(cacheKey)];
            }
            res = {
                createdDate: Date.parse(resource.createtime),
                modifiedDate: Date.parse(resource.changetime),
                id: resource.uplopath,
                title: path.posix.basename(resource.uplopath),
                type: filetype,
                redundancy: resource.redundancy,
                mimeType: 'application/octet-stream',
                downloadUrl: UploAddress +
                    '/renter/stream/' +
                    resource.uplopath
                        .split(path.posix.sep)
                        .slice(1)
                        .join(path.posix.sep),
                size: resource.filesize,
                parents: [],
                capabilities: {
                    canDelete: true,
                    canRename: false,
                    canCopy: false,
                    canEdit: false,
                    canDownload: resource.available
                },
                uploResource: resource
            };
            cache.set(cacheKey, res, NORMALIZE_RESOURCE_EXPIRE);
            t1 = performance.now();
            measurePerformance('normalizedResource', t0, t1);
            return [2 /*return*/, res];
        });
    });
};
var removeResources = function (apiOptions, selectedResources) {
    if (selectedResources === void 0) { selectedResources = []; }
    return __awaiter(_this, void 0, void 0, function () {
        var t0, _i, selectedResources_1, x, uploPath, t1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t0 = performance.now();
                    _i = 0, selectedResources_1 = selectedResources;
                    _a.label = 1;
                case 1:
                    if (!(_i < selectedResources_1.length)) return [3 /*break*/, 6];
                    x = selectedResources_1[_i];
                    uploPath = cleanRootFromPath(x.id);
                    if (!(x.type === 'file')) return [3 /*break*/, 3];
                    return [4 /*yield*/, deleteFileById(uploPath)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(x.type === 'dir')) return [3 /*break*/, 5];
                    return [4 /*yield*/, deleteFolderById(uploPath)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    t1 = performance.now();
                    measurePerformance('removeResources', t0, t1);
                    return [2 /*return*/, true];
            }
        });
    });
};
var cleanRootFromPath = function (p) {
    var t0 = performance.now();
    var res = p
        .split(path.posix.sep)
        .slice(1)
        .join(path.posix.sep);
    var t1 = performance.now();
    measurePerformance('cleanRootFromPath', t0, t1);
    return res;
};
var getUploResourceById = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var t0, cleanPath, dir, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('gettingUplo Resource', id);
                t0 = performance.now();
                cleanPath = cleanRootFromPath(id);
                // const parentPath = path.posix.dirname(cleanPath)
                console.log('cleanPath', cleanPath);
                return [4 /*yield*/, getDirectory(cleanPath)];
            case 1:
                dir = _a.sent();
                t1 = performance.now();
                measurePerformance('getUploByResourceId', t0, t1);
                return [2 /*return*/, (dir.files || []).find(function (s) { return s.uplopath === cleanPath; })];
        }
    });
}); };
var getUploDirById = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var t0, p, dir, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                p = id
                    .split(path.posix.sep)
                    .slice(1)
                    .join(path.posix.sep);
                return [4 /*yield*/, getDirectory(p)];
            case 1:
                dir = _a.sent();
                t1 = performance.now();
                measurePerformance('getUploDirById', t0, t1);
                return [2 /*return*/, dir];
        }
    });
}); };
var getCapabilitiesForResource = function (options, resource) {
    return resource.capabilities || [];
};
var createFolder = function (apiOptions, resourceId, folderName) { return __awaiter(_this, void 0, void 0, function () {
    var t0, pathToCreate, res, t1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                console.log('createFolder', resourceId, folderName);
                pathToCreate = path.posix.join(cleanRootFromPath(resourceId), folderName);
                console.log('pathToCreate', pathToCreate);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Uplo.call({
                        url: "/renter/dir/" + pathToCreate,
                        method: 'POST',
                        qs: {
                            action: 'create'
                        }
                    })];
            case 2:
                res = _a.sent();
                t1 = performance.now();
                measurePerformance('createFolder', t0, t1);
                console.log('results are', res);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log('error creating uplo folder', e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deleteFileById = function (uplopath) { return __awaiter(_this, void 0, void 0, function () {
    var t0, result, t1, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log('deleting', uplopath);
                return [4 /*yield*/, Uplo.call({
                        url: '/renter/delete/' + encodeURI(uplopath),
                        timeout: 20000,
                        method: 'POST'
                    })];
            case 2:
                result = _a.sent();
                t1 = performance.now();
                measurePerformance('deleteFileById', t0, t1);
                return [2 /*return*/, result];
            case 3:
                e_2 = _a.sent();
                console.log('error deleting file', e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deleteFolderById = function (uplopath) { return __awaiter(_this, void 0, void 0, function () {
    var t0, result, t1, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log('deleting folder', uplopath);
                return [4 /*yield*/, Uplo.call({
                        url: '/renter/dir/' + encodeURI(uplopath),
                        timeout: 20000,
                        method: 'POST',
                        qs: {
                            action: 'delete'
                        }
                    })];
            case 2:
                result = _a.sent();
                t1 = performance.now();
                measurePerformance('deleteFolderById', t0, t1);
                return [2 /*return*/, result];
            case 3:
                e_3 = _a.sent();
                console.log('error deleting file', e_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var uploadFileToId = function (uplopath, source) {
    return Uplo.call({
        url: '/renter/upload/' + encodeURI(uplopath),
        timeout: 20000,
        method: 'POST',
        qs: {
            source: source
        }
    });
};
var sumFileSize = function (files) {
    var t0 = performance.now();
    var res = (files || []).reduce(function (x, y) { return x + y.filesize; }, 0);
    var t1 = performance.now();
    measurePerformance('sumFileSize', t0, t1);
    return res;
};
var sumUploadBytes = function (files) {
    var t0 = performance.now();
    var res = (files || []).reduce(function (x, y) { return x + y.uploadedbytes; }, 0);
    var t1 = performance.now();
    measurePerformance('sumUploadBytes', t0, t1);
    return res;
};
var topOfList = function (n) {
    var t0 = performance.now();
    var res = Math.max.apply(Math, n);
    var t1 = performance.now();
    measurePerformance('topOfList', t0, t1);
    return res;
};
// const NORMALIZE_DIR_CACHE_KEY = 'NORMALIZE_DIR_CACHE_KEY_'
// const NORMALIZE_DIR_CACHE_EXPIRE = 5000
var normalizedDirResource = function (id) { return __awaiter(_this, void 0, void 0, function () {
    var t0, dirPath, resource, selectedDir, dirObj, res, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                dirPath = cleanRootFromPath(id);
                console.log('normalizing dir with id', id);
                return [4 /*yield*/, getUploDirById(id)];
            case 1:
                resource = _a.sent();
                selectedDir = resource.directories.filter(function (i) { return i.uplopath === dirPath; })[0];
                dirObj = {
                    uplopath: id,
                    localpath: id,
                    filesize: selectedDir.aggregatesize,
                    available: false,
                    renewing: true,
                    expiration: 1000,
                    recoverable: true,
                    redundancy: selectedDir.minredundancy,
                    uploadedbytes: sumUploadBytes(resource.files),
                    uploadprogress: 100,
                    accesstime: new Date(topOfList((resource.directories || []).map(function (n) { return Date.parse(n.mostrecentmodtime); }))).toISOString(),
                    changetime: new Date(topOfList((resource.directories || []).map(function (n) { return Date.parse(n.mostrecentmodtime); }))).toISOString(),
                    createtime: new Date(topOfList((resource.directories || []).map(function (n) { return Date.parse(n.mostrecentmodtime); }))).toISOString(),
                    modtime: new Date(topOfList((resource.directories || []).map(function (n) { return Date.parse(n.mostrecentmodtime); }))).toISOString()
                };
                return [4 /*yield*/, normalizedResource(dirObj, 'dir')];
            case 2:
                res = _a.sent();
                t1 = performance.now();
                measurePerformance('normalizedDirResource', t0, t1);
                // cache.set(cacheKey, res, NORMALIZE_DIR_CACHE_EXPIRE)
                return [2 /*return*/, res];
        }
    });
}); };
var createFileResource = function (resource, id) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                createdDate: Date.parse(resource.createtime),
                modifiedDate: Date.parse(resource.changetime),
                id: id,
                title: path.posix.basename(resource.uplopath),
                type: 'file',
                redundancy: resource.redundancy,
                mimeType: 'application/octet-stream',
                downloadUrl: UploAddress +
                    '/renter/stream/' +
                    resource.uplopath
                        .split(path.posix.sep)
                        .slice(1)
                        .join(path.posix.sep),
                size: resource.filesize,
                parents: [],
                capabilities: {
                    canDelete: true,
                    canRename: false,
                    canCopy: false,
                    canEdit: false,
                    canDownload: resource.available
                },
                uploResource: resource
            }];
    });
}); };
var createDirResource = function (resource, id) { return __awaiter(_this, void 0, void 0, function () {
    var t0, time, dirObj, res, t1;
    return __generator(this, function (_a) {
        t0 = performance.now();
        time = new Date(resource.mostrecentmodtime).toISOString();
        dirObj = {
            uplopath: resource.uplopath,
            localpath: id,
            filesize: resource.aggregatesize,
            available: false,
            renewing: true,
            expiration: 1000,
            recoverable: true,
            redundancy: resource.minredundancy,
            uploadedbytes: 0,
            uploadprogress: 100,
            accesstime: time,
            changetime: time,
            createtime: time,
            modtime: time
        };
        res = {
            createdDate: Date.parse(dirObj.createtime),
            modifiedDate: Date.parse(dirObj.changetime),
            id: id,
            title: dirObj.uplopath === '' ? 'root' : path.posix.basename(dirObj.uplopath),
            type: 'dir',
            redundancy: dirObj.redundancy,
            mimeType: 'application/octet-stream',
            downloadUrl: UploAddress +
                '/renter/stream/' +
                resource.uplopath
                    .split(path.posix.sep)
                    .slice(1)
                    .join(path.posix.sep),
            size: dirObj.filesize,
            parents: [],
            capabilities: {
                canDelete: true,
                canRename: false,
                canCopy: false,
                canEdit: false,
                canDownload: resource.available
            },
            uploResource: resource
        };
        t1 = performance.now();
        measurePerformance('createDirResource', t0, t1);
        return [2 /*return*/, res];
    });
}); };
var createRootResource = function () { return __awaiter(_this, void 0, void 0, function () {
    var date, rootObj, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = Date.now().toString();
                rootObj = {
                    uplopath: 'root',
                    localpath: 'root',
                    filesize: null,
                    available: false,
                    renewing: true,
                    expiration: 1000,
                    recoverable: true,
                    redundancy: 1,
                    uploadedbytes: 0,
                    uploadprogress: 100,
                    accesstime: date,
                    changetime: date,
                    createtime: date,
                    modtime: date
                };
                return [4 /*yield*/, normalizedResource(rootObj, 'dir')];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res];
        }
    });
}); };
// Returns the normalized resource given an id (or path, in this case)
var getResourceById = function (options, id) { return __awaiter(_this, void 0, void 0, function () {
    var t0, date, rootObj, res, file, resource, t1, resource, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                if (!(id === 'root')) return [3 /*break*/, 2];
                date = Date.now().toString();
                rootObj = {
                    uplopath: 'root',
                    localpath: 'root',
                    filesize: null,
                    available: false,
                    renewing: true,
                    expiration: 1000,
                    recoverable: true,
                    redundancy: 1,
                    uploadedbytes: 0,
                    uploadprogress: 100,
                    accesstime: date,
                    changetime: date,
                    createtime: date,
                    modtime: date
                };
                return [4 /*yield*/, normalizedResource(rootObj, 'dir')
                    // console.log('finish normalizing rouescr')
                ];
            case 1:
                res = _a.sent();
                // console.log('finish normalizing rouescr')
                return [2 /*return*/, res];
            case 2: return [4 /*yield*/, getUploResourceById(id)
                // console.log('finish get uplo resource')
            ];
            case 3:
                file = _a.sent();
                if (!file) return [3 /*break*/, 5];
                return [4 /*yield*/, normalizedResource(file)
                    // console.log('awegaweg')
                ];
            case 4:
                resource = _a.sent();
                t1 = performance.now();
                measurePerformance('getResourceById', t0, t1);
                return [2 /*return*/, resource];
            case 5: return [4 /*yield*/, normalizedDirResource(id)];
            case 6:
                resource = _a.sent();
                t1 = performance.now();
                measurePerformance('getResourceById', t0, t1);
                return [2 /*return*/, resource];
        }
    });
}); };
var normalizeDirResource = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
// My assumption is that getParentsForId is currently only used to build a path
// to resolve at the bottom of the FM. Therefore we should be able to create a fake parent free.
var createFakeParent = function (parentPath) { return __awaiter(_this, void 0, void 0, function () {
    var uploPath, date, dirObj, res;
    return __generator(this, function (_a) {
        uploPath = cleanRootFromPath(parentPath);
        date = Date.now().toString();
        dirObj = {
            uplopath: uploPath,
            localpath: parentPath,
            filesize: 0,
            available: false,
            renewing: true,
            expiration: 1000,
            recoverable: true,
            redundancy: 0,
            uploadedbytes: 0,
            uploadprogress: 100,
            accesstime: date,
            changetime: date,
            createtime: date,
            modtime: date
        };
        res = {
            createdDate: Date.parse(dirObj.createtime),
            modifiedDate: Date.parse(dirObj.changetime),
            id: parentPath,
            title: dirObj.uplopath === '' ? 'root' : path.posix.basename(dirObj.uplopath),
            type: 'dir',
            redundancy: dirObj.redundancy,
            mimeType: 'application/octet-stream',
            downloadUrl: UploAddress +
                '/renter/stream/' +
                parentPath
                    .split(path.posix.sep)
                    .slice(1)
                    .join(path.posix.sep),
            size: dirObj.filesize,
            parents: [],
            capabilities: {
                canDelete: true,
                canRename: false,
                canCopy: false,
                canEdit: false,
                canDownload: false
            },
            uploResource: dirObj
        };
        return [2 /*return*/, res];
    });
}); };
var getParentsForId = function (options, id) { return __awaiter(_this, void 0, void 0, function () {
    var currentId, res, mem, parentPath, parentResource;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('getting parents for id ', id);
                currentId = id;
                res = [];
                mem = {};
                _a.label = 1;
            case 1:
                if (!(currentId !== 'root')) return [3 /*break*/, 3];
                parentPath = path.posix.dirname(currentId);
                currentId = parentPath;
                return [4 /*yield*/, createFakeParent(parentPath)];
            case 2:
                parentResource = _a.sent();
                res = [parentResource].concat(res);
                return [3 /*break*/, 1];
            case 3:
                console.log('getParentsForId', res);
                return [2 /*return*/, res];
        }
    });
}); };
// const getParentsForId = async (options, id) => {
//   console.log('getting parents for id ', id)
//   let currentId = id
//   let res = []
//   let mem = {}
//   while (currentId !== 'root') {
//     const parentPath = path.posix.dirname(currentId)
//     currentId = parentPath
//     const dirPath = cleanRootFromPath(parentPath)
//     console.log('dirPath is', dirPath)
//     // try to get from mem
//     let parentUploResource = null
//     if (mem[dirPath]) {
//       parentUploResource = mem[dirPath]
//     } else {
//       const dir: DirResponse = await getDirectory(dirPath)
//       parentUploResource = dir.directories.filter(i => i.uplopath === dirPath)[0]
//       console.log('got resource', parentUploResource)
//       mem[dirPath] = parentUploResource
//     }
//     const parentResource = await createDirResource(parentUploResource, parentPath)
//     res = [parentResource].concat(res)
//     // const res = await createParentResources(allFiles, parentPath, [parentResource].concat(result))
//   }
//   console.log('getParentsForId', res)
//   return res
// }
// Returns a list of the parent resources going back to the root
// /media/movies/avengers.mp4 -> [Resource<movies>, Resource<media>]
// const getParentsForIdLegacy = async (options, id, result = []) => {
//   if (id === 'root') {
//     return result
//   }
//   const parentPath = path.posix.dirname(id)
//   const parent = await normalizedDirResource(parentPath)
//   const res = await getParentsForIdLegacy(options, parentPath, [parent].concat(result))
//   const t1 = performance.now()
//   return res
// }
// getChildrenForId is only called on dirs
var getChildrenForId = function (options, _a) {
    var id = _a.id, _b = _a.sortBy, sortBy = _b === void 0 ? 'title' : _b, _c = _a.sortDirection, sortDirection = _c === void 0 ? 'ASC' : _c;
    return __awaiter(_this, void 0, void 0, function () {
        var t0, results, dirPath, allFiles, _i, _d, x, finalPath, resource, _e, _f, y, finalPath, resource, finalResourceList, t1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    t0 = performance.now();
                    results = {};
                    dirPath = cleanRootFromPath(id);
                    return [4 /*yield*/, getDirectory(dirPath)];
                case 1:
                    allFiles = _g.sent();
                    _i = 0, _d = allFiles.files || [];
                    _g.label = 2;
                case 2:
                    if (!(_i < _d.length)) return [3 /*break*/, 5];
                    x = _d[_i];
                    finalPath = path.posix.join('root', x.uplopath);
                    return [4 /*yield*/, createFileResource(x, finalPath)];
                case 3:
                    resource = _g.sent();
                    if (!(finalPath in results)) {
                        results[finalPath] = resource;
                    }
                    _g.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _e = 0, _f = allFiles.directories || [];
                    _g.label = 6;
                case 6:
                    if (!(_e < _f.length)) return [3 /*break*/, 9];
                    y = _f[_e];
                    finalPath = path.posix.join('root', y.uplopath);
                    return [4 /*yield*/, createDirResource(y, finalPath)];
                case 7:
                    resource = _g.sent();
                    if (!(finalPath in results) && y.uplopath !== dirPath) {
                        results[finalPath] = resource;
                    }
                    _g.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9:
                    finalResourceList = Object.keys(results).map(function (x) { return results[x]; });
                    t1 = performance.now();
                    measurePerformance('getChildrenForId', t0, t1);
                    return [2 /*return*/, finalResourceList];
            }
        });
    });
};
var getResourceName = function (options, resource) {
    return resource.title;
};
// Get the nearest parent id for a specified resource
var getParentIdForResource = function (options, resource) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (resource.parents.length) {
            return [2 /*return*/, 'root'];
        }
        return [2 /*return*/, resource.parents[0].id];
    });
}); };
var downloadResource = function (_a) {
    var resource = _a.resource, params = _a.params, onProgress = _a.onProgress, _b = _a.i, i = _b === void 0 ? 0 : _b, _c = _a.l, l = _c === void 0 ? 1 : _c;
    return __awaiter(_this, void 0, void 0, function () {
        var downloadUrl, direct, mimeType, fileName, res, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    downloadUrl = params.downloadUrl, direct = params.direct, mimeType = params.mimeType, fileName = params.fileName;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, agent
                            .get('http://' + downloadUrl)
                            .responseType('blob')
                            .on('progress', function (event) {
                            onProgress((i * 100 + event.percent) / l);
                        })];
                case 2:
                    res = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    throw new Error("failed to download resource: " + err_1);
                case 4: return [2 /*return*/, {
                        downloadUrl: downloadUrl,
                        direct: direct,
                        file: res.body,
                        mimeType: mimeType
                    }];
            }
        });
    });
};
var allDownloads = function () { return __awaiter(_this, void 0, void 0, function () {
    var t0, downloads, filteredDownloads, map, results, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                return [4 /*yield*/, Uplo.call('/renter/downloads')];
            case 1:
                downloads = (_a.sent()).downloads;
                filteredDownloads = (downloads || []).filter(function (d) { return d.destinationtype === 'file'; });
                map = {};
                // We run this through a loop to remove streaming objects bug from uplod.
                filteredDownloads.forEach(function (d) {
                    if (map.hasOwnProperty(d.uplopath)) {
                        if (map[d.uplopath].starttime < d.starttime) {
                            map[d.uplopath] = d;
                        }
                    }
                    else {
                        map[d.uplopath] = d;
                    }
                });
                results = Object.values(map);
                t1 = performance.now();
                measurePerformance('allDownloads', t0, t1);
                return [2 /*return*/, results];
        }
    });
}); };
var allUploads = function () { return __awaiter(_this, void 0, void 0, function () {
    var t0, files, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                return [4 /*yield*/, Uplo.call('/renter/files')];
            case 1:
                files = (_a.sent()).files;
                t1 = performance.now();
                measurePerformance('allUploads', t0, t1);
                return [2 /*return*/, (files || [])];
        }
    });
}); };
var queueDownload = function (uplopath, downloadpath) { return __awaiter(_this, void 0, void 0, function () {
    var t0, data, t1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t0 = performance.now();
                return [4 /*yield*/, Uplo.call({
                        url: "/renter/download/" + uplopath,
                        qs: {
                            destination: downloadpath,
                            async: true
                        }
                    })];
            case 1:
                data = _a.sent();
                t1 = performance.now();
                measurePerformance('queueDownload', t0, t1);
                return [2 /*return*/, data];
        }
    });
}); };
// const uploadAction = async (paths)  => {
//   const onFail = err => emitter.emit('notification', err)
//   // this function will go through each path and upload it to Uplo
//   for (let eachPath of paths) {
//     // first, let's first out if it's a dir or file
//     const fileStatus = await fs.stat(eachPath)
//     // Handler for directories
//     if (fileStatus.isDirectory()) {
//       // first we'll recursively get the subpaths of the dir
//       const files = readDirRecursive(eachPath)
//       // loop over each subpath and create the uplopath to be uploaded
//       for (let subPath of files) {
//         const folderName = path.basename(eachPath)
//         const uploadPath = path.join(eachPath, subPath)
//         const combinedPath = path.posix.join(resource.id, folderName, subPath).split(path.posix.sep)
//         const uploPath = combinedPath.slice(1).join(path.posix.sep)
//         try {
//           await uploadFileToId(uploPath, uploadPath)
//         } catch (err) {
//           console.log('error uploading file', err)
//         }
//       }
//       // onFail('directories are not support just yet')
//     } else {
//       // default handler for files
//       const fileName = path.basename(eachPath)
//       const combinedPath = path.posix.join(resource.id, fileName).split(path.posix.sep)
//       const uploPath = combinedPath.slice(1).join(path.posix.sep)
//       try {
//         await uploadFileToId(uploPath, eachPath)
//       } catch (err) {
//         console.log('error uploading file', err)
//         onFail(err)
//       }
//     }
//   }
// }
export default {
    init: init,
    hasSignedIn: hasSignedIn,
    getResourceById: getResourceById,
    getChildrenForId: getChildrenForId,
    getRootId: getRootId,
    getParentsForId: getParentsForId,
    getParentIdForResource: getParentIdForResource,
    getCapabilitiesForResource: getCapabilitiesForResource,
    getResourceName: getResourceName,
    downloadResource: downloadResource,
    allDownloads: allDownloads,
    allUploads: allUploads,
    uploadFileToId: uploadFileToId,
    cleanRootFromPath: cleanRootFromPath,
    queueDownload: queueDownload,
    createFolder: createFolder,
    removeResources: removeResources
};
//# sourceMappingURL=api.js.map