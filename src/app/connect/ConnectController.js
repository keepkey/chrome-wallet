angular.module('kkWallet')
    .controller('ConnectController', ['$rootScope', 'DeviceBridge', function($rootScope, deviceBridge) {
        deviceBridge.isDeviceReady().then(function (response) {
            if (response.result) {
                $rootScope.go('/initialize');
            }
        });
    }]);