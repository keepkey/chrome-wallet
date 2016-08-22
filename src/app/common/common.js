angular.module('kkCommon', [])
  .constant('VERSION', '{{VERSION}}')
  .run(['DeviceBridgeService', 'environmentConfig', '$rootScope',
    function (deviceBridgeService, environmentConfig, $rootScope) {
      window.KeepKey = {
        enablePassphrase: function (enabled) {
          if (_.isUndefined(enabled)) {
            enabled = true;
          }
          deviceBridgeService.enablePassphrase({enabled: enabled});
        },
        enableFeeSelector: function (enabled) {
          environmentConfig.showFeeSelector = enabled;
          $rootScope.$apply();
        },
        enablePolicy: function(policyName, enabled) {
          if (_.isUndefined(enabled)) {
            enabled = true;
          }
          deviceBridgeService.enablePolicy({
            policyName: policyName,
            enabled: enabled
          });
        }
      };
    }
  ]);
