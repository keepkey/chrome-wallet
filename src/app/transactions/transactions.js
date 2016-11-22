angular.module('kkTransactions', [
  'ngRoute',
  'kkCommon',
  'ui.bootstrap'
])
  .constant('VERSION', '{{VERSION}}')
  .config( ['$compileProvider',
    function( $compileProvider )
    {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/);
    }
  ])
  .run(['CurrencyLookupService', function(currencyLookupService) {
    //TODO Can we get this from the feature object?
    currencyLookupService.set([{
      name            : 'Bitcoin',
      currencySymbol  : 'BTC',
      coinTypeCode    : "0'",
      addressFormat   : "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
      dust            : 546,
      decimals        : 8,
      amountParameters: {
        DECIMAL_PLACES: 8
      }
    }, {
      name            : 'Litecoin',
      currencySymbol  : 'LTC',
      coinTypeCode    : "2'",
      addressFormat   : "^L[a-km-zA-HJ-NP-Z1-9]{26,33}$",
      dust            : 100000,
      decimals        : 8,
      amountParameters: {
        DECIMAL_PLACES: 8
      }
    }, {
      name            : 'Dogecoin',
      currencySymbol  : 'DOGE',
      coinTypeCode    : "3'",
      addressFormat   : "^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$",
      dust            : 100000000,
      decimals        : 8,
      amountParameters: {
        DECIMAL_PLACES: 8
      }
    }, {
      name            : 'Ethereum',
      currencySymbol  : 'ETH',
      coinTypeCode    : "60'",
      //TODO Implement checksum address: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go#L2317
      addressFormat   : "^(0x)?[0-9a-fA-F]{40}$",
      dust            : 1,
      decimals        : 18,
      amountParameters: {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    }]);
  }])
  .controller('TransactionListController', ['$scope', '$routeParams', 'WalletNodeService',
    function TransactionListController($scope, $routeParams, walletNodeService) {
      walletNodeService.getTransactionHistory($routeParams.walletId);
      $scope.wallets = walletNodeService.wallets;

      $scope.$watch('wallets.length', function() {
        $scope.wallet = walletNodeService.getWalletById($routeParams.walletId);
      });
    }
  ]);
