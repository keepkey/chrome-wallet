angular.module('kkWallet')
  .controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'TransactionService', 'NavigationService', 'DeviceBridgeService', 'FormatBitcoinService',
    function WalletController($scope, $routeParams, walletNodeService, transactionService, navigationService, deviceBridgeService, formatBitcoinService) {
      var walletId = $routeParams.wallet || 0;

      walletNodeService.reload();

      $scope.btcFormatter = formatBitcoinService;

      $scope.walletBalances = transactionService.walletBalances;

      $scope.send = function() {
        $scope.go('/send/' + walletId, 'slideLeft');
      };

      $scope.receive = function() {
        $scope.go(['/receive', walletId, $scope.walletAddress()].join('/'), 'slideLeft');
      };

      $scope.sendAllowed = function () {
        return $scope.wallet &&
          $scope.wallet.xpub &&
          $scope.wallet.hdNode &&
          $scope.stats &&
          $scope.stats.balance;
      };

      $scope.walletAddress = function () {
        if ($scope.wallet &&
          $scope.wallet.addresses &&
          $scope.wallet.addresses.length) {
          return walletNodeService.firstUnusedAddress($scope.wallet.addresses[0]);
        }
      };

      $scope.balance = function() {
        var balance = $scope.stats && $scope.stats.balance;
        if (balance) {
          return formatBitcoinService.toBitcoin(balance);
        } else {
          return '---';
        }
      };

      $scope.refresh = function () {
        deviceBridgeService.getTransactions(true);
      };

      $scope.wipeDevice = function () {
        navigationService.setNextTransition('slideLeft');
        deviceBridgeService.wipeDevice();
      };

      $scope.wallet = walletNodeService.getWalletById(walletId);
      getStats();

      $scope.$watch('wallet', getStats, true);
      $scope.$watch('walletBalances', getStats, true);

      function getStats() {
        if ($scope.wallet && $scope.wallet.hdNode && $scope.walletBalances) {
          $scope.stats = $scope.walletBalances[$scope.wallet.hdNode];
        } else {
          $scope.stats = undefined;
        }
      }
    }
  ]);