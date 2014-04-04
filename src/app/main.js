var trove = angular.module( 'trove', ['ngRoute'])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
  when('/', {
    contoller: 'HomeCtrl',
    templateUrl: 'app/home/home.tpl.html'
  }).
  otherwise({
    redirectTo: '/'
  });
}])

.run(['$rootScope', '$location', function ($rootScope, $location, $window) {

    'use strict';

    /**
     * Helper method for main page transitions. Useful for specifying a new page partial and an arbitrary transition.
     * @param  {String} path               The root-relative url for the new route
     * @param  {String} pageAnimationClass A classname defining the desired page transition
     */
    $rootScope.go = function (path, pageAnimationClass) {

        if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
            $rootScope.pageAnimationClass = 'slideLeft';
        } else { // Use the specified animation
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        $location.path(path);
    };
}])

;