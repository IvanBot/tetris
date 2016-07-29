var gulp         = require('gulp'),
    coffee       = require('gulp-coffee'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');
    jade         = require('gulp-jade'),
    bs           = require('browser-sync').create(),
    plumber      = require('gulp-plumber');

// gulp.task('coffee', function() {
//   gulp.src('app/**/*.coffee', { base: 'app' })
//     .pipe(plumber())
//     .pipe(coffee({bare: true}).on('error', function(err) {}))
//     .pipe(gulp.dest('build'))
// });

// gulp.task('sass', function() {
//   gulp.src('app/**/*.scss', { base: 'app' })
//     .pipe(plumber())
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('build'))
// });

// gulp.task('autoprefixer', function() {
//   gulp.src('build/**/*.css', { base: 'build' })
//     .pipe(autoprefixer())
//     .pipe(gulp.dest('build'))
// });

// gulp.task('jade', function() {
//   gulp.src('app/**/*.jade', { base: 'app' })
//   .pipe(plumber())
//   .pipe(jade({pretty: true}))
//   .pipe(gulp.dest('build'))
// });

gulp.task('default', ['bs'], function() {

  // gulp.watch('app/**/*.coffee', ['coffee'], bs.reload);
  // gulp.watch('app/**/*.scss', ['sass']);
  // gulp.watch('build/**/*.css', ['autoprefixer'], bs.reload);
  // gulp.watch('app/**/*.jade', ['jade'], bs.reload);

});

gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: "build"
    }
  });
});
