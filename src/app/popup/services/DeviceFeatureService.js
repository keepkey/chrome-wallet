angular.module('kkWallet')
  .factory('DeviceFeatureService', ['VERSION', 'environmentConfig',
    function DeviceFeatureService(version, environmentConfig) {
      var features = {};

      function isFirmwareUpdateAvailable() {
        var currentVersion = [
          features.major_version,
          features.minor_version,
          features.patch_version
        ].join('.');

        return features.deviceCapabilities.firmwareImageAvailable &&
          semver.gt(features.available_firmware_version, currentVersion);
      }

      return {
        features: features,
        get: function(featureName) {
          return _.get(features, featureName);
        },
        set: function (data) {
          angular.copy(data, features);
          features.wallet_version = version;
          features.environment = environmentConfig.environment;
          features.firmwareUpdateAvailable = isFirmwareUpdateAvailable();
        }
      };
    }
  ]);
