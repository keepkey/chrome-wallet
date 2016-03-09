angular.module('kkWallet')
  .controller('WalletListController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function WalletListController($scope, deviceFeatureService, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.device = deviceFeatureService.features;
      $scope.loaded = !!$scope.wallets.length;

      $scope.refresh = function () {
        deviceBridgeService.reloadBalances();
      };

      if (!$scope.wallets.length) {
        walletNodeService.loadAccounts();
      }

      $scope.addAccount = function() {
        $scope.loaded = false;
        var newAccountNode = findNextAccountNode();
        deviceBridgeService.addAccount(newAccountNode, 'Another Wallet');
      };

      $scope.goWallet = function(wallet) {
        $scope.go('/wallet/' + wallet.id, 'slideLeft');
      }

      $scope.$watch("wallets.length", function() {
        $scope.loaded = !!$scope.wallets.length;
      });

      function findNextAccountNode() {
        var candidateAccount = 0;
        while (_.find($scope.wallets, {
          nodePath: "m/44'/0'/" + candidateAccount + "'"
        })) {
          candidateAccount++;
        }

        return "m/44'/0'/" + candidateAccount + "'";
      }
    }
  ]);
