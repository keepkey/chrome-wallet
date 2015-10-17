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
      $scope.wallet = walletNodeService.getWalletById($routeParams.walletId);

      $scope.$watch('wallets', function() {
        $scope.wallet = walletNodeService.getWalletById($routeParams.walletId);
        if ($scope.wallet) {
          walletNodeService.getTransactionHistory($routeParams.walletId);
        }
      }, true);
    }
  ]);
