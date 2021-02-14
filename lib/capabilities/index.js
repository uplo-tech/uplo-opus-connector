"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// "deleteResource" disabled couse not implemented yet
var download_1 = __importDefault(require("./download"));
var upload_1 = require("./upload");
var createFolder_1 = __importDefault(require("./createFolder"));
var delete_1 = __importDefault(require("./delete"));
// import rename from './rename'
// import sort from './sort'
var capabilities = [
    // rename
    createFolder_1.default,
    upload_1.uploadFolder,
    upload_1.uploadFile,
    download_1.default,
    delete_1.default
    // sort
];
/**
 * Actions' fields list:
 *  showDialog,
 *  hideDialog,
 *  navigateToDir,
 *  updateNotifications,
 *  getSelection,
 *  getSelectedResources,
 *  getResource,
 *  getResourceChildren,
 *  getResourceLocation,
 *  getNotifications,
 *  getSortState
 *
 *  Called from FileNavigator (componentDidMount() and componentWillReceiveProps())
 *
 * @param apiOptions
 * @param {object} actions
 * @returns {array}
 */
exports.default = (function (apiOptions, actions) {
    return capabilities.map(function (capability) { return capability(apiOptions, actions); });
});
//# sourceMappingURL=index.js.map