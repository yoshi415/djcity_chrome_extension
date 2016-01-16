var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

function build(file) {
  browserify('./plugin/source/' + file + '/' + file + '.js')
  .bundle()
  .on('error', function(error) {
    gutil.log(error);
  })
  .pipe(source(file + '.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./plugin/extension/js'));
}

gulp.task('buildBackground', function() {
  build('background');
});

gulp.task('buildContent', function() {
  build('content');
});

gulp.task('buildPopup', function() {
  build('popup');
});

gulp.task('build', [
  'buildBackground', 
  'buildContent', 
  'buildPopup'
  ]);

gulp.task('watch', function() {
    gulp.watch('plugin/source/**/*.js', [ 'build' ]);
});