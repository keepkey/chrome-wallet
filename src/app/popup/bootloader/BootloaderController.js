angular.module('kkWallet')
    .controller('BootloaderController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'DeviceFeatureService',
        function BootloaderController($scope, deviceBridgeService, navigationService, deviceFeatureService) {
          navigationService.setNextTransition('slideLeft');
          $scope.firmwareAvailable = _.get(deviceFeatureService.features, "deviceCapabilities.firmwareImageAvailable");
          $scope.updateFirmware = function() {
                deviceBridgeService.updateFirmware();
            };
        }
    ]);
