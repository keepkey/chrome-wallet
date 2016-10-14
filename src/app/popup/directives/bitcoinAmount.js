angular.module('kkWallet')
  .directive('bitcoinAmount', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        amount: '=',
        currency: '='
      },
      controller: ['$scope', 'CurrencyLookupService',
        function($scope, currencyLookupService) {
          $scope.currencySymbol =
            currencyLookupService.getCurrencySymbol($scope.currency);

          $scope.formattedAmount =
            currencyLookupService.formatAmount($scope.currency, $scope.amount);

          $scope.$watch('amount', function() {
            var amount = parseFloat($scope.amount);
            $scope.formattedAmount = (amount > 0) ?
              currencyLookupService.formatAmount($scope.currency, $scope.amount) : '0.0';
          });
        }
      ],
      templateUrl: 'app/popup/directives/bitcoinAmount.tpl.html'
    };
  });