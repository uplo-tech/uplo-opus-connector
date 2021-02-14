// "deleteResource" disabled couse not implemented yet
import download from './download';
import { uploadFile, uploadFolder } from './upload';
import createFolder from './createFolder';
import deleteResource from './delete';
// import rename from './rename'
// import sort from './sort'
var capabilities = [
    // rename
    createFolder,
    uploadFolder,
    uploadFile,
    download,
    deleteResource
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
export default (function (apiOptions, actions) {
    return capabilities.map(function (capability) { return capability(apiOptions, actions); });
});
//# sourceMappingURL=index.js.map