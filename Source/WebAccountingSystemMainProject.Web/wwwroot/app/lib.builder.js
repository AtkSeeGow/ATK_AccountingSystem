
!function () {

    var Builder = require('systemjs-builder');

    var packages = { 'rxjs': { main: 'Rx.js' } };

    var builder = new Builder({
        baseURL: '/node_modules',
        defaultJSExtensions: true,
        packages: packages
    });

    Object.keys(packages).forEach(function (pkgName) {
        builder.bundle(pkgName, '../assets/' + pkgName + '.js')
            .then(function () {
                console.log('Build complete - ' + pkgName);
            })
            .catch(function (err) {
                console.log('Build error - ' + pkgName);
                console.log(err);
            });
    });
}();


!function () {
    const pkgName = 'angular2dependencies.bundle.js';
    const gulp = require('gulp');
    const concat = require('gulp-concat');
    const libs = '../assets';

    gulp.src([
        "node_modules/core-js/client/shim.min.js",
        "node_modules/zone.js/dist/zone.js",
        "node_modules/reflect-metadata/Reflect.js",
        "node_modules/systemjs/dist/system.src.js",
    ])
        .pipe(concat(pkgName))
        .pipe(gulp.dest(libs))
        .on('end', () => {
            console.log('done - ' + pkgName);
        });
}();

