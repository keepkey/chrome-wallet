var kkWallet = angular.module('kkWallet', ['ngRoute', 'ngAnimate'])

    .factory('chrome', ['$window', function (window) {
        return window.chrome;
    }])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/connect/connect.tpl.html'
            })
            .when('/connect', {
                templateUrl: 'app/connect/connect.tpl.html'
            })
            .when('/initialize', {
                templateUrl: 'app/initialize/initialize.tpl.html'
            })
            .when('/initializing', {
                templateUrl: 'app/initializing/initializing.tpl.html'
            })
            .when('/creating', {
                templateUrl: 'app/creating/creating.tpl.html'
            })
            .when('/walletlist', {
                templateUrl: 'app/walletlist/walletlist.tpl.html'
            })
            .when('/wallet', {
                templateUrl: 'app/wallet/wallet.tpl.html'
            })
            .when('/send', {
                templateUrl: 'app/send/send.tpl.html'
            })
            .when('/sending', {
                templateUrl: 'app/sending/sending.tpl.html'
            })
            .when('/receive', {
                templateUrl: 'app/receive/receive.tpl.html'
            })
            .when('/pin', {
                templateUrl: 'app/pin/pin.tpl.html'
            })
            .when('/passphrase', {
                templateUrl: 'app/passphrase/passphrase.tpl.html'
            })
            .when('/label', {
                templateUrl: 'app/label/label.tpl.html'
            })
            .when('/syncing', {
                templateUrl: 'app/syncing/syncing.tpl.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])

    .run(['$rootScope', '$location', '$q', 'environmentConfig', 'DeviceBridge', 'chrome',
        function ($rootScope, $location, $q, environmentConfig, deviceBridge, chrome) {
            var keepKeyProxyId = environmentConfig.keepkeyProxy.applicationId;

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
                        if (ext.id === keepKeyProxyId) {
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
                    if (!extFound)
                        deferred.reject();
                }, 0);

                return deferred.promise;
            }

            function loadProxyDownloadPage() {
                var keepKeyProxyUrl = "https://chrome.google.com/webstore/detail/" + keepKeyProxyId;
                chrome.tabs.create({url: keepKeyProxyUrl});
            }

            function runWallet() {
                $rootScope.go = function (path, pageAnimationClass) {

                    console.log('navigating to %s', path);

                    if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
                        $rootScope.pageAnimationClass = '';
                    } else { // Use the specified animation
                        $rootScope.pageAnimationClass = pageAnimationClass;
                    }


                    $location.path(path);
                    $rootScope.$digest();
                }

                $rootScope.keepkey = function () {
                    var optionsUrl = chrome.extension.getURL("src/keepkey.html");

                    chrome.tabs.query({url: optionsUrl}, function (tabs) {
                        if (tabs.length) {
                            chrome.tabs.update(tabs[0].id, {active: true});
                        } else {
                            chrome.tabs.create({url: optionsUrl});
                        }
                    });
                };

                chrome.runtime.onMessageExternal.addListener(
                    function (request, sender, sendResponse) {
                        console.log("External message:", request.messageType)
                        if (sender.id === keepKeyProxyId) {
                            switch (request.messageType) {
                                case 'connected':
                                    $rootScope.go('/initialize');
                                    break;
                                case 'disconnected':
                                    $rootScope.go('/connect');
                                    break;
                                case 'ping':
                                    break;
                                default:
                                    sendResponse({
                                        messageType: "Error",
                                        result: "Unknown messageType " + request.messageType + ", message rejected"
                                    });
                            }
                        } else {
                            sendResponse({
                                messageType: "Error",
                                result: "Unknown sender " + sender.id + ", message rejected"
                            });
                        }
                    }
                );

                deviceBridge.isDeviceReady().then(function (response) {
                    if (response.result) {
                        $rootScope.go('/initialize');
                    } else {
                        $rootScope.go('/connect');
                    }
                });
            }

            getExtensionList()
                .then(proxyApplicationInstalled)
                .then(runWallet, loadProxyDownloadPage);
        }
    ]);

