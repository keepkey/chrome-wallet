angular.module('kkWallet')
  .directive('accountBalance', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        account: '=',
        loading: '=',
        accountSettings: '=', 
        nameDisplay: '@',
        singleAccount: '=',
        currency: '=',
        fresh: '='
      },
      controller: ['$scope',
        function($scope) {
          if ($scope.nameDisplay === 'number') {
            $scope.name = 'Account #' + $scope.account.accountNumber;
          } else if ($scope.nameDisplay === 'name') {
            $scope.name = $scope.account.name;
          }

          $scope.canEdit = function() {
            return typeof $scope.accountSettings === 'function';
          };
        }
      ],
      templateUrl: 'app/popup/directives/AccountBalanceComponent.tpl.html'
    };
  });