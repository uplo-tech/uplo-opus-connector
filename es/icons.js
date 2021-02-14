import icons from './icons-svg';
var dirIcon = icons.folder;
var soundFileIcon = icons.volumeUp;
var pictureFileIcon = icons.image;
var videoFileIcon = icons.ondemandVideo;
var archiveFileIcon = icons.archive;
var booksFileIcon = icons.book;
var unknownFileIcon = icons.insertDriveFile;
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
export function getIcon(resource) {
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
//# sourceMappingURL=icons.js.map