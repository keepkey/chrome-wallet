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

        return compareVersions(features.available_firmware_version, currentVersion) > 0;
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
