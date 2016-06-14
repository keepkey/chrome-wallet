angular.module('kkWallet')
  .controller('ReceiveController', ['$rootScope', '$scope', '$routeParams',
    '$location', 'DeviceBridgeService', 'WalletNodeService',
    'NavigationService', '$timeout', 'environmentConfig',
    function ReceiveController($rootScope, $scope, $routeParams, $location,
                               deviceBridgeService, walletNodeService,
                               navigationService, $timeout, config) {
      navigationService.setNextTransition('slideLeft');

      new Clipboard('.copy-to-clipboard-button');

      var deviceReadyPromise = new Promise(function (resolve) {
        $rootScope.$on('ButtonRequest', function (ev, message) {
          if (message.code === 'ButtonRequest_Address') {
            resolve(message.code);
          }
        });
      });

      var cancelled = false;

      $scope.walletId = $routeParams.walletId;
      $scope.addressDepth = parseInt($routeParams.addressDepth) || 0;
      $scope.wallet = walletNodeService.getWalletById($scope.walletId);
      $scope.currency = $scope.wallet.coinType;
      $scope.maxDepth = config.maxReceiveAddresses - 1;

      $scope.bitcoinLink = '';

      function getAddress() {
        var unusedAddresses = _.get($scope.wallet, 'wallet.chains.0.unusedAddresses');
        if (!unusedAddresses) {
          return;
        }
        if (unusedAddresses.length > $scope.addressDepth) {
          $scope.unusedAddress = unusedAddresses[$scope.addressDepth];
          $scope.bitcoinLink = $scope.unusedAddress.address;
          displayAddressOnDevice($scope.unusedAddress.address);
        } else {
          walletNodeService.unusedAddress($scope.walletId);
          $scope.bitcoinLink = '';
        }
      }

      $scope.$on("$destroy", function () {
        if (!cancelled) {
          if (deviceReadyPromise && $location.path() !== '/pin/pin_matrix_request_type_current') {
            deviceReadyPromise.then(function () {
              deviceBridgeService.cancel();
            });
          }
        }
      });

      $scope.showAnotherAddress = function (next) {
        if (next < 0 || next > $scope.maxDepth) {
          return false;
        }
        deviceReadyPromise.then(function () {
          cancelled = true;
          deviceBridgeService.cancel();
          $timeout(function() {
            var destination = ['/receive', $scope.walletId, next].join('/');
            var direction = next > $scope.addressDepth ? 'slideLeft' : 'slideRight';
            $scope.go(destination, direction, true);
          }, 500);
        });
      };

      function displayAddressOnDevice(address) {
        var addressN = walletNodeService.pathToAddressN(
          walletNodeService.joinPaths(
            $scope.wallet.nodePath, $scope.unusedAddress.path
          ));

        deviceBridgeService.getAddress({
          messageType: 'GetAddress',
          addressN: addressN,
          coinName: $scope.wallet.coinType,
          showDisplay: true
        });
      }

      $scope.$watch('wallet.wallet.chains', getAddress, true);
    }
  ])
;
