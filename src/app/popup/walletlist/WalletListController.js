angular.module('kkWallet')
  .controller('WalletListController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function WalletListController($scope, deviceFeatureService, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.device = deviceFeatureService.features;

      $scope.refresh = function () {
        deviceBridgeService.reloadBalances();
      };

      $scope.addAccount = function() {
        var newAccountNode = findNextAccountNode();
        deviceBridgeService.addAccount(newAccountNode, 'Another Wallet');
      };

      $scope.goWallet = function(wallet) {
        $scope.go('/wallet/' + wallet.id, 'slideLeft');
      }

      function findNextAccountNode() {
        var candidateAccount = 0;
        while (_.find($scope.wallets, {
          hdNode: "m/44'/0'/" + candidateAccount + "'"
        })) {
          candidateAccount++;
        }

        return "m/44'/0'/" + candidateAccount + "'";
      }
    }
  ]);
