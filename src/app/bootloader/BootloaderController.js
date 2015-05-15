angular.module('kkWallet')
    .controller('BootloaderController', ['$scope', 'DeviceBridgeService',
        function BootloaderController($scope, deviceBridgeService) {
            $scope.eraseFirmware = function() {
                deviceBridgeService.eraseFirmware();
                $scope.go('/wait/eraseFirmware');
            };

            $scope.updateFirmware = function() {
                deviceBridgeService.updateFirmware();
                $scope.go('/wait/updateFirmware');
            };
        }
    ]);
