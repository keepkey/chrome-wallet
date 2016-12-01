angular.module('kkWallet')
  .directive('amountEntry', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        amount: '=',
        maxAmount: '=',
        fieldName: '@',
        form: '=',
        disabled: '=',
        currency: '='
      },
      controller: ['$scope', 'CurrencyLookupService',
        function ($scope, currencyLookupService) {
          $scope.previousValue = '';

          $scope.dust = new BigNumber(currencyLookupService.getDust($scope.currency));
          $scope.bigMaxAmount = $scope.maxAmount ? new BigNumber($scope.maxAmount) : new BigNumber(0);

          $scope.symbol = currencyLookupService
            .getCurrencySymbol($scope.currency);

          $scope.fillMaxDetector = function (ev) {
            if (ev.key === '!') {
              $scope.amount = $scope.getMaxAmount().toString();
              ev.preventDefault();
              return false;
            }
            return true;
          };

          $scope.getMaxAmount = function () {
            if ($scope.bigMaxAmount.equals(0)) {
              $scope.maxIsDust = true;
              return $scope.bigMaxAmount;
            } else {
              $scope.maxIsDust = $scope.bigMaxAmount.lessThan($scope.dust);
              return currencyLookupService.formatAmount($scope.currency, $scope.bigMaxAmount);
            }
          };

          $scope.$watch('maxAmount', function() {
            $scope.bigMaxAmount = $scope.maxAmount ? new BigNumber($scope.maxAmount) : new BigNumber(0);
          });
        }
      ],
      link: function ($scope, elm, attrs, controller) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      templateUrl: 'app/popup/directives/AmountEntry.tpl.html'

    };
  });