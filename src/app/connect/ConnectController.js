angular.module('kkWallet')
    .controller('ConnectController', ['$rootScope', 'DeviceBridgeService', 'NavigationService',
        function ($rootScope, deviceBridgeService, nav) {
            deviceBridgeService.isDeviceReady().then(function (response) {
                if (response.result) {
                    nav.go('/initialize');
                }
            });
        }
    ]);