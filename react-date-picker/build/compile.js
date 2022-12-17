const gulp = require('gulp');

const SCRIPT_SOURCE = `${__dirname}/../src/**/*.jsx`;
const SCRIPT_OUTPUT = `${__dirname}/../lib`;

gulp.task('compile:clean', () => require('del')([SCRIPT_OUTPUT]));

gulp.task('compile:babel', () => (
  gulp.src(SCRIPT_SOURCE)
    .pipe(require('gulp-babel')())
    .pipe(gulp.dest(SCRIPT_OUTPUT))
));

gulp.task('compile', gulp.series(
  'compile:clean',
  'compile:babel',
));
