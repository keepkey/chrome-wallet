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

;