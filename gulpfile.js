var gulp = require('gulp');

var notify = require('gulp-notify');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var minifyCSS = require('gulp-minify-css');

var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var gutil = require('gulp-util');
var chalk = require('chalk');

var paths = {
	stylFiles: ['./_src/styl/**/*.styl'],
	jsFiles: ['./_src/js/**/*.js'],

	cssBuild: './assets/css/',

	jsEntry: './_src/js/',
	jsBuild: './assets/js/'
};

function map_error(err) {
	if (err.fileName) {
		gutil.log(
			chalk.red(err.name)
			+ ': '
			+ chalk.yellow(err.fileName.replace(__dirname + './_src/js/', ''))
			+ ': '
			+ 'Line '
			+ chalk.magenta(err.lineNumber)
			+ ' & '
			+ 'Column '
			+ chalk.magenta(err.columnNumber || err.column)
			+ ': '
			+ chalk.blue(err.description)
		)
	} else {
		gutil.log(
			chalk.red(err.name)
			+ ': '
			+ chalk.yellow(err.message)
		)
	}

	this.emit('end');
}

var buildStylesFiles = function (files,build) {

	return gulp.src(files)
		.pipe(stylus({
			url: {
				name: 'inline-image'
			}
		}))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.init())
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
		.pipe(sourcemaps.write('.'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(build));
};
var buildStyles = function () {
	buildStylesFiles(paths.stylFiles, paths.cssBuild);
};

var buildAppFiles = function (entry, build) {
	var bundler = browserify({
			entries: entry+'App.js',
			extensions: ['.js'],
			debug: true
		}).transform(
			babelify.configure({
				plugins: ["babel-plugin-object-assign"]
			})
		);

	var bundle = function () {
		return bundler
			.bundle()
			.on('error', map_error)
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest(build))
			.pipe(notify({message: 'Build completed'}));
	};
	
	return bundle();
};

var buildApp = function () {
	buildAppFiles(paths.jsEntry, paths.jsBuild);
};

gulp.task('buildStyles', buildStyles);
gulp.task('buildApp', buildApp);

gulp.task('watch', function() {
	gulp.watch(paths.stylFiles, ['buildStyles']);
	gulp.watch(paths.jsFiles, ['buildApp']);
});

gulp.task('default', ['watch', 'buildStyles', 'buildApp']);