angular.module('kkWallet')
  .factory('DeviceFeatureService', ['VERSION', 'environmentConfig',
    function DeviceFeatureService(version, environmentConfig) {
      var features = {};

      return {
        features: features,
        set: function (data) {
          angular.copy(data, features);
          features.wallet_version = version;
          features.environment = environmentConfig.environment;
        }
      };
    }
  ]);
