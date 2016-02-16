'use strict';
var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),

    src = 'src',
    src_css = '/sass',
    src_js = '/js',
    dest_css = 'assets/css',
    dest_js = 'assets/js';

/* Generate CSS */
gulp.task('generate_css', function () {
    return gulp.src(src + src_css + '/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest_css))
});

/* Generate JS */
gulp.task('generate_js', function() {
    return gulp.src(src + src_js + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dest_js))
});

/* Generate Templates */
gulp.task('generate_templates', function() {
    var YOUR_LOCALS = {};

    gulp.src(src + '/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('./'))
});

/* Watch CSS & Js */
gulp.task('watch', function() {
    gulp.watch(src + '/**/*.scss', ['generate_css']);
    gulp.watch(src + '/**/*.js', ['generate_js']);
    gulp.watch(src + '/**/*.jade', ['generate_templates']);
});

/* Clean files */
gulp.task('clean', function(){
    return del([dest_css + '/*', dest_js + '/*', '*.html']);
});

/* Build CSS & JSS */
gulp.task('build', [ 'generate_css','generate_js','generate_templates' ] ,function(){
    return require('fs').writeFile('version.txt', new Date());
});

/* Default task */
gulp.task('default', ['build', 'watch']);
