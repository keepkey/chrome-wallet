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
        currency: '='
      },
      controller: ['$scope', 'CurrencyLookupService',
        function ($scope, currencyLookupService) {
          $scope.dust = currencyLookupService.getDust($scope.currency);

          $scope.symbol = currencyLookupService
            .getCurrencySymbol($scope.currency);

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
              return currencyLookupService.formatAmount($scope.currency, $scope.maxAmount);
            } else {
              $scope.maxIsDust = true;
              return new BigNumber(0);
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