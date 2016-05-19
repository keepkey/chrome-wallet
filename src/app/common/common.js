angular.module('kkCommon', [])
  .constant('VERSION', '{{VERSION}}')
  .run(['DeviceBridgeService', function(deviceBridgeService) {
    window.KeepKey = {
      enablePassphrase: function(enabled) {
        deviceBridgeService.enablePassphrase({enabled: enabled});
      }
    };
  }]);
