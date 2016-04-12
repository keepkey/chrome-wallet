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
var cleanCss = require('gulp-clean-css');
var args = require('yargs').argv;
var ngConstant = require('gulp-ng-constant');
var mocha = require('gulp-mocha');
var karma = require('karma').server;
var manifest = require('./manifest');
var wrap = require('gulp-wrap');
var rename = require('gulp-rename');

var environment = (args.environment || 'local');

// Settings
var vendorJavascriptFiles = [
  'vendor/angular/angular.min.js',
  'vendor/angular-animate/angular-animate.min.js',
  'vendor/angular-route/angular-route.min.js',
  'vendor/angular-messages/angular-messages.min.js',
  'vendor/angular-bootstrap/ui-bootstrap.min.js',
  'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'vendor/lodash/lodash.min.js',
  'vendor/angular-xeditable/dist/js/xeditable.min.js',
  'vendor/qrcode-generator/js/qrcode.js',
  'vendor/angular-qrcode/angular-qrcode.js',
  'vendor/clipboard/dist/clipboard.min.js',
  'vendor/semver/semver.min.js'
];
var versionedFiles = ['./bower.json', './manifest.json', './package.json'];


// Default task
gulp.task('default', ['test', 'build', 'watch']);

gulp.task('clean', function (cb) {
  del(['dist', 'generatedJs', '*.zip'], cb);
});

gulp.task('build', [
  'vendorScriptsProduction',
  'appCommonScripts',
  'appPopupScripts',
  'appTransactionScripts',
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
    name: 'kkCommon',
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

gulp.task('wrapJson', function() {
  return gulp.src('config/' + environment + '.json')
    .pipe(wrap('var config=<%= JSON.stringify(contents) %>;'))
    .pipe(rename({suffix: '.json', extname: '.js'}))
    .pipe(gulp.dest('generatedJs'));
});

gulp.task('backgroundScript', ['wrapJson'], function () {
  return gulp.src(['generatedJs/' + environment + '.json.js', 'src/background.js'])
    .pipe(concat('background.js'))
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

gulp.task('zip', ['vendorScriptsProduction', 'appCommonScripts', 'appPopupScripts', 'appTransactionScripts', 'cssProduction', 'assetsProduction',
  'htmlProduction', 'manifestProduction', 'buildConfig'], function () {
  return gulp.src('dist/**/*')
    .pipe(zip('keepkey-wallet-' + environment + '.zip'))
    .pipe(gulp.dest('.'));
});

function appScriptBuilder(moduleName, angularModuleName, extraFiles) {
  var sources = [
    ['src', 'app', moduleName, moduleName + '.js'].join('/'),
    ['src', 'app', moduleName, '**/*.js'].join('/'),
    '!' + ['src', 'app', moduleName, '**/*.spec.js'].join('/')
  ];

  if (typeof extraFiles !== 'function') {
    Array.prototype.push.apply(sources, extraFiles);
  }

  var tempMinifiedFile = moduleName + '.tmpsrc.min.js';
  var templateSourceFiles = 'src/app/' + moduleName + '/**/*.tpl.html';
  var templateRootPath = 'app/' + moduleName;
  var outputFileName = moduleName + '.js';

  var jsScriptStream = gulp.src(sources)
    .pipe(replace("{{VERSION}}", manifest.version))
    .pipe(concat(tempMinifiedFile));
  //.pipe(uglify());

  var templateStream = gulp.src(templateSourceFiles)
    .pipe(minifyHTML())
    .pipe(templateCache({
      root: templateRootPath,
      module: angularModuleName
    }));

  return merge2(jsScriptStream, templateStream)
    .pipe(concat(outputFileName))
    .pipe(gulp.dest('dist'));
}

gulp.task('appCommonScripts', ['buildConfig'],
  appScriptBuilder.bind(this, 'common', 'kkCommon', [
    'generatedJs/constants.js'
  ])
);

gulp.task('appPopupScripts', ['buildConfig'],
  appScriptBuilder.bind(this, 'popup', 'kkWallet')
);

gulp.task('appTransactionScripts', ['buildConfig'],
  appScriptBuilder.bind(this, 'transactions', 'kkTransactions')
);

gulp.task('assetsProduction', function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('less', function () {
  return gulp.src('src/styles/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('cssProduction', function () {
  return gulp.src([
    'vendor/angular/angular-csp.css',
    'vendor/angular-bootstrap/ui-bootstrap-csp.css',
    'vendor/angular-xeditable/dist/css/xeditable.css',
    'src/styles/**/*.css'])
    .pipe(cleanCss())
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
