
let gulp = require('gulp');
let clean = require('gulp-clean');
let minify = require('gulp-clean-css');
let uglify = require('gulp-uglify');
let flatten = require('gulp-flatten');
let subree = require('gulp-subtree');
let browserSync = require('browser-sync');
let htmlmin = require('gulp-htmlmin');
let rename = require('gulp-rename');
let concat = require('gulp-concat');

/* Clean task*/
gulp.task('clean', function() {
  return gulp.src('build/', { read: false })
    .pipe(clean());
});

/* Load templates */
gulp.task('templates', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.reload({stream:true}));
});

/* Minify css */
gulp.task('css', function() {
  return gulp.src([
      'components/font-awesome/css/font-awesome.css',
      'src/assets/css/*.css',
      'components/bxslider-4/src/css/jquery.bxslider.css'
    ])
    .pipe(concat('app.min.css'))
    .pipe(minify())
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

/* Copy folders */
gulp.task('copy', function() {
  gulp.src('src/assets/img/*')
    .pipe(gulp.dest('build/assets/img'));
  gulp.src('components/bxslider-4/dist/images/*')
    .pipe(gulp.dest('build/assets/css/images/'))
  return gulp.src('components/font-awesome/fonts/*')
    .pipe(gulp.dest('build/assets/fonts'));
});

/* Concat JS*/
gulp.task('appScripts', function() {
  return gulp.src('./src/js/app.js')
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('libScripts', function() {
  return gulp.src([
      'components/jquery/dist/jquery.js',
      'components/bxslider-4/src/js/jquery.bxslider.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

/* Watch */
gulp.task('watch', function() {
  gulp.watch(['src/*.html'], ['templates']);
  gulp.watch(['src/js/*.js'], ['appScripts']);
  gulp.watch(['src/assets/css/*.css'], ['css']);
  return;
});

/* Upload to production */
gulp.task('release', function(){
  return gulp.src('build')
    .pipe(subree({
      remote: 'origin',
      branch: 'gh-pages',
      message: 'Uploading to production'
    }));
});

/* Server init */
gulp.task('browserSync', function(){
  browserSync({
    host: 'localhost',
    port: 3000,
    open: 'external',
    server: {
      baseDir: 'build/'
    }
  })
});

/* Build */
gulp.task('build', [
  'appScripts',
  'libScripts',
  'copy',
  'css',
  'templates'
]);

gulp.task('build:dev', [
  'appScripts',
  'libScripts',
  'copy',
  'templates',
  'css',
  'watch'
]);


/* Init app*/
gulp.task('default', ['clean'], function(){
  gulp.start('build:dev');
  gulp.start('browserSync');
});
