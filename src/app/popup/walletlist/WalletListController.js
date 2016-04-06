angular.module('kkWallet')
  .controller('WalletListController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function WalletListController($scope, deviceFeatureService, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.device = deviceFeatureService.features;
      $scope.loaded = !!$scope.wallets.length;

      if (!$scope.wallets.length) {
        walletNodeService.loadAccounts();
      }

      $scope.goWallet = function(wallet) {
        $scope.go('/wallet/' + wallet.id, 'slideLeft');
      };

      $scope.$watch("wallets.length", function() {
        $scope.loaded = !!$scope.wallets.length;
        if ($scope.wallets.length == 1) {
          $scope.go('/wallet/' + $scope.wallets[0].id);
        }
      });

    }
  ]);
