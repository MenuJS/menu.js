'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var uglifySaveLicense = require('uglify-save-license');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var wrap = require('gulp-wrap');

var options = {
    src: './src',
    dist: './dist',
    errorHandler: function(title) {
        return function(err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            this.emit('end');
        };
    }
};

gulp.task('js', function () {
    return gulp.src([
        options.src + '/menu.js',
        options.src + '/extend.js',
        options.src + '/menu-item.js',
        options.src + '/exports.js'
    ])
    .pipe(concat('menu.js'))
    .pipe(wrap('(function(global){\n\'use strict\';\n <%= contents %>\n})(this);'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(options.dist))
    .pipe(sourcemaps.init())
    .pipe(uglify({ preserveComments: uglifySaveLicense, enclose: true })).on('error', options.errorHandler('Uglify'))
    .pipe(sourcemaps.write())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest(options.dist));
});

gulp.task('default', ['css', 'js']);

gulp.task('watch', function () {
    gulp.watch(options.src + '/*.js', ['js']);
});
