angular.module('kkWallet')
  .controller('ReceiveController', ['$rootScope', '$scope', '$routeParams', '$location', 'DeviceBridgeService', 'WalletNodeService', 'NavigationService',
    function ReceiveController($rootScope, $scope, $routeParams, $location, deviceBridgeService, walletNodeService, navigationService) {
      walletNodeService.reload();

      navigationService.setNextTransition('slideLeft');
      var deviceReadyPromise = new Promise(function (resolve) {
        $rootScope.$on('ButtonRequest', function (ev, message) {
          if (message.code === 'ButtonRequest_Address') {
            resolve(message.code);
          }
        });
      });

      $scope.backDestination = '/wallet/' + $routeParams.walletId;

      $scope.address = $routeParams.address;
      $scope.walletId = parseInt($routeParams.walletId, 10);
      $scope.getBitcoinLink = function (address) {
        return [
          'bitcoin:',
          address,
          '?label=KeepKey%20Wallet',
          '&message=Secure%20Bitcoins%20with%20your%20KeepKey%20wallet'].join('');
      };

      $scope.$on("$destroy", function () {
        if (deviceReadyPromise && $location.path() !== '/pin/pin_matrix_request_type_current') {
          deviceReadyPromise.then(function () {
            deviceBridgeService.cancel();
          });
        }
      });

      function displayAddressOnDevice() {
        getAddressPromise = deviceBridgeService.getAddress({
          messageType: 'GetAddress',
          addressN: walletNodeService.getAddressNode(
            $scope.walletId, $scope.address),
          coinName: "Bitcoin",
          showDisplay: true
        });
      }

      displayAddressOnDevice();
    }
  ]);
