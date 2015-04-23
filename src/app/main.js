var kkWallet = angular.module('kkWallet', ['ngRoute', 'ngAnimate'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/connect/connect.tpl.html'
                })
                .when('/connect', {
                    templateUrl: 'app/connect/connect.tpl.html'
                })
                .when('/initialize', {
                    contoller: 'InitializeCtrl',
                    templateUrl: 'app/initialize/initialize.tpl.html'
                })
                .when('/initializing', {
                    contoller: 'InitializingCtrl',
                    templateUrl: 'app/initializing/initializing.tpl.html'
                })
                .when('/creating', {
                    contoller: 'CreatingCtrl',
                    templateUrl: 'app/creating/creating.tpl.html'
                })
                .when('/walletlist', {
                    contoller: 'WalletListCtrl',
                    templateUrl: 'app/walletlist/walletlist.tpl.html'
                })
                .when('/wallet', {
                    contoller: 'WalletCtrl',
                    templateUrl: 'app/wallet/wallet.tpl.html'
                })
                .when('/send', {
                    contoller: 'SendCtrl',
                    templateUrl: 'app/send/send.tpl.html'
                })
                .when('/sending', {
                    contoller: 'SendingCtrl',
                    templateUrl: 'app/sending/sending.tpl.html'
                })
                .when('/receive', {
                    contoller: 'ReceiveCtrl',
                    templateUrl: 'app/receive/receive.tpl.html'
                })
                .when('/pin', {
                    contoller: 'PinCtrl',
                    templateUrl: 'app/pin/pin.tpl.html'
                })
                .when('/passphrase', {
                    contoller: 'PassphraseCtrl',
                    templateUrl: 'app/passphrase/passphrase.tpl.html'
                })
                .when('/label', {
                    contoller: 'LabelCtrl',
                    templateUrl: 'app/label/label.tpl.html'
                })
                .when('/syncing', {
                    contoller: 'SyncingCtrl',
                    templateUrl: 'app/syncing/syncing.tpl.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }])

        .run(['$rootScope', '$location', function ($rootScope, $location) {

            'use strict';

            var keepKeyProxyId = "ijpagkpmefhldobnknedpbknjhinagpf";

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
                        }
                    } else {
                        sendResponse({
                            messageType: "Error",
                            result: "Unknown sender " + sender.id + ", message rejected"
                        });
                    }
                }
            );

            chrome.runtime.sendMessage(
                keepKeyProxyId, { messageType: "deviceReady" },
                function (response) {
                    console.log('got response:', response);
                    if (response.result) {
                        $rootScope.go('/initialize');
                    } else {
                        $rootScope.go('/connect');
                    }
                }
            );


        }])
    ;
