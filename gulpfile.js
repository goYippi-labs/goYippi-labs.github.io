'use strict';
var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-dart-sass'),
    pug = require('gulp-pug'),

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
  return gulp.src(src + '/*.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('./'))
});

/* Watch CSS & Js */
gulp.task('watch', function() {
    gulp.watch(src + '/**/*.scss', ['generate_css']);
    gulp.watch(src + '/**/*.js', ['generate_js']);
    gulp.watch(src + '/**/*.pug', ['generate_templates']);
});

/* Clean files */
gulp.task('clean', function(){
    return del([dest_css + '/*', dest_js + '/*', '*.html']);
});

/* Build CSS & JSS */
gulp.task('build', gulp.parallel( 'generate_css','generate_js','generate_templates' ) ,function(){
    return require('fs').writeFileSync('version.txt', new Date());
});

/* Default task */
gulp.task('default', gulp.parallel('build', 'watch'));
