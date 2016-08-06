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
          function toBitcoins(satoshis) {
            return satoshis / 100000000;
          }

          $scope.currencySymbol =
            currencyLookupService.getCurrencySymbol($scope.currency);

          $scope.formattedAmount = toBitcoins(parseFloat($scope.amount));

          $scope.$watch('amount', function() {
            var amount = parseFloat($scope.amount);
            $scope.formattedAmount =
              (amount > 0) ? toBitcoins(amount) : '0.0';
          });
        }
      ],
      templateUrl: 'app/popup/directives/bitcoinAmount.tpl.html'
    };
  });