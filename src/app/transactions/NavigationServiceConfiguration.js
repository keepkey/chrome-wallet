angular.module('kkTransactions')
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.caseInsensitiveMatch = true;
      $routeProvider
        .when('/:walletId', {
          templateUrl: 'app/transactions/transaction.tpl.html',
          goable: true
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
