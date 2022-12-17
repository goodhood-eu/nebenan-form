const gulp = require('gulp');

require('./build/compile');
require('./build/preview');

const nodemonOptions = {
  script: './preview/server.js',
  ext: 'js jsx',
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
  'src/**/*.jsx',
  'preview/**/*.jsx',
  'preview/**/*.js',
  '!preview/public/*.js',
  '!preview/server.js',
];

const stylesheets = [
  'preview/**/*.scss',
];


gulp.task('build', gulp.series(
  'compile:clean',
  'preview:clean',
  gulp.parallel('compile:babel'),
  gulp.parallel('preview:babel', 'preview:styles'),
));

gulp.task('watch', (done) => {
  const livereload = require('tiny-lr');
  const nodemon = require('nodemon')(nodemonOptions);
  const reloadPage = () => { livereload.changed('script.js'); };

  const reloadStylesheets = () => {
    livereload.changed('style.css');
    return Promise.resolve();
  };

  livereload().listen();
  nodemon.on('log', (log) => { console.log(log.colour); });
  nodemon.on('start', () => setTimeout(reloadPage, 1500));

  gulp.watch(scripts, gulp.series('compile:babel', 'preview:babel'));
  gulp.watch(stylesheets, gulp.series('preview:styles', reloadStylesheets));
  done();
});

gulp.task('default', gulp.series('build', 'watch'));
