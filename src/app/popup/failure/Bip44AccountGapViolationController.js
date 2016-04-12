angular.module('kkWallet')
  .controller('Bip44AccountGapViolationController', ['$scope', '$routeParams',
    function FailureController($scope, $routeParams) {
      $scope.previousAccountName = $routeParams.previousAccountName;
    }
  ]);
