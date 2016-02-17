angular.module('kkWallet')
  .controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'TransactionService', 'DeviceBridgeService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, transactionService, deviceBridgeService) {
      $scope.walletList = walletNodeService.wallets;
      $scope.walletStats = walletNodeService.walletStats;
      $scope.walletId = $routeParams.wallet;

      //walletNodeService.reload(true);
      updateWallet();

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
          !!_.get($scope, 'wallet.final_balance')
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
        console.log('Account settings clicked');
      };

      function updateWallet() {
        $scope.wallet = walletNodeService.getWalletById($scope.walletId);
      }

      //$scope.$watch('walletStats', function() {
      //  if (!_.isNumber($scope.walletId) || _.isNaN($scope.walletId)) {
      //    $scope.go('/wallet/' +  $scope.walletStats.firstWalletId) ;
      //  }
      //}, true);
      $scope.$watch('walletId', updateWallet, true);
      $scope.$watch('walletList', updateWallet, true);
    }
  ]);