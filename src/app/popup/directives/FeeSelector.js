angular.module('kkWallet')
  .directive('feeSelector', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        estimatedFees: '=',
        selected: '=',
        active: '='
      },
      controller: ['$scope', 'FeeService', 'environmentConfig',
        function ($scope, feeService, environmentConfig) {
          $scope.regularFeeLevel = environmentConfig.regularFeeLevel;
          $scope.priorityFeeLevel = environmentConfig.priorityFeeLevel;

          function verifyFeeLevel() {
            if ($scope.estimatedFees &&
              _.isUndefined($scope.estimatedFees[$scope.priorityFeeLevel])) {
              $scope.selected = $scope.regularFeeLevel;
            }
          }

          $scope.fees = feeService.fees;
          $scope.feeOptions = feeService.feeOptions;

          $scope.$watch('estimatedFees', verifyFeeLevel, true);
        }
      ],
      templateUrl: 'app/popup/directives/FeeSelector.tpl.html'

    };
  });