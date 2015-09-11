/*global -$ */
'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('templates', function () {
  gulp.src('app/templates/*.html')
    .pipe($.templateCompile({
      namespace: 'GovRight.templates',
      name: function (file) {
        return path.basename(file.relative, '.html');
      },
      // We use Mustache-style template tags, even though we're
      // lodashing it.
      templateSettings: {
        evaluate:    /\{\{(.+?)\}\}/g,
        interpolate: /\{\{=(.+?)\}\}/g,
        escape: /\{\{-(.+?)\}\}/g
      }
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('.tmp/scripts/'));
});

gulp.task('html', ['templates','inject'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['config:development', 'templates', 'inject'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/scripts/**/*.js',
    'app/scripts/**/*.js'
  ]).on('change', reload);

  gulp.watch('app/scripts/**/*.js', ['inject']);
  gulp.watch('app/templates/**/*.html', ['templates']);
});

// Inject file references into index.html
gulp.task('inject', function () {
  var injectScripts = gulp.src([
    'app/scripts/'+'**'+'/'+'*.js',
    '!app/scripts/'+'**'+'/'+'*.spec.js',
    '!app/scripts/'+'**'+'/'+'*.mock.js'])
    .pipe($.naturalSort());

  var injectOptions = {
    ignorePath: ['app', '.tmp'],
    addRootSlash: false
  };

  return gulp.src('app/*.html')
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(gulp.dest('app'));
});

function configTask(env) {
  gulp.src('config/' + env + '.json')
  .pipe($.wrap('this["GovRight"] = this["GovRight"] || {}; this["GovRight"]["SiteConfig"] = <%= JSON.stringify(contents.SiteConfig) %>;'))
  .pipe($.rename('config.js'))
  .pipe(gulp.dest('.tmp/scripts/'));
}

gulp.task('config:development', configTask.bind(null, 'development'));
gulp.task('config:production', configTask.bind(null, 'production'));

gulp.task('build', ['config:production', 'jshint', 'html'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
