angular.module('kkWallet')
  // .run(['$q', 'environmentConfig', 'chrome',
  //   function ($q, environmentConfig, chrome) {
  //     function getExtensionList() {
  //       return $q(function (resolve) {
  //         chrome.management.getAll(function (extensions) {
  //           resolve(extensions);
  //         });
  //       });
  //     }
  //
  //     function proxyApplicationInstalled(extensions) {
  //       return $q(function (resolve, reject) {
  //         setTimeout(function () {
  //           var extFound = false;
  //           extensions.forEach(function (ext) {
  //             if (ext.id === environmentConfig.keepkeyProxy.applicationId) {
  //               if (ext.enabled) {
  //                 chrome.management.launchApp(ext.id);
  //               }
  //               else {
  //                 chrome.management.setEnabled(ext.id, true, function () {
  //                   chrome.management.launchApp(ext.id);
  //                 });
  //               }
  //               resolve(ext);
  //               extFound = true;
  //             }
  //           });
  //           if (!extFound) {
  //             reject();
  //           }
  //         }, 0);
  //       });
  //     }
  //
  //     function closeForeignProxies(extensions) {
  //       return $q(function(resolve, reject) {
  //         chrome.management.getAll(function (extensions) {
  //           extensions.forEach(function (ext) {
  //             if (environmentConfig.foreignKeepkeyProxies.indexOf(ext.id) !== -1) {
  //               if (ext.enabled) {
  //                 chrome.management.setEnabled(ext.id, false);
  //               }
  //             }
  //           });
  //           resolve(extensions);
  //         });
  //       });
  //
  //     }
  //
  //     getExtensionList()
  //       .then(proxyApplicationInstalled)
  //       .then(closeForeignProxies)
  //       .catch(function loadProxyDownloadPage() {
  //         var keepKeyProxyUrl = "https://chrome.google.com/webstore/detail/" + environmentConfig.keepkeyProxy.applicationId;
  //         chrome.tabs.create({url: keepKeyProxyUrl});
  //       });
  //   }
  // ])
  .run(['$rootScope', 'DeviceBridgeService', 'NavigationService',
    function ($rootScope, deviceBridgeService, navigationService) {
      $rootScope.goBack = function() {
        navigationService.goToPrevious('slideRight');
      };

      $rootScope.cancelDeviceOperation = function () {
        deviceBridgeService.cancel();
      };

      $rootScope.openBuyKeepkeyWindow = function() {
        chrome.tabs.create({
          url: 'https://httpslink.com/oz52'
        });
      };

    }
  ]);

