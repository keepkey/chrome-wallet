angular.module('kkTransactions', [
  'ngRoute',
  'kkCommon'
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

      //$scope.transactionList = [{
      //  timestamp: new Date(),
      //  address: '1stuff',
      //  received: 10000,
      //  balance: 10000
      //}, {
      //  date: new Date(),
      //  address: '1morestuff',
      //  sent: 20000,
      //  balance: 5000
      //}]

      $scope.$watch('wallets', function() {
        console.log('gotcha');
        $scope.wallet = walletNodeService.getWalletById($routeParams.walletId);
      }, true);
    }
  ]);
