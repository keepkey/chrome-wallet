angular.module('kkWallet')
  .controller('WalletConfigController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceBridgeService',
    function WalletController($scope, $routeParams, walletNodeService, deviceBridgeService) {
      $scope.walletId = $routeParams.walletId;

      $scope.delete = function deleteWallet() {
        deviceBridgeService.deleteAccount($scope.walletId);
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