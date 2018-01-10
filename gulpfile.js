const gulp = require('gulp');

require('./build/compile');
require('./build/preview');

const nodemonOptions = {
  script: './preview/server.js',
  ext: 'js es',
  watch: [
    'lib/*',
    'preview/*',
  ],
  ignore: [
    'build',
    'src/',
    'preview/public/',
    'test/',
    'node_modules',
  ],
  delay: 1500,
};

const scripts = [
  'src/**/*.es',
  'preview/**/*.es',
  'preview/**/*.js',
  '!preview/public/*.js',
  '!preview/server.js',
];

const stylesheets = [
  'src/**/*.styl',
  'preview/**/*.styl',
];


gulp.task('build', gulp.series(
  'compile:clean',
  'preview:clean',
  gulp.parallel('compile:babel', 'compile:styles'),
  gulp.parallel('preview:babel', 'preview:styles'),
));

gulp.task('watch', (done) => {
  require('gulp-nodemon')(nodemonOptions);
  gulp.watch(scripts, gulp.series('compile:babel', 'preview:babel'));
  gulp.watch(stylesheets, gulp.series('compile:styles', 'preview:styles'));
  done();
});

gulp.task('default', gulp.series('build', 'watch'));
