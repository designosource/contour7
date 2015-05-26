var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    concat      = require('gulp-concat'),
    livereload  = require('gulp-livereload') // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei


// --- Basic Tasks ---
gulp.task('css', function() {
  return gulp.src('scss/*.scss')
    .pipe( 
      sass( { 
        includePaths: ['/'],
        errLogToConsole: true
      } ) )
    .pipe( csso() )
    .pipe( gulp.dest('css/') );
   // .pipe( livereload());
});

gulp.task('js', function() {
  return gulp.src('js/*.js')
    .pipe( uglify() )
    .pipe( concat('all.min.js'))
    .pipe( gulp.dest('js/min/'));
    //.pipe( livereload());
});

gulp.task('watch', function () {

    gulp.watch('scss/*.scss',['css']);

    gulp.watch('js/*.js',['js']);
    
  });

// Default Task
gulp.task('default', ['js','css','watch']);
