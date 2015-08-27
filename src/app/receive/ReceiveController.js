angular.module('kkWallet')
  .controller('ReceiveController', ['$rootScope', '$scope', '$routeParams', '$location', 'DeviceBridgeService', 'WalletNodeService', 'NavigationService',
    function ReceiveController($rootScope, $scope, $routeParams, $location, deviceBridgeService, walletNodeService, navigationService) {
      navigationService.setNextTransition('slideLeft');

      var deviceReadyPromise = new Promise(function (resolve) {
        $rootScope.$on('ButtonRequest', function (ev, message) {
          if (message.code === 'ButtonRequest_Address') {
            resolve(message.code);
          }
        });
      });

      $scope.backDestination = '/wallet/' + $routeParams.walletId;

      $scope.walletId = parseInt($routeParams.walletId, 10);
      $scope.wallet = walletNodeService.getWalletById($scope.walletId);

      $scope.address = '';
      function getAddress() {
        $scope.address =  walletNodeService.firstUnusedAddress($scope.walletId);
      };

      $scope.getBitcoinLink = function () {
        return [
          'bitcoin:',
          $scope.address,
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
        if ($scope.address) {
          deviceBridgeService.getAddress({
            messageType: 'GetAddress',
            addressN: walletNodeService.getAddressNode(
              $scope.walletId, $scope.address),
            coinName: "Bitcoin",
            showDisplay: true
          });
        }
      }

      $scope.$watch('wallet', getAddress, true);
      $scope.$watch('address', displayAddressOnDevice);
    }
  ]);
