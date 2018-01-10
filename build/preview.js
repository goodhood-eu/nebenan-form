const gulp = require('gulp');

const PUBLIC_FOLDER = `${__dirname}/../preview/public`;

const SCRIPT_SOURCE = `${__dirname}/../preview/app.es`;
const SCRIPT_FILE = 'script.js';

const STYLE_SOURCE = `${__dirname}/../preview/index.styl`;
const STYLE_FILE = 'style.css';

const stylusOptions = {
  use: [require('nib')()],
  paths: [
    `${__dirname}/../client`,
    `${__dirname}/../node_modules`,
  ],
  'include css': true,
  urlfunc: 'embedurl',
  errors: true,
};

const browserifyOptions = {
  entries: SCRIPT_SOURCE,
  extensions: ['.es'],
  debug: true,

  cache: {},
  packageCache: {},
  fullPaths: true,
};

const cacheOptions = {
  cacheFile: `${__dirname}/.browserify-cache.json`,
};

gulp.task('preview:clean', () => require('del')([PUBLIC_FOLDER]));

gulp.task('preview:babel', () => {
  const bundler = require('browserify')(browserifyOptions);
  const watcher = require('browserify-incremental')(bundler, cacheOptions);

  watcher.transform(require('babelify').configure({ extensions: ['.es'] }));

  return watcher
    .bundle()
    .pipe(require('vinyl-source-stream')(SCRIPT_FILE))
    .pipe(gulp.dest(PUBLIC_FOLDER));
});

gulp.task('preview:styles', () => (
  gulp.src(STYLE_SOURCE)
    .pipe(require('gulp-stylus')(stylusOptions))
    .pipe(require('gulp-rename')(STYLE_FILE))
    .pipe(gulp.dest(PUBLIC_FOLDER))
));

gulp.task('preview', gulp.series(
  'preview:clean',
  gulp.parallel('preview:babel', 'preview:styles'),
));
