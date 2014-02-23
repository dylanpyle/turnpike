var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

require('coffee-script/register');

gulp.task('test', function () {
  gulp.src('./test/*.coffee')
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('coffee', function () {
  gulp.src('./turnpike.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./lib/'));
});

gulp.task('compress', function () {
  gulp.src('./lib/turnpike.js')
    .pipe(uglify())
    .pipe(concat('turnpike.min.js'))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('build', ['coffee', 'compress']);
gulp.task('default', ['test', 'build']);
