// Requires
var _ = require('lodash');
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
var gulpif = require('gulp-if');
var hjson = require('gulp-hjson');
var jsoncombine = require('gulp-jsoncombine');
var bower = require('gulp-bower');

var environment = (args.environment || 'local');

// Settings
var vendorJavascriptFiles = [
  'vendor/angular/angular.min.js',
  'vendor/angular-animate/angular-animate.min.js',
  'vendor/angular-route/angular-route.min.js',
  'vendor/angular-messages/angular-messages.min.js',
  'vendor/angular-bootstrap/ui-bootstrap.min.js',
  'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
  'vendor/lodash/dist/lodash.min.js',
  'vendor/angular-xeditable/dist/js/xeditable.min.js',
  'vendor/qrcode-generator/js/qrcode.js',
  'vendor/angular-qrcode/angular-qrcode.js',
  'vendor/clipboard/dist/clipboard.min.js',
  'vendor/semver/semver.min.js',
  'vendor/bignumber.js/bignumber.min.js'
];
var versionedFiles = ['./bower.json', './manifest.json', './package.json'];


// Default task
gulp.task('default', ['test', 'build', 'watch']);

gulp.task('clean', function (cb) {
  del(['dist', 'build', '*.zip', 'vendor', 'node_modules'], cb);
});

gulp.task('bower', function() {
  return bower();
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

gulp.task('buildAngularConfig', ['buildConfig'], function () {
  var envConfig = require('./build/config.json');
  return ngConstant({
    name: 'kkCommon',
    constants: {environmentConfig: envConfig},
    stream: true,
    deps: false
  }).pipe(gulp.dest('build'));


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

gulp.task('vendorScriptsProduction', ['bower'], function () {
  return gulp.src(vendorJavascriptFiles)
    .pipe(concat('vendor-scripts.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('backgroundScript', ['buildBackgroundConfig'], function () {
  return gulp.src(['build/config.js', 'src/background.js'])
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
    'license-header.js',
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
    .pipe(concat(tempMinifiedFile))
    .pipe(gulpif(environment !== 'local', uglify({
      preserveComments: "license"
    })));

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

gulp.task('appCommonScripts', ['buildAngularConfig'],
  appScriptBuilder.bind(this, 'common', 'kkCommon', [
    'build/ngConstants.js'
  ])
);

gulp.task('appPopupScripts',
  appScriptBuilder.bind(this, 'popup', 'kkWallet')
);

gulp.task('appTransactionScripts',
  appScriptBuilder.bind(this, 'transactions', 'kkTransactions')
);

gulp.task('assetsProduction', ['copyFonts'], function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('copyFonts', function() {
  return gulp.src(['src/fonts/**/*', 'node_modules/font-awesome/fonts/fontawesome-webfont.woff2'])
    .pipe(gulp.dest('dist/fonts'));
})

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
