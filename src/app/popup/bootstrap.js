angular.module('kkWallet')
  .run(['$q', 'environmentConfig', 'chrome', 'DeviceBridgeService',
    function ($q, environmentConfig, chrome, deviceBridgeService) {
      function getExtensionList() {
        return $q(function (resolve) {
          chrome.management.getAll(function (extensions) {
            resolve(extensions);
          });
        });
      }

      function proxyApplicationInstalled(extensions) {
        return $q(function (resolve, reject) {
          setTimeout(function () {
            var extFound = false;
            extensions.forEach(function (ext) {
              if (ext.id === environmentConfig.keepkeyProxy.applicationId) {
                if (ext.enabled) {
                  chrome.management.launchApp(ext.id);
                }
                else {
                  chrome.management.setEnabled(ext.id, true, function () {
                    chrome.management.launchApp(ext.id);
                  });
                }
                resolve(ext);
                extFound = true;
              }
            });
            if (!extFound) {
              reject();
            }
          }, 0);
        });
      }

      getExtensionList()
        .then(proxyApplicationInstalled)
        .catch(function loadProxyDownloadPage() {
          var keepKeyProxyUrl = "https://chrome.google.com/webstore/detail/" + environmentConfig.keepkeyProxy.applicationId;
          chrome.tabs.create({url: keepKeyProxyUrl});
        });
    }
  ])
  .run(['$rootScope', 'DeviceBridgeService', 'NavigationService',
    function ($rootScope, deviceBridgeService, navigationService) {
      $rootScope.goBack = function() {
        navigationService.goToPrevious('slideRight');
      };

      $rootScope.cancelDeviceOperation = function () {
        deviceBridgeService.cancel();
      };
    }
  ]);

