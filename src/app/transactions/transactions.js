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
  .controller('TransactionListController', ['$scope', '$routeParams', 'WalletNodeService',
    function TransactionListController($scope, $routeParams, walletNodeService) {
      walletNodeService.getTransactionHistory($routeParams.walletId);
      $scope.wallets = walletNodeService.wallets;

      $scope.$watch('wallets.length', function() {
        $scope.wallet = walletNodeService.getWalletById($routeParams.walletId);
      });
    }
  ]);
