angular.module('kkWallet')
    .controller('ConnectController', ['DeviceBridgeService',
        function (deviceBridgeService) {
            deviceBridgeService.isDeviceReady().then(function (response) {
                console.log('device ready:', response.result);
                if (response.result) {
                    deviceBridgeService.initialize();
                }
            });
        }
    ]);
