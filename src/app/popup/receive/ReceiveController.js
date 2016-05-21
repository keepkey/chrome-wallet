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

      $scope.walletId = $routeParams.walletId;
      $scope.addressDepth = $routeParams.addressDepth || 0;
      $scope.wallet = walletNodeService.getWalletById($scope.walletId);

      $scope.bitcoinLink = '';

      function getAddress() {
        walletNodeService.unusedAddress($scope.walletId, $scope.addressDepth);
      }

      $scope.$on("$destroy", function () {
        if (deviceReadyPromise && $location.path() !== '/pin/pin_matrix_request_type_current') {
          deviceReadyPromise.then(function () {
            deviceBridgeService.cancel();
          });
        }
      });

      function displayAddressOnDevice() {
        if (_.get($scope, 'unusedAddress.address')) {
          var addressN = walletNodeService.pathToAddressN(
            walletNodeService.joinPaths(
              $scope.wallet.nodePath, $scope.unusedAddress.path
            ));

          deviceBridgeService.getAddress({
            messageType: 'GetAddress',
            addressN: addressN,
            coinName: "Bitcoin",
            showDisplay: true
          });
        }
      }

      function setBitcoinLink() {
        if (_.get($scope.unusedAddress, 'address')) {
          $scope.bitcoinLink = $scope.unusedAddress.address;
        } else {
          $scope.bitcoinLink = '';
        }
      }

      $scope.$watch('wallet', getAddress, true);

      $scope.$watch('wallet.wallet.chains[0].firstUnused', function (newVal) {
        $scope.unusedAddress = newVal;
        setBitcoinLink();
      }, true);
      $scope.$watch('unusedAddress.address', displayAddressOnDevice);
    }
  ])
;
