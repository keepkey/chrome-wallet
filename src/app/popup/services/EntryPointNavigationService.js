angular.module('kkWallet')

  .factory('EntryPointNavigationService', ['NavigationService',
    'DeviceFeatureService', 'DeviceBridgeService',
    function (navigationService, deviceFeatureService, deviceBridgeService) {
      return {
        goToTop: function (checkForFirmwareUpdate) {
          navigationService.dumpHistory();
          if (deviceFeatureService.get('bootloader_mode')) {
            navigationService.go('/bootloader');
          }
          else if (checkForFirmwareUpdate &&
            deviceFeatureService.get('firmwareUpdateAvailable')) {
            navigationService.go('/update-firmware');
          }
          else if (deviceFeatureService.get('initialized')) {
            deviceBridgeService.initiateSession();
            navigationService.go('/walletlist');
          }
          else {
            navigationService.go('/initialize');
          }
        }
      };
    }
  ]);

