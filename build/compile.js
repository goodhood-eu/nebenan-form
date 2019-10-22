const gulp = require('gulp');
const sass = require('sass');
const gulpSass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const SCRIPT_SOURCE = `${__dirname}/../src/**/*.es`;
const SCRIPT_OUTPUT = `${__dirname}/../lib`;

const STYLE_SOURCE = `${__dirname}/../index.scss`;
const STYLE_OUTPUT_FOLDER = `${__dirname}/../`;
const STYLE_FILE = 'style.css';

const sassOptions = {
  fiber: require('fibers'),
  includePaths: [
    `${__dirname}/../client`,
    `${__dirname}/../node_modules`,
  ],
  functions: require('sass-functions')({ sass }),
  importer: require('node-sass-glob-importer')(),
  outputStyle: 'expanded',
  sourceComments: true,
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
    .pipe(sourcemaps.init())
    .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
    .pipe(require('gulp-postcss')([
      require('autoprefixer')(),
      require('postcss-flexbugs-fixes'),
    ]))
    .pipe(require('gulp-rename')(STYLE_FILE))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(STYLE_OUTPUT_FOLDER))
));

gulp.task('compile', gulp.series(
  'compile:clean',
  gulp.parallel('compile:babel', 'compile:styles'),
));
