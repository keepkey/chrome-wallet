//require('main.js');
angular.module('kkWallet')
    .factory('chrome', ['$window', function (window) {
        return window.chrome;
    }])
