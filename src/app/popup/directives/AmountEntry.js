angular.module('kkWallet')
  .directive('amountEntry', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        amount: '=',
        maxAmount: '=',
        fieldName: '@',
        form: '=',
        disabled: '=',
        label: '@'
      },
      controller: ['$scope', 'FeeService',
        function ($scope, feeService) {
          $scope.dust = 546;
          
          $scope.fillMaxDetector = function(ev) {
            if (ev.charCode === 33) {
              $scope.amount = $scope.getMaxAmount();
              return false;
            }
            return true;
          };

          $scope.getMaxAmount = function () {
            if ($scope.maxAmount) {
              $scope.maxIsDust = $scope.maxAmount < $scope.dust;
              return $scope.maxAmount / 100000000;
            } else {
              $scope.maxIsDust = true;
              return 21000000;
            }
          };
        }
      ],
      link: function($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      templateUrl: 'app/popup/directives/AmountEntry.tpl.html'

    };
  });