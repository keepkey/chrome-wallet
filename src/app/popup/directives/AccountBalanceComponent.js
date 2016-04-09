angular.module('kkWallet')
  .directive('accountBalance', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        account: '=',
        loading: '=',
        nameDisplay: '@'
      },
      controller: ['$scope',
        function($scope) {
          if ($scope.nameDisplay === 'number') {
            $scope.name = 'Account #' + $scope.account.accountNumber;
          } else if ($scope.nameDisplay === 'name') {
            $scope.name = $scope.account.name;
          }
        }
      ],
      templateUrl: 'app/popup/directives/AccountBalanceComponent.tpl.html'
    };
  });