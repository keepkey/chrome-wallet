angular.module('kkWallet')
    .run(['$rootScope', '$location', '$q', 'environmentConfig', 'DeviceBridgeService', 'chrome', 'NavigationService',
        function ($rootScope, $location, $q, config, deviceBridge, chrome, navigationService) {
            function getExtensionList() {
                var deferred = $q.defer();

                chrome.management.getAll(function (extensions) {
                    deferred.resolve(extensions);
                });

                return deferred.promise;
            }

            function proxyApplicationInstalled(extensions) {
                var deferred = $q.defer();

                setTimeout(function () {
                    var extFound = false;
                    extensions.forEach(function (ext) {
                        if (ext.id === config.keepkeyProxy.applicationId) {
                            if (ext.enabled) {
                                chrome.management.launchApp(ext.id);
                            }
                            else {
                                chrome.management.setEnabled(ext.id, true, function () {
                                    chrome.management.launchApp(ext.id);
                                });
                            }
                            deferred.resolve(ext);
                            extFound = true;
                        }
                    });
                    if (!extFound) {
                        deferred.reject();
                    }
                }, 0);

                return deferred.promise;
            }

            function loadProxyDownloadPage() {
                var keepKeyProxyUrl = "https://chrome.google.com/webstore/detail/" + config.keepkeyProxy.applicationId;
                chrome.tabs.create({url: keepKeyProxyUrl});
            }

            function runWallet() {

                //$rootScope.keepkey = function () {
                //    var optionsUrl = chrome.extension.getURL("src/keepkey.html");
                //
                //    chrome.tabs.query({url: optionsUrl}, function (tabs) {
                //        if (tabs.length) {
                //            chrome.tabs.update(tabs[0].id, {active: true});
                //        } else {
                //            chrome.tabs.create({url: optionsUrl});
                //        }
                //    });
                //};

                deviceBridge.isDeviceReady().then(function (response) {
                    if (response.result) {
                        navigationService.go('/initialize');
                    } else {
                        navigationService.go('/connect');
                    }
                });
            }

            getExtensionList()
                .then(proxyApplicationInstalled)
                .then(runWallet, loadProxyDownloadPage);
        }
    ]);

