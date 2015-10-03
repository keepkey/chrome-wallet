angular.module('kkWallet')
    .factory('ProxyInfoService', function ProxyInfoService() {
        var info = {};

        return {
            info: info,
            set: function(data) {
                angular.copy(data, info);
            }
        };
    });