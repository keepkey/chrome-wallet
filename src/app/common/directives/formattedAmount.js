angular.module('kkCommon')
  .directive('formattedAmount', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        amount: '=',
        currency: '=',
        suppressSymbol: '='
      },
      controller: ['$scope', 'CurrencyLookupService',
        function ($scope, currencyLookupService) {
          $scope.currencySymbol =
            currencyLookupService.getCurrencySymbol($scope.currency);

          $scope.formattedAmount =
            currencyLookupService.formatAmount($scope.currency, $scope.amount);

          $scope.$watch('amount', function () {
            $scope.formattedAmount = currencyLookupService.formatAmount($scope.currency, $scope.amount);
          });
        }
      ],
      templateUrl: 'app/common/directives/formattedAmount.tpl.html'
    };
  });