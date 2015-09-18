angular.module('kkWallet')
  .controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'TransactionService', 'DeviceBridgeService', 'FormatBitcoinService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, transactionService, deviceBridgeService, formatBitcoinService) {
      $scope.walletStats = walletNodeService.walletStats;
      $scope.walletId = parseInt($routeParams.wallet, 10);

      walletNodeService.reload(true);

      $scope.device = deviceFeatureService.features;

      $scope.btcFormatter = formatBitcoinService;

      $scope.send = function () {
        $scope.go('/send/' + $scope.walletId, 'slideLeft');
      };

      $scope.receive = function () {
        $scope.go(['/receive', $scope.walletId].join('/'), 'slideLeft');
      };

      $scope.sendAllowed = function () {
        return $scope.wallet &&
          $scope.wallet.wallet &&
          $scope.wallet.wallet.xpub &&
          $scope.wallet.hdNode &&
          $scope.wallet.final_balance;
      };

      $scope.receiveDisabled = function () {
        return !(
          $scope.wallet &&
          $scope.wallet.wallet &&
          $scope.wallet.wallet.xpub &&
          $scope.wallet.hdNode
        );
      };

      $scope.balance = function () {
        var balance = $scope.wallet && $scope.wallet.final_balance;
        if (balance) {
          return formatBitcoinService.toBitcoin(balance);
        } else {
          return '0.0';
        }
      };

      $scope.refresh = function () {
        deviceBridgeService.reloadBalances();
      };

      if (_.isNumber($scope.walletId)) {
        $scope.wallet = walletNodeService.getWalletById($scope.walletId);
      }

      $scope.$watch('walletStats', function() {
        if (!_.isNumber($scope.walletId) || _.isNaN($scope.walletId)) {
          $scope.walletId = $scope.walletStats.firstWalletId;
        }
      }, true);
      $scope.$watch('walletId', function() {
        $scope.wallet = walletNodeService.getWalletById($scope.walletId);
      }, true);
    }
  ]);