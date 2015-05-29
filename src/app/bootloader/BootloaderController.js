angular.module('kkWallet')
    .controller('BootloaderController', ['$scope', 'DeviceBridgeService',
        function BootloaderController($scope, deviceBridgeService) {
            $scope.updateFirmware = function() {
                deviceBridgeService.updateFirmware();
            };
        }
    ]);
