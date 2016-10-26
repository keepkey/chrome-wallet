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

          $scope.dust = currencyLookupService.getDust($scope.currency);

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
            if ($scope.maxAmount) {
              $scope.maxIsDust = $scope.maxAmount < $scope.dust;
              return currencyLookupService.formatAmount($scope.currency, $scope.maxAmount);
            } else {
              $scope.maxIsDust = true;
              return new BigNumber(0);
            }
          };

          $scope.validateNumber = function () {
            if (['', '.', undefined].includes($scope.amount)) {
              $scope.previousValue = $scope.amount;
              return;
            }
            try {
              new BigNumber($scope.amount);
            } catch(e) {
              $scope.amount = $scope.previousValue;
            } finally {
              $scope.previousValue = $scope.amount;
            }
          }
        }
      ],
      link: function ($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      templateUrl: 'app/popup/directives/AmountEntry.tpl.html'

    };
  });