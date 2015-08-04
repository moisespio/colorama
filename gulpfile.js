var gulp = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');

var base = './';
var source = base + 'sources/';
var compiled = base + 'www/public/';

gulp.task('scripts', function() {
	return gulp.src([
		source + 'scripts/application/**/*.js',
		source + 'scripts/main.js'
	]).pipe(concat('all.js')).pipe(gulp.dest(compiled + 'scripts')).pipe(livereload());
});

gulp.task('vendor', function() {
	return gulp.src([
		source + 'scripts/vendor/jquery-1.11.0.min.js',
        source + 'scripts/vendor/microevent.js',
        source + 'scripts/vendor/pixi.js',
        source + 'scripts/vendor/class.js',
        source + 'scripts/vendor/easegame/**/*.js'
	]).pipe(concat('vendor.js')).pipe(gulp.dest(compiled + 'scripts')).pipe(livereload());
});

gulp.task('watch', ['scripts'], function() {
	livereload.listen();
	gulp.watch(source + 'scripts/**/*.js', ['scripts']);
});
