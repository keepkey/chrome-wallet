angular.module('kkWallet')
  .controller('WalletController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function WalletController($scope, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      walletNodeService.reload();

      $scope.wallets = walletNodeService.wallets;
    }
  ]);