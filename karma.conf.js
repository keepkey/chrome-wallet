module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],
        files: [
            'node_modules/chai/chai.js',
            'node_modules/sinon/pkg/sinon.js',
            'node_modules/sinon-chrome/chrome.js',
            'vendor/angular/angular.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/angular-bootstrap/ui-bootstrap.min.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'vendor/angular-chrome-storage/localwrapper.js',
            'vendor/angular-xeditable/dist/js/xeditable.js',
            'vendor/angular-mocks/angular-mocks.js',
            'src/testharness/beforeeach.js',
            'src/app/main.js',
            'src/app/**/*.js',
            'src/app/**/*.spec.js'
        ]
    });
};