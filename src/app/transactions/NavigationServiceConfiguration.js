angular.module('kkTransactions')
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/transactions/transaction.tpl.html',
          goable: true
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
