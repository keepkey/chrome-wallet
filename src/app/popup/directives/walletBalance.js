angular.module('kkWallet')
  .directive('walletBalance', function walletBalance() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        balance: '=',
        pending: '=',
        loading: '=',
        currency: '='
      },
      controller: ['$scope', function($scope) {
        $scope.$watch('pending', function() {
          $scope.showPending = $scope.pending &&
            !(new BigNumber($scope.pending).eq(new BigNumber(0)));
        });
      }],
      templateUrl: 'app/popup/directives/walletBalance.tpl.html'
    };
  });