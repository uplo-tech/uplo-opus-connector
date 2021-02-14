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
import fecha from 'fecha';
import getMess from './translations';
var filesize = require('filesize');
var TABLET_WIDTH = 1024;
var MOBILE_WIDTH = 640;
function formatSize(viewLayoutOptions, _a) {
    var cellData = _a.cellData, columnData = _a.columnData, columnIndex = _a.columnIndex, dataKey = _a.dataKey, isScrolling = _a.isScrolling, rowData = _a.rowData, rowIndex = _a.rowIndex;
    if (typeof cellData !== 'undefined' && viewLayoutOptions.humanReadableSize) {
        return filesize(cellData);
    }
    return cellData || '—';
}
function formatDate(viewLayoutOptions, _a) {
    var cellData = _a.cellData, columnData = _a.columnData, columnIndex = _a.columnIndex, dataKey = _a.dataKey, isScrolling = _a.isScrolling, rowData = _a.rowData, rowIndex = _a.rowIndex;
    if (cellData) {
        var dateTimePattern = viewLayoutOptions.dateTimePattern;
        return fecha.format(new Date().setTime(cellData), dateTimePattern);
    }
    return '';
}
var listViewLayout = function (viewLayoutOptions) {
    var getMessage = getMess.bind(null, viewLayoutOptions.locale);
    return [
        {
            elementType: 'Column',
            elementProps: {
                key: 'title',
                dataKey: 'title',
                width: 48,
                label: getMessage('title'),
                flexGrow: 2,
                cellRenderer: {
                    elementType: 'NameCell',
                    callArguments: [viewLayoutOptions]
                },
                headerRenderer: {
                    elementType: 'HeaderCell',
                    callArguments: [viewLayoutOptions]
                },
                disableSort: false
            }
        },
        {
            elementType: 'Column',
            elementProps: {
                key: 'size',
                width: 100,
                dataKey: 'size',
                label: getMessage('fileSize'),
                flexGrow: viewLayoutOptions.width > TABLET_WIDTH ? 1 : 0,
                cellRenderer: {
                    elementType: 'Cell',
                    callArguments: [__assign({}, viewLayoutOptions, { getData: formatSize })]
                },
                headerRenderer: {
                    elementType: 'HeaderCell',
                    callArguments: [viewLayoutOptions]
                },
                disableSort: true
            }
        },
        viewLayoutOptions.width > MOBILE_WIDTH && {
            elementType: 'Column',
            elementProps: {
                key: 'modifiedDate',
                width: 100,
                dataKey: 'modifiedDate',
                label: getMessage('lastModified'),
                flexGrow: 1,
                cellRenderer: {
                    elementType: 'Cell',
                    callArguments: [__assign({}, viewLayoutOptions, { getData: formatDate })]
                },
                headerRenderer: {
                    elementType: 'HeaderCell',
                    callArguments: [viewLayoutOptions]
                },
                disableSort: false
            }
        },
        viewLayoutOptions.width > MOBILE_WIDTH && {
            elementType: 'Column',
            elementProps: {
                key: 'redundancy',
                width: 100,
                dataKey: 'redundancy',
                label: getMessage('redundancy'),
                flexGrow: 1,
                cellRenderer: {
                    elementType: 'Cell',
                    callArguments: [viewLayoutOptions]
                },
                headerRenderer: {
                    elementType: 'HeaderCell',
                    callArguments: [viewLayoutOptions]
                },
                disableSort: false
            }
        }
    ];
};
export default listViewLayout;
//# sourceMappingURL=list-view-layout.js.map