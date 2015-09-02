angular.module('kkWallet')
  .controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'TransactionService', 'DeviceBridgeService', 'FormatBitcoinService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, transactionService, deviceBridgeService, formatBitcoinService) {
      var walletId = parseInt($routeParams.wallet, 10) || walletNodeService.getFirstWalletId();
      $scope.walletId = walletId;

      walletNodeService.reload(true);

      $scope.device = deviceFeatureService.features;

      $scope.btcFormatter = formatBitcoinService;

      $scope.walletBalances = transactionService.walletBalances;

      $scope.send = function() {
        $scope.go('/send/' + walletId, 'slideLeft');
      };

      $scope.receive = function() {
        $scope.go(['/receive', walletId].join('/'), 'slideLeft');
      };

      $scope.sendAllowed = function () {
        return $scope.wallet &&
          $scope.wallet.xpub &&
          $scope.wallet.hdNode &&
          $scope.stats &&
          $scope.stats.balance;
      };

      $scope.receiveDisabled = function() {
        return !($scope.wallet && $scope.wallet.xpub && $scope.wallet.hdNode);
      };

      $scope.balance = function() {
        var balance = $scope.stats && $scope.stats.balance;
        if (balance) {
          return formatBitcoinService.toBitcoin(balance);
        } else {
          return '0.0';
        }
      };

      $scope.refresh = function () {
        deviceBridgeService.getTransactions(true);
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