/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            'npm:': 'app/node_modules/'
        },
        map: {
            app: 'app',

            '@angular/core': 'npm:@angular/core/bundles/core.umd.min.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.min.js',
            '@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.min.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.min.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.min.js',

            'handsontable': 'npm:handsontable/dist/handsontable',
            '@handsontable/angular': 'npm:@handsontable/angular/bundles/handsontable-angular.umd.min.js',

            'moment': 'npm:moment/moment',
            'numeral': 'npm:numeral/numeral',

            'mydatepicker': 'npm:mydatepicker/bundles/mydatepicker.umd.min.js',

            'numbro': 'npm:numbro/dist/numbro',
            'pikaday': 'npm:pikaday/pikaday',
            'jointjs.bundle': 'npm:bundle/jointjs.bundle.js',
            'tslib': 'npm:tslib/tslib.js',

            'rxjs': 'npm:rxjs'
        },
        packages: {
            rxjs: {
                defaultExtension: 'js'
            }, 
            app: {
                main: './main.js',
                defaultExtension: 'js'
            }
        },
        bundles: {
            '/app/rxjs.js': [
                'rxjs/*'
            ]
        }
    });
})(this);