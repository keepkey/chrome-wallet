angular.module('kkWallet')
  .controller('WalletListController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function WalletListController($scope, deviceFeatureService, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.device = deviceFeatureService.features;

      $scope.refresh = function () {
        deviceBridgeService.reloadBalances();
      };

      $scope.goWallet = function(wallet) {
        $scope.go('/wallet/' + wallet.id, 'slideLeft');
      }
    }
  ]);
