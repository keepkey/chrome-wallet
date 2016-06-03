angular.module('kkWallet')
  .factory('ChromeManagementService', ['environmentConfig',
    function (environmentConfig) {
      return {
        getConflictingAppIds: function () {
          return new Promise(function (resolve, reject) {
            chrome.management.getAll(function (extensions) {
              var appIds = _.map(extensions, function (ext) {
                if (environmentConfig.foreignConflictingApplicationIds.indexOf(ext.id) !== -1) {
                  if (ext.enabled) {
                    return ext.id;
                  }
                }
                return null;
              });
              resolve(_.filter(appIds, null));
            });
          });
        },
        disableExtension: function (extensionId) {
          chrome.management.setEnabled(extensionId, false);
        },
        getExtensionData: function(extensionId, callback) {
          chrome.management.get(extensionId, callback);
        }
      }
    }
  ]);