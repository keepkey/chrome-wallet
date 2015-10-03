//require('main.js');
angular.module('kkCommon')
    .factory('chrome', ['$window', function (window) {
        return window.chrome;
    }]);
