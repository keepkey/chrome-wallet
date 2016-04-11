angular.module('kkWallet')
  .controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'TransactionService', 'DeviceBridgeService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, transactionService, deviceBridgeService) {
      $scope.walletList = walletNodeService.wallets;
      $scope.walletStats = walletNodeService.walletStats;
      $scope.walletId = $routeParams.wallet;

      updateWallet();

      $scope.singleAccount = $scope.walletList.length === 1;

      $scope.device = deviceFeatureService.features;

      $scope.send = function () {
        $scope.go('/send/' + $scope.walletId, 'slideLeft');
      };

      $scope.receive = function () {
        $scope.go(['/receive', $scope.walletId].join('/'), 'slideLeft');
      };

      $scope.sendAllowed = function () {
        return (
          !!_.get($scope, 'wallet.wallet.xpub') &&
          !!_.get($scope, 'wallet.nodePath') &&
          !!_.get($scope, 'wallet.highConfidenceBalance')
        );
      };

      $scope.receiveDisabled = function () {
        return !(
          !!_.get($scope, 'wallet.wallet.xpub') &&
          !!_.get($scope, 'wallet.nodePath')
        );
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

      $scope.delete = function deleteWallet() {
        deviceBridgeService.deleteAccount($scope.walletId)
          .then(function(success) {
            if (success) {
              walletNodeService.removeAccount($scope.walletId);
              $scope.go('/walletlist', 'slideRight');
            } else {
              console.error('delete account failed');
            }
          });
      };

      function updateWallet() {
        $scope.wallet = walletNodeService.getWalletById($scope.walletId);
        $scope.singleAccount = $scope.walletList.length === 1;
      }

      $scope.$watch('walletId', updateWallet, true);
      $scope.$watch('walletList', updateWallet, true);
    }
  ]);