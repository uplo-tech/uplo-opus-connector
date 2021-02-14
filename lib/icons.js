"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var icons_svg_1 = __importDefault(require("./icons-svg"));
var dirIcon = icons_svg_1.default.folder;
var soundFileIcon = icons_svg_1.default.volumeUp;
var pictureFileIcon = icons_svg_1.default.image;
var videoFileIcon = icons_svg_1.default.ondemandVideo;
var archiveFileIcon = icons_svg_1.default.archive;
var booksFileIcon = icons_svg_1.default.book;
var unknownFileIcon = icons_svg_1.default.insertDriveFile;
var defaultFillColor = '#424242';
var soundFilesExtensions = ['aac', 'aiff', 'flac', 'm4a', 'ogg', 'mp3', 'wav', 'wma'];
var pictureFilesExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'svg'];
var videoFilesExtensions = ['avi', 'flv', 'wmv', 'mov', 'mp4'];
var archiveFilesExtensions = ['tar', 'zip', 'gz', 'bz2', 'rar'];
var booksFilesExtensions = ['pdf', 'epub', 'fb2'];
function matchFileExtensions(filename, extensions) {
    var extensionsRegExp = "(" + extensions.join('|') + ")";
    return extensions.some(function (o) { return new RegExp("^.*." + extensionsRegExp + "$").test(filename.toLowerCase()); });
}
function getIcon(resource) {
    if (resource.type === 'dir') {
        return { svg: dirIcon, fill: defaultFillColor };
    }
    else if (matchFileExtensions(resource.title, soundFilesExtensions)) {
        return { svg: soundFileIcon, fill: "#e53935" };
    }
    else if (matchFileExtensions(resource.title, pictureFilesExtensions)) {
        return { svg: pictureFileIcon, fill: "#e53935" };
    }
    else if (matchFileExtensions(resource.title, videoFilesExtensions)) {
        return { svg: videoFileIcon, fill: "#e53935" };
    }
    else if (matchFileExtensions(resource.title, archiveFilesExtensions)) {
        return { svg: archiveFileIcon, fill: "#616161" };
    }
    else if (matchFileExtensions(resource.title, booksFilesExtensions)) {
        return { svg: booksFileIcon, fill: "#e53935" };
    }
    else {
        return { svg: unknownFileIcon, fill: "#616161" };
    }
}
exports.getIcon = getIcon;
//# sourceMappingURL=icons.js.map