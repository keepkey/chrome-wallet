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

          var dust = new BigNumber(currencyLookupService.getDust($scope.currency));
          var maxAmount = $scope.maxAmount ? new BigNumber($scope.maxAmount) : new BigNumber(0);

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
            if (maxAmount.equals(0)) {
              $scope.maxIsDust = true;
              return maxAmount;
            } else {
              $scope.maxIsDust = maxAmount.lessThan(dust);
              return currencyLookupService.formatAmount($scope.currency, maxAmount);
            }
          };

          $scope.validateNumber = function () {
            var amountEntered;
            if (['', '.', undefined].includes($scope.amount)) {
              $scope.previousValue = $scope.amount;
              return;
            }
            try {
              amountEntered = currencyLookupService.unformatAmount($scope.currency, $scope.amount);
            } catch (e) {
              $scope.amount = $scope.previousValue;
            } finally {
              $scope.previousValue = $scope.amount;
            }

            $scope.field.$error.min = amountEntered.lessThan(dust);
            $scope.field.$error.max = amountEntered.greaterThan(maxAmount);
          }

          $scope.$watch('maxAmount', function() {
            maxAmount = $scope.maxAmount ? new BigNumber($scope.maxAmount) : new BigNumber(0);
          });
        }
      ],
      link: function ($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      templateUrl: 'app/popup/directives/AmountEntry.tpl.html'

    };
  });