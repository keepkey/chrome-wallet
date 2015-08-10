angular.module('kkWallet')
  .controller('BuildTransactionController', ['$scope', '$routeParams', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function BuildTransactionController($scope, $routeParams, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      walletNodeService.reload();

      $scope.transactionInProgress = false;
      $scope.wallet = walletNodeService.getWalletById($routeParams.wallet);
      $scope.userInput = {
        sourceIndex: $routeParams.wallet,
        sourceName: $scope.wallet.name,
        address: walletNodeService.firstUnusedAddress(walletNodeService.wallets[1].addresses[0]), //TODO This is an odd default.
        amount: 0.001
      };
      $scope.buildTransaction = function () {
        angular.copy($scope.userInput, transactionService.transactionInProgress);
        deviceBridgeService.requestTransactionSignature(transactionService.transactionInProgress);
        $scope.go('/success/bouncies');

      }
    }
  ]);
