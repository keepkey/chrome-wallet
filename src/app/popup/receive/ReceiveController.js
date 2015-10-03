angular.module('kkWallet')
  .controller('ReceiveController', ['$rootScope', '$scope', '$routeParams', '$location', 'DeviceBridgeService', 'WalletNodeService', 'NavigationService',
    function ReceiveController($rootScope, $scope, $routeParams, $location, deviceBridgeService, walletNodeService, navigationService) {
      navigationService.setNextTransition('slideLeft');

      new Clipboard('.copy-to-clipboard-button');

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

      $scope.bitcoinLink = '';

      function getAddress() {
        walletNodeService.firstUnusedAddress($scope.walletId);
      }

      $scope.$on("$destroy", function () {
        if (deviceReadyPromise && $location.path() !== '/pin/pin_matrix_request_type_current') {
          deviceReadyPromise.then(function () {
            deviceBridgeService.cancel();
          });
        }
      });

      function displayAddressOnDevice() {
        if ($scope.firstUnusedAddress && $scope.firstUnusedAddress.address) {
          var addressN = walletNodeService.pathToAddressN(
            walletNodeService.joinPaths(
              $scope.wallet.hdNode, $scope.firstUnusedAddress.path
            ));

          deviceBridgeService.getAddress({
            messageType: 'GetAddress',
            addressN: addressN,
            coinName: "Bitcoin",
            showDisplay: true
          });
        }
      }

      $scope.$watch('wallet', getAddress, true);
      $scope.$watch('wallet.wallet.chains[0].firstUnused', function(newVal) {
        $scope.firstUnusedAddress = newVal;
        if ($scope.firstUnusedAddress && $scope.firstUnusedAddress.address) {
          $scope.bitcoinLink = [
            'bitcoin:',
            $scope.firstUnusedAddress.address,
            '?label=KeepKey%20Wallet',
            '&message=Secure%20Bitcoins%20with%20your%20KeepKey%20wallet'
          ].join('');
        }
      }, true);

      $scope.$watch('firstUnusedAddress.address', displayAddressOnDevice);
    }
  ]);
