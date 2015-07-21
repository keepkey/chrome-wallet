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
            'vendor/angular-bootstrap/ui-bootstrap.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'vendor/angular-indexed-db/angular-indexed-db.js',
            'vendor/angular-xeditable/dist/js/xeditable.js',
            'vendor/angular-mocks/angular-mocks.js',
            'vendor/qrcode-generator/js/qrcode.js',
            'vendor/angular-qrcode/angular-qrcode.js',
            'src/testharness/beforeeach.js',
            'src/app/main.js',
            'src/app/**/*.js',
            'src/app/**/*.spec.js'
        ]
    });
};