'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var coveralls = require('gulp-coveralls');
var tsc = require('gulp-typescript');
var karma = require('karma').server;
var del = require('del');

var paths = {
    app: 'app/',
    dist: 'dist/',
    amd: 'dist/amd',
    commonjs: 'dist/commonjs',
    appSourceDest: 'app/src',
    appTestDest: 'app/test',
    libSource: ['src/*.ts'],
    libTest: ['test/*.ts']
};

var shouldExit = true;

gulp.task('clean', function(cb) {
    del([paths.dist, paths.app], cb);
});

gulp.task('build-source', ['clean'], function() {
    var tsResult = gulp.src(paths.libSource)
        .pipe(tsc({
            module: 'amd',
            target: 'ES5',
            declarationFiles: true
        }));

    tsResult.dts.pipe(gulp.dest(paths.amd));
    tsResult.js.pipe(gulp.dest(paths.amd))
    return tsResult.js.pipe(gulp.dest(paths.appSourceDest));
});

gulp.task('build-test', ['clean', 'build-source'], function() {
    return gulp.src(paths.libTest)
        .pipe(tsc({
            module: 'amd',
            target: 'ES5',
            declarationFiles: false
        }))
        .pipe(gulp.dest(paths.appTestDest));
});

gulp.task('build', ['build-source', 'build-test']);

gulp.task('test', ['build'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('covertest', ['build','test'], function() {
    return gulp.src('coverage/**/lcov.info')
        .pipe(coveralls());

});

gulp.task('default', ['build', 'test']);
