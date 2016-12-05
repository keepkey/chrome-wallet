// Requires
var _ = require('lodash');
var gulp = require('gulp');
var concat = require('gulp-concat');
var bump = require('gulp-bump');
var del = require('del');
var replace = require('gulp-replace');
var zip = require('gulp-zip');
var jsonminify = require('gulp-jsonminify');
var args = require('yargs').argv;
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');
var hjson = require('gulp-hjson');
var jsoncombine = require('gulp-jsoncombine');

var environment = (args.environment || 'local');

// Settings
var versionedFiles = ['./bower.json', './manifest.json', './package.json'];

// Default task
gulp.task('default', ['test', 'build', 'watch']);

gulp.task('clean', function (cb) {
  del(['dist', 'build', '*.zip', 'vendor', 'node_modules'], cb);
});

gulp.task('build', [
  'backgroundScript',
  'assets',
  'manifest',
  'zip'
]);

gulp.task('hjson2json', function() {
  return gulp.src('config/**/*.hjson')
    .pipe(hjson({to: 'json'}))
    .pipe(gulp.dest('build'));
});

gulp.task('buildConfig', ['hjson2json', 'proxyConfig'], function () {
  return gulp.src([
      'build/global.json',
      'build/environments/' + environment + '.json',
      'build/proxyConfig.json'
    ])
    .pipe(jsoncombine('config.json', function (files) {
      return new Buffer(JSON.stringify(_.merge.apply(_, _.values(files))));
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('buildBackgroundConfig', ['buildConfig'], function() {
  return gulp.src('build/config.json')
    .pipe(wrap('var config=<%= JSON.stringify(contents) %>;'))
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('build'));
});

gulp.task('proxyConfig', ['hjson2json'], function() {
  return gulp.src(['build/environments/*.json', 'build/conflicting-applications.json'])
    .pipe(jsoncombine('proxyConfig.json', function (files) {
      var foreignFiles = _.omit(files, [environment, 'conflicting-applications']);
      var appIds = _.uniq(_.map(_.values(foreignFiles), function(file) {
        return _.get(file, 'keepkeyProxy.applicationId');
      }));
      var otherAppIds = _.get(files, 'conflicting-applications.conflictingApplicationIds');
      return new Buffer('{"foreignKeepkeyProxies":' + JSON.stringify(appIds) +
        ',"foreignConflictingApplicationIds":' + JSON.stringify(otherAppIds) + '}');
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('backgroundScript', ['buildBackgroundConfig'], function () {
  return gulp.src(['build/config.js', 'src/background.js'])
    .pipe(concat('background.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('zip', function () {
  return gulp.src('dist/**/*')
    .pipe(zip('keepkey-wallet-' + environment + '.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('assets', function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('manifest', function () {

  var environmentTag = (environment !== "prod") ?
  ' (' + environment + ')' : '';

  return gulp.src('manifest.json')
    .pipe(replace(/"name": "(.*)"/g, '"name": "$1' + environmentTag + '"'))
    .pipe(jsonminify())
    .pipe(gulp.dest("dist"));
});

gulp.task('bumpPatch', function () {
  gulp.src(versionedFiles)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bumpMinor', function () {
  gulp.src(versionedFiles)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bumpMajor', function () {
  gulp.src(versionedFiles)
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});
