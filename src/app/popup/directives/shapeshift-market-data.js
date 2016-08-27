angular.module('kkWallet')
  .directive('shapeshiftMarketData', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        depositCurrency: '=',
        withdrawalCurrency: '='
      },
      controller: [
        '$scope', 'ShapeshiftMarketDataService',
        function ($scope, marketDataService) {
          marketDataService.clear();
          $scope.marketRateData = marketDataService.data;
          marketDataService.loadRate($scope.depositCurrency, $scope.withdrawalCurrency);
          $scope.$watch('withdrawalCurrency', function () {
            marketDataService.loadRate($scope.depositCurrency, $scope.withdrawalCurrency);
          });
        }
      ],
      templateUrl: 'app/popup/directives/shapeshift-market-data.tpl.html'

    };
  });