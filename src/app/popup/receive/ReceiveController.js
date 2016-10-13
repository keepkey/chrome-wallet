angular.module('kkWallet')
  .controller('ReceiveController', ['$rootScope', '$scope', '$routeParams',
    '$location', 'DeviceBridgeService', 'WalletNodeService',
    'NavigationService', '$timeout', 'environmentConfig', 'ReceiveAddressService',
    function ReceiveController($rootScope, $scope, $routeParams, $location,
                               deviceBridgeService, walletNodeService,
                               navigationService, $timeout, config, receiveAddressService) {
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

      receiveAddressService.clear();
      deviceBridgeService.getReceiveAddress($scope.walletId, $scope.addressDepth);

      $scope.$on("$destroy", function () {
        receiveAddressService.clear();
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

      $scope.$watch(receiveAddressService.value, function() {
        $scope.unusedAddress = receiveAddressService.value;
      }, true);
    }
  ])
;
