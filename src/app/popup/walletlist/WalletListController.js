angular.module('kkWallet')
  .controller('WalletListController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function WalletListController($scope, deviceFeatureService, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.getBalance = function (nodePath) {
        if (nodePath && $scope.balances && $scope.balances[nodePath] && $scope.balances[nodePath].balance) {
          return $scope.balances[nodePath].balance / 100000000;
        } else {
          return '---';
        }
      };
      $scope.device = deviceFeatureService.features;

      //$scope.btcFormatter = formatBitcoinService;

      $scope.refresh = function () {
        deviceBridgeService.reloadBalances();
      };

      $scope.goWallet = function(wallet) {
        $scope.go('/wallet/' + wallet.id, 'slideLeft');
      }
    }
  ]);
