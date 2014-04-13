var kkWallet = angular.module( 'kkWallet', ['ngRoute', 'ngAnimate'])

// define keepkey status constants
.constant('KEEPKEY_DISCONNECTED', -1)
.constant('KEEPKEY_UNINITIALIZED', 0)
.constant('KEEPKEY_READY', 1)

.config(['$routeProvider',function($routeProvider) {
  $routeProvider.
  when('/disconnected', {
    templateUrl: 'app/disconnected/disconnected.tpl.html'
  }).
  when('/wallets', {
    templateUrl: 'app/wallets/wallets.tpl.html'
  }).
  when('/wallet/:walletId', {
    templateUrl: 'app/wallet/wallet.tpl.html'
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

.controller('KKWalletCtrl', ['$scope', '$location', function($scope, $location){
  $location.path('/wallets');
}])

;