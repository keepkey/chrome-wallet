//require('angular');
//require('environmentConfig');
//require('chrome');
//require('main');

kkWallet.factory('DeviceBridge', ['$q', 'chrome', 'environmentConfig', function($q, chrome, environmentConfig) {
    var keepKeyProxyId = environmentConfig.keepkeyProxy.applicationId;

    function sendMessage(message) {
        return $q(function(resolve) {
            chrome.runtime.sendMessage(keepKeyProxyId, message, function(result) {
                resolve(result);
            });
        });
    }

    return {
        isDeviceReady: function() {
            return sendMessage({messageType: "deviceReady"});
        }
    }
}]);
