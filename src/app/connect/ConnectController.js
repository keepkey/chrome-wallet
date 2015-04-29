angular.module('kkWallet')
    .controller('ConnectController', ['$rootScope', 'DeviceBridgeService',
        function ($rootScope, deviceBridgeService) {
            deviceBridgeService.isDeviceReady().then(function (response) {
                if (response.result) {
                    $rootScope.go('/initialize');
                }
            });
        }
    ]);