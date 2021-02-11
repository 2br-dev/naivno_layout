'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var include = require('gulp-file-include');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var order = require('gulp-order');
var browserSync = require('browser-sync').init({
	server: {
		baseDir: './release/'
	}
});

gulp.task('include', function(){
	return gulp.src('./src/html/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/'));
})

gulp.task('sass', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./release/css'))
		.pipe(browserSync.stream());
});

gulp.task('html', function(){
	return gulp.src('./release/*.html')
		.pipe(browserSync.stream());
});

gulp.task('js', function(){
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(order([
			"jquery.lazy.js",
			"materialize.js",
			"swiper-bundle.js",
			"jquery.hyphen.ru.min.js",
			"master.js",
			"brand.js"
		]))
		.pipe(concat('master.js'))
		.pipe(gulp.dest('./release/js/'))
		.pipe(browserSync.stream());
});

gulp.task('watch', function(){
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('./release/*.html', gulp.series('html'));
	gulp.watch('./src/html/**/*.html', gulp.series('include'));
	gulp.watch('./src/js/*.js', gulp.series('js'));
});