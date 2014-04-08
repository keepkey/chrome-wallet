var trove = angular.module( 'trove', ['ngRoute', 'ngAnimate'])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
  when('/home', {
    contoller: 'HomeCtrl',
    templateUrl: 'app/home/home.tpl.html'
  }).
  when('/initializing', {
    contoller: 'InitializingCtrl',
    templateUrl: 'app/initializing/initializing.tpl.html'
  }).
  when('/creating', {
    contoller: 'CreatingCtrl',
    templateUrl: 'app/creating/creating.tpl.html'
  }).
  when('/', {
    contoller: 'WalletListCtrl',
    templateUrl: 'app/walletlist/walletlist.tpl.html'
  }).
  when('/wallet', {
    contoller: 'WalletCtrl',
    templateUrl: 'app/wallet/wallet.tpl.html'
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