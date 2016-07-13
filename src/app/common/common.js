angular.module('kkCommon', [])
  .constant('VERSION', '{{VERSION}}')
  .run(['DeviceBridgeService', 'environmentConfig', '$rootScope',
    function (deviceBridgeService, environmentConfig, $rootScope) {
      window.KeepKey = {
        enablePassphrase: function (enabled) {
          deviceBridgeService.enablePassphrase({enabled: enabled});
        },
        enableFeeSelector: function (enabled) {
          environmentConfig.showFeeSelector = enabled;
          $rootScope.$apply();
        },
        enableShapeshift: function(enabled) {
          deviceBridgeService.enableShapeshift({enabled: enabled});
        }
      };
    }
  ]);
