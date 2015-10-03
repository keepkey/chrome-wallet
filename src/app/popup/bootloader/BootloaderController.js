angular.module('kkWallet')
    .controller('BootloaderController', ['$scope', 'DeviceBridgeService', 'NavigationService',
        function BootloaderController($scope, deviceBridgeService, navigationService) {
          navigationService.setNextTransition('slideLeft');

            $scope.updateFirmware = function() {
                deviceBridgeService.updateFirmware();
            };
        }
    ]);
