angular.module('kkWallet')
  .directive('bignumberMin', ['CurrencyLookupService',
    function (currencyLookupService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, elm, attrs, controller) {
          controller.$validators.min = function (modelValue, viewValue) {
            var amountEntered = new BigNumber(0);
            try {
              amountEntered = currencyLookupService.unformatAmount(attrs.currency, viewValue);
            } finally {
              return !amountEntered.lessThan(attrs.bignumberMin);
            }
          };
        }
      };
    }
  ])
  .directive('bignumberMax', ['CurrencyLookupService',
    function (currencyLookupService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, elm, attrs, controller) {
          controller.$validators.max = function (modelValue, viewValue) {
            var amountEntered = new BigNumber(0);
            try {
              amountEntered = currencyLookupService.unformatAmount(attrs.currency, viewValue);
            } finally {
              return !amountEntered.greaterThan(attrs.bignumberMax);
            }
          };
        }
      };
    }
  ]);