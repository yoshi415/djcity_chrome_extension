var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

function build(file) {
  browserify('./plugin/source/' + file + '/' + file + '.js')
  .bundle()
  .on('error', function(error) {
    gutil.log(error);
  })
  .pipe(source(file + '.js'))
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

gulp.task('watch', function() {
  gulp.watch('source/**/*.js');
});

gulp.task('build', [
  'buildBackground', 
  'buildContent', 
  'buildPopup'
  ], 
  function() {
    console.log("Build complete!");
  }
);