angular.module('kkWallet')
    .controller('ConnectController', ['$scope', 'DeviceBridgeService',
        function ($scope, deviceBridgeService) {
            $scope.noDevice = false;
            deviceBridgeService.isDeviceReady().then(function (response) {
                if (response.result) {
                    deviceBridgeService.initialize();
                } else {
                    $scope.noDevice = true;
                }
            });
        }
    ]);
