angular.module('kkWallet')
  .directive('bitcoinAmount', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        amount: '='
      },
      controller: ['$scope',
        function($scope) {
          const BITS = 'bits';
          const MILLIBITS = 'mBTC';
          const BITCOINS = 'BTC';

          function toBits(satoshis) {
            return satoshis / 100;
          }

          function toMilliBits(satoshis) {
            return satoshis / 100000;
          }

          function toBitcoins(satoshis) {
            return satoshis / 100000000;
          }

          $scope.formattedAmount = toBitcoins($scope.amount);
          $scope.denomination = BITCOINS;

          $scope.$watch('amount', function() {
            $scope.formattedAmount = toBitcoins($scope.amount);
          })
        }
      ],
      templateUrl: 'app/popup/directives/bitcoinAmount.tpl.html'
    };
  });