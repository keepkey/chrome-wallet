angular.module('kkWallet')
  .controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'TransactionService', 'DeviceBridgeService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, transactionService, deviceBridgeService) {
      $scope.walletList = walletNodeService.wallets;
      $scope.walletStats = walletNodeService.walletStats;
      $scope.walletId = $routeParams.wallet;

      updateWallet();

      $scope.firmwareUpdateAvailable =
        deviceFeatureService.features.firmwareUpdateAvailable;
      
      $scope.offerKeepKeyPurchase =
        deviceFeatureService.get('deviceCapabilities.vendorName') !== 'KeepKey';

      $scope.send = function () {
        $scope.go('/send/' + $scope.walletId, 'slideLeft');
      };

      $scope.receive = function () {
        $scope.go(['/receive', $scope.walletId].join('/'), 'slideLeft');
      };

      $scope.sendAllowed = function () {
        return (
          !$scope.wallet.highConfidenceBalance.isZero()
        );
      };

      $scope.receiveDisabled = function () {
        return false; //TODO Inline this
      };

      $scope.refresh = function () {
        deviceBridgeService.reloadBalances();
      };

      $scope.showTransactions = function () {
        chrome.tabs.create({
          url: '/keepkey.html#/' + $scope.walletId
        });
      };
      $scope.accountSettings = function () {
        $scope.go('/accountConfig/' + $scope.walletId, 'slideLeft');
      };

      $scope.openBuyBitcoinWindow = function() {
        chrome.tabs.create({
          url: 'https://www.keepkey.com/buy-bitcoin.php'
        });
      };

      function updateWallet() {
        $scope.wallet = walletNodeService.getWalletById($scope.walletId);
        $scope.currency = $scope.wallet.coinType;
        $scope.singleAccount = $scope.walletList.length === 1;
      }

      $scope.$watch('walletId', updateWallet, true);
      $scope.$watch('walletList', updateWallet, true);
    }
  ]);