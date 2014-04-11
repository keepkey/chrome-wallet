var kkWallet = angular.module( 'kkWallet', ['ngRoute', 'ngAnimate'])

.config(['$routeProvider',function($routeProvider) {
  $routeProvider.
    when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'app/home/home.tpl.html'
    }).
    when('/initialize', {
      controller: 'InitializeCtrl',
      templateUrl: 'app/initialize/initialize.tpl.html'
    }).
    when('/initializing', {
      controller: 'InitializingCtrl',
      templateUrl: 'app/initializing/initializing.tpl.html'
    }).
    when('/creating', {
      controller: 'CreatingCtrl',
      templateUrl: 'app/creating/creating.tpl.html'
    }).
    when('/send', {
      controller: 'SendCtrl',
      templateUrl: 'app/send/send.tpl.html'
    }).
    when('/receive', {
      controller: 'ReceiveCtrl',
      templateUrl: 'app/receive/receive.tpl.html'
    }).
    when('/password', {
      controller: 'PasswordCtrl',
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

;