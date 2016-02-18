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
      $scope.wallet = walletNodeService.getWalletById($scope.walletId);

      $scope.bitcoinLink = '';

      $scope.onCancel = function() {
        $rootScope.onCancel();
        navigationService.go();
      }

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
        if (_.get($scope, 'firstUnusedAddress.address')) {
          var addressN = walletNodeService.pathToAddressN(
            walletNodeService.joinPaths(
              $scope.wallet.nodePath, $scope.firstUnusedAddress.path
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
        if ($scope.firstUnusedAddress && $scope.firstUnusedAddress.address) {
          $scope.bitcoinLink = $scope.firstUnusedAddress.address;
        } else {
          $scope.bitcoinLink = '';
        }
      }

      $scope.$watch('wallet', getAddress, true);

      $scope.$watch('wallet.wallet.chains[0].firstUnused', function (newVal) {
        $scope.firstUnusedAddress = newVal;
        setBitcoinLink();
      }, true);
      $scope.$watch('firstUnusedAddress.address', displayAddressOnDevice);
    }
  ])
;
