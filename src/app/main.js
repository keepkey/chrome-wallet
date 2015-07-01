angular.module('kkWallet', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'indexedDB',
    'xeditable'])
    .constant('VERSION', '{{VERSION}}');