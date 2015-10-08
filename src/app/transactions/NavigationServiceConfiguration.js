angular.module('kkTransactions')
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/:walletId', {
          templateUrl: 'app/transactions/transaction.tpl.html',
          goable: true
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
