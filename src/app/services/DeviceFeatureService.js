angular.module('kkWallet')
    .factory('DeviceFeatureService', function DeviceFeatureService() {
        var features = {};

        return {
            features: features,
            set: function(data) {
                angular.copy(data, features);
            }
        };
    });