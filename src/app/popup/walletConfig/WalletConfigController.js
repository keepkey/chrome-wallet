angular.module('kkWallet')
  .controller('WalletConfigController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceBridgeService',
    function WalletController($scope, $routeParams, walletNodeService, deviceBridgeService) {
      $scope.walletId = $routeParams.walletId;

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
      }

      function updateWallet() {
        $scope.wallet = walletNodeService.getWalletById($scope.walletId);
      }

      function updateWalletName() {
        deviceBridgeService.updateWalletName($scope.walletId, $scope.wallet.name);
      }

      $scope.$watch('walletId', updateWallet);
      $scope.$watch('wallet.name', updateWalletName);
    }
  ]);