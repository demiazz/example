var gulp = require('gulp');
var concat = require('gulp-concat');

var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('styles', function() {
  return gulp.src('./_src/styles/*.styl')
    .pipe(stylus({}))
    .pipe(concat('eh-notifications.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('scripts', function() {
  browserify('./_src/scripts/app.jsx', { debug: true })
    .transform(babelify, {})
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('watch', function() {
  gulp.watch('./_src/scripts/**/*.jsx', ['scripts']);
  gulp.watch('./_src/styles/*.styl', ['styles']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);