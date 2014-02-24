var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    pkg = require('./package.json');

require('coffee-script/register');

var banner = "/* <%= name %> v<%= version %> built <%= (new Date).toDateString() %> */";

gulp.task('test', function () {
  gulp.src('./test/*.coffee')
    .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('coffee', function () {
  gulp.src('./turnpike.coffee')
    .pipe(coffee())
    .pipe(header(banner+'\n', pkg))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('compress', function () {
  gulp.src('./lib/turnpike.js')
    .pipe(uglify())
    .pipe(concat('turnpike.min.js'))
    .pipe(header(banner, pkg))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('build', ['coffee', 'compress']);
gulp.task('default', ['test', 'build']);
