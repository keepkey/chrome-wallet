// Requires
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var merge2 = require('merge2');
var bump = require('gulp-bump');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var jeditor = require("gulp-json-editor");
var replace = require('gulp-replace');
var minifyHTML = require('gulp-minify-html');
var zip = require('gulp-zip');
var jsonminify = require('gulp-jsonminify');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var args = require('yargs').argv;
var ngConstant = require('gulp-ng-constant');
var mocha = require('gulp-mocha');
var karma = require('karma').server;
var manifest = require('./manifest');

var environment = (args.environment || 'local');

// Settings
var vendorJavascriptFiles = [
  'vendor/angular/angular.min.js',
  'vendor/angular-animate/angular-animate.min.js',
  'vendor/angular-route/angular-route.min.js',
  'vendor/angular-bootstrap/ui-bootstrap.min.js',
  'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'vendor/lodash/lodash.min.js',
  'vendor/angular-xeditable/dist/js/xeditable.min.js',
  'vendor/qrcode-generator/js/qrcode.js',
  'vendor/angular-qrcode/angular-qrcode.js',
  'vendor/clipboard/dist/clipboard.min.js'
];
var versionedFiles = ['./bower.json', './manifest.json', './package.json'];


// Default task
gulp.task('default', ['test', 'build', 'watch']);

gulp.task('clean', function (cb) {
  del(['dist', 'generatedJs', '*.zip'], cb);
});

gulp.task('build', [
  'vendorScriptsProduction',
  'appScriptsProduction',
  'backgroundScript',
  'cssProduction',
  'less',
  'assetsProduction',
  'htmlProduction',
  'manifestProduction',
  'buildConfig',
  'zip'
]);

gulp.task('buildConfig', function () {
  var envConfig = require('./config/' + environment + '.json');
  return ngConstant({
    name: 'kkWallet',
    constants: {environmentConfig: envConfig},
    stream: true,
    deps: false
  }).pipe(gulp.dest('generatedJs'));


});

gulp.task('vendorScriptsProduction', function () {
  return gulp.src(vendorJavascriptFiles)
    .pipe(concat('vendor-scripts.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('backgroundScript', function () {
  return gulp.src(['src/background.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('htmlProduction', function () {
  gulp.src('src/*.html')
    .pipe(replace(/<script.*src=".*\/vendor\/.*"><\/script>/g, ''))
    .pipe(replace(/<script.*src="app\/.*"><\/script>/g, ''))
    .pipe(replace(/<\!-- (<script.*<\/script>) -->/g, '$1'))
    .pipe(minifyHTML({}))
    .pipe(gulp.dest('dist'));
});

gulp.task('zip', ['vendorScriptsProduction', 'appScriptsProduction', 'cssProduction', 'assetsProduction',
  'htmlProduction', 'manifestProduction', 'buildConfig'], function () {
  return gulp.src('dist/**/*')
    .pipe(zip('keepkey-wallet-' + environment + '.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('appScriptsProduction', ['buildConfig'], function () {
  return merge2(
    gulp.src(['src/app/main.js', 'src/app/**/*.js', '!src/app/**/*.spec.js', 'generatedJs/constants.js'])
      .pipe(replace("{{VERSION}}", manifest.version))
      .pipe(concat('tmpsrc.min.js')),
    //.pipe(uglify()),
    gulp.src('src/app/**/*.tpl.html')
      .pipe(minifyHTML())
      .pipe(templateCache({
        root: 'app/',
        module: 'kkWallet'
      }))
  )
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('assetsProduction', function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('less', function () {
  return gulp.src('src/styles/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('cssProduction', function () {
  return gulp.src([
    'vendor/angular/angular-csp.css',
    'vendor/bootstrap-bower/css/bootstrap.min.css',
    'vendor/angular-xeditable/dist/css/xeditable.css',
    'src/styles/**/*.css'])
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('manifestProduction', function () {

  var environmentTag = (environment !== "prod") ?
  ' (' + environment + ')' : '';

  return gulp.src('manifest.json')
    .pipe(replace(/"name": "KeepKey Wallet.*"/g, '"name": "KeepKey Wallet' + environmentTag + '"'))
    .pipe(jeditor(function (json) {
      json.options_page = json.options_page.replace('src/', '');
      json.browser_action.default_icon = json.browser_action.default_icon.replace('src/', '');
      json.browser_action.default_popup = json.browser_action.default_popup.replace('src/', '');
      json.icons["16"] = json.icons["16"].replace('src/', '');
      json.icons["48"] = json.icons["48"].replace('src/', '');
      json.icons["128"] = json.icons["128"].replace('src/', '');
      json.background.scripts[0] = json.background.scripts[0].replace('src/', '');

      return json;
    }))
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

gulp.task('bundleTemplates', function () {
  gulp.src('src/app/**/*.tpl.html')
    .pipe(templateCache())
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  return gulp.watch(['src/**/*', 'gulpfile.js', 'package.json', 'bower.json', 'manifest.json', 'config'], ['build']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    singleRun: true
  }, done);
});

gulp.task('testDebug', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['Chrome'],
    singleRun: false
  }, done);
});
