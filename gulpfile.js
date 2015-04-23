// Requires
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var merge2 = require('merge2');
var bowerMain = require('bower-main');
var bump = require('gulp-bump');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var jeditor = require("gulp-json-editor");
var replace = require('gulp-replace');
var minifyHTML = require('gulp-minify-html');
var zip = require('gulp-zip');
var jsonminify = require('gulp-jsonminify');
var minifyCss = require('gulp-minify-css');

// Settings
var vendorJavascriptFiles = [
    'vendor/angular/angular.min.js',
    'vendor/angular-animate/angular-animate.min.js',
    'vendor/angular-route/angular-route.min.js'
];
var versionedFiles = ['./bower.json', './manifest.json', './package.json'];

// Default task
gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

gulp.task('build', ['vendorScriptsProduction', 'appScriptsProduction', 'cssProduction', 'assetsProduction',
    'htmlProduction', 'manifestProduction', 'zip']);

gulp.task('vendorScriptsProduction', function () {
    return gulp.src(vendorJavascriptFiles)
        .pipe(concat('vendor-scripts.min.js'))
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

gulp.task('zip', function() {
    return gulp.src('dist/**/*')
        .pipe(zip('keepkey-wallet-test.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('appScriptsProduction', function () {
    return merge2(
        gulp.src('src/app/**/*.js')
            .pipe(concat('tmpsrc.min.js'))
            .pipe(uglify()),
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

gulp.task('cssProduction', function () {
    return gulp.src('src/css/**/*')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('manifestProduction', function () {
    return gulp.src('manifest.json')
        .pipe(jeditor(function (json) {
            json.options_page = json.options_page.replace('src/', '');
            json.browser_action.default_icon = json.browser_action.default_icon.replace('src/', '');
            json.browser_action.default_popup = json.browser_action.default_popup.replace('src/', '');
            json.icons["16"] = json.icons["16"].replace('src/', '');
            json.icons["48"] = json.icons["48"].replace('src/', '');
            json.icons["128"] = json.icons["128"].replace('src/', '');

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