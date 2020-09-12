var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

function browser_sync() {
	browserSync.init({
		server: {
			baseDir: "./app"
		},
		notify: false
	});
};

gulp.task(browser_sync, gulp.series(styles, scripts))

function styles() {
	return gulp.src('scss/*.scss')
		.pipe(sass({
			includePaths: require('node-bourbon').includePaths
		}).on('error', sass.logError))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer({ browsers: ['last 15 versions'], cascade: false }))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
};

gulp.task(styles)


function scripts() {
	return gulp.src([
		'./app/libs/modernizr/modernizr.js',
		'./app/libs/jquery/jquery-1.11.2.min.js',
		'./app/libs/waypoints/waypoints.min.js',
		'./app/libs/animate/animate-css.js',
	])
		.pipe(concat('libs.js'))
		// .pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/js/'));
};

gulp.task(scripts)

function watch() {
	gulp.watch('scss/*.scss', gulp.series(styles));
	gulp.watch('app/libs/**/*.js', gulp.series(scripts));
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
};

gulp.task(watch)

gulp.task('default', gulp.series(gulp.parallel(browser_sync, watch)));
