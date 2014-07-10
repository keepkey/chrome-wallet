var kkWallet = angular.module( 'kkWallet', ['ngRoute', 'ngAnimate'])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
  when('/', {
    templateUrl: 'app/mockup/mockup.tpl.html'
  }).
  when('/connect', {
    templateUrl: 'app/connect/connect.tpl.html'
  }).
  when('/initialize', {
    contoller: 'InitializeCtrl',
    templateUrl: 'app/initialize/initialize.tpl.html'
  }).
  when('/initializing', {
    contoller: 'InitializingCtrl',
    templateUrl: 'app/initializing/initializing.tpl.html'
  }).
  when('/creating', {
    contoller: 'CreatingCtrl',
    templateUrl: 'app/creating/creating.tpl.html'
  }).
  when('/walletlist', {
    contoller: 'WalletListCtrl',
    templateUrl: 'app/walletlist/walletlist.tpl.html'
  }).
  when('/wallet', {
    contoller: 'WalletCtrl',
    templateUrl: 'app/wallet/wallet.tpl.html'
  }).
  when('/send', {
    contoller: 'SendCtrl',
    templateUrl: 'app/send/send.tpl.html'
  }).
  when('/receive', {
    contoller: 'ReceiveCtrl',
    templateUrl: 'app/receive/receive.tpl.html'
  }).
  when('/password', {
    contoller: 'PasswordCtrl',
    templateUrl: 'app/password/password.tpl.html'
  }).
  when('/label', {
    contoller: 'LabelCtrl',
    templateUrl: 'app/label/label.tpl.html'
  }).
  when('/syncing', {
    contoller: 'SyncingCtrl',
    templateUrl: 'app/syncing/syncing.tpl.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}])

.run(['$rootScope', '$location', function ($rootScope, $location) {

    'use strict';

    /**
     * Helper method for main page transitions. Useful for specifying a new page partial and an arbitrary transition.
     * @param  {String} path               The root-relative url for the new route
     * @param  {String} pageAnimationClass A classname defining the desired page transition
     */
    $rootScope.go = function (path, pageAnimationClass) {

        if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
            $rootScope.pageAnimationClass = '';
        } else { // Use the specified animation
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        $location.path(path);
    };
}])

;