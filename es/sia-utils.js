function getDownloadParams(resource) {
    var mimeType = resource.mimeType, title = resource.title;
    var downloadUrl = resource.downloadUrl;
    return {
        downloadUrl: downloadUrl,
        direct: true,
        mimeType: mimeType,
        fileName: title,
        uplopath: resource.id
    };
}
function showUploadDialog() {
    console.log('hi');
}
export { showUploadDialog, getDownloadParams };
/*
Documents
  HTML	text/html
  HTML (zipped)	application/zip
  Plain text	text/plain
  Rich text	application/rtf
  Open Office doc	application/vnd.oasis.opendocument.text
  PDF	application/pdf
  MS Word document	application/vnd.openxmlformats-officedocument.wordprocessingml.document
  EPUB	application/epub+zip
Spreadsheets
  MS Excel	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  Open Office sheet	application/x-vnd.oasis.opendocument.spreadsheet
  PDF	application/pdf
  CSV (first sheet only)	text/csv
  TSV (first sheet only)	text/tab-separated-values
  HTML (zipped)	application/zip
Drawings
  JPEG	image/jpeg
  PNG	image/png
  SVG	image/svg+xml
  PDF	application/pdf
Presentations
  MS PowerPoint	application/vnd.openxmlformats-officedocument.presentationml.presentation
  Open Office presentation	application/vnd.oasis.opendocument.presentation
  PDF	application/pdf
Plain
  text
  text/plain
Apps Scripts
  JSON	application/vnd.google-apps.script+json
*/
//# sourceMappingURL=uplo-utils.js.map