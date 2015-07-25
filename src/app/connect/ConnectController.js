angular.module('kkWallet')
    .controller('ConnectController', ['$scope', 'DeviceBridgeService',
        function ($scope, deviceBridgeService) {
            $scope.noDevice = false;
            deviceBridgeService.isDeviceReady().then(function (response) {
                console.log('device ready:', response.result);
                if (response.result) {
                    deviceBridgeService.initialize();
                } else {
                    $scope.noDevice = true;
                }
            });
        }
    ]);
