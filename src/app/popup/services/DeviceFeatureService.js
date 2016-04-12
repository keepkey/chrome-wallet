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

        return semver.gt(features.available_firmware_version, currentVersion);
      }

      return {
        features: features,
        set: function (data) {
          angular.copy(data, features);
          features.wallet_version = version;
          features.environment = environmentConfig.environment;
          features.firmwareUpdateAvailable = isFirmwareUpdateAvailable();
        }
      };
    }
  ]);
