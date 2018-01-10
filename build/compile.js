const gulp = require('gulp');

const SCRIPT_SOURCE = `${__dirname}/../src/**/*.es`;
const SCRIPT_OUTPUT = `${__dirname}/../lib`;

const STYLE_SOURCE = `${__dirname}/../index.styl`;
const STYLE_OUTPUT_FOLDER = `${__dirname}/../`;
const STYLE_FILE = 'style.css';

const stylusOptions = {
  use: [require('nib')()],
  paths: [
    `${__dirname}/../client`,
    `${__dirname}/../node_modules`,
  ],
  urlfunc: 'embedurl',
  errors: true,
};

gulp.task('compile:clean', () => require('del')([
  SCRIPT_OUTPUT,
  `${STYLE_OUTPUT_FOLDER}${STYLE_FILE}`,
]));

gulp.task('compile:babel', () => (
  gulp.src(SCRIPT_SOURCE)
    .pipe(require('gulp-babel')())
    .pipe(gulp.dest(SCRIPT_OUTPUT))
));

gulp.task('compile:styles', () => (
  gulp.src(STYLE_SOURCE)
    .pipe(require('gulp-stylus')(stylusOptions))
    .pipe(require('gulp-rename')(STYLE_FILE))
    .pipe(gulp.dest(STYLE_OUTPUT_FOLDER))
));

gulp.task('compile', gulp.series(
  'compile:clean',
  gulp.parallel('compile:babel', 'compile:styles'),
));
