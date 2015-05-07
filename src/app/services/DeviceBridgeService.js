//require('angular');
//require('environmentConfig');
//require('chrome');
//require('main');

angular.module('kkWallet')
    .provider('DeviceBridgeService', function DeviceBridgeServiceProvider() {
        var incomingMessages = {};

        this.when = function (name, callback) {
            incomingMessages[name] = callback;
        };

        this.$get = ['$q', 'chrome', 'environmentConfig', '$injector', function ($q, chrome, environmentConfig, $injector) {
            function sendMessage(message) {
                return $q(function (resolve) {
                    chrome.runtime.sendMessage(environmentConfig.keepkeyProxy.applicationId, message, resolve);
                });
            }

            function respondToMessages(request, sender, sendResponse) {
                console.log("External message:", request);

                var messageArguments = {
                    request: request,
                    sender: sender,
                    sendResponse: sendResponse
                };


                if (sender.id !== environmentConfig.keepkeyProxy.applicationId) {
                    $injector.invoke(incomingMessages.unknownSender, messageArguments);
                    return;
                }

                var messageHandler = incomingMessages[request.messageType];

                if (!messageHandler) {
                    $injector.invoke(incomingMessages.unknownMessageType, messageArguments);
                    return;
                }

                $injector.invoke(messageHandler, messageArguments);
            }

            return {
                startListener: function startListener() {
                    chrome.runtime.onMessageExternal.addListener(respondToMessages);
                },
                stopListener: function stopListener() {
                    chrome.runtime.onMessageExternal.removeListener(respondToMessages);
                },
                isDeviceReady: function () {
                    return sendMessage({messageType: 'deviceReady'});
                },
                resetDevice: function (options) {
                    var message = angular.extend({
                        messageType: 'reset'
                    }, options);
                    return sendMessage(message);
                },
                sendPin: function (options) {
                    var message = angular.extend({messageType: 'PinMatrixAck'}, options);
                    return sendMessage(message);
                },
                initialize: function() {
                    return sendMessage({messageType: 'Initialize'});
                }
            };
        }];
    })
    .config(['DeviceBridgeServiceProvider',
        function (deviceBridgeServiceProvider) {

            function navigateToLocation(locationTemplate) {
                return ['NavigationService', '$rootScope',
                    function (navigationService, $rootScope) {
                        var location = locationTemplate;
                        for (var field in this.request.message) {
                            if (this.request.message.hasOwnProperty(field)) {
                                location = location.replace(':' + field, this.request.message[field]);
                            }
                        }
                        navigationService.go(location);
                        $rootScope.$digest();
                    }
                ];
            }

            deviceBridgeServiceProvider.when('connected', ['DeviceBridgeService',
                function(deviceBridgeService){
                    deviceBridgeService.initialize();
                }
            ]);

            deviceBridgeServiceProvider.when('disconnected', navigateToLocation('/connect'));
            deviceBridgeServiceProvider.when('PinMatrixRequest', navigateToLocation('/pin/:type'));
            deviceBridgeServiceProvider.when('ButtonRequest', navigateToLocation('/buttonRequest/:code'));
            deviceBridgeServiceProvider.when('Success', ['NavigationService', '$rootScope',
                function (navigationService, $rootScope) {
                    if (this.request.message.message === "Device wiped") {
                        navigationService.go('/initialize');
                        $rootScope.$digest();
                    } else {
                        console.log('Unhandled success message:', this.request.message.message);
                    }
                }
            ]);
            deviceBridgeServiceProvider.when('Features', ['NavigationService', '$rootScope',
                function (navigationService, $rootScope) {
                    if (this.request.message.initialized) {
                        navigationService.go('/wallet');
                    } else {
                        navigationService.go('/initialize');
                    }
                    $rootScope.$digest();
                }
            ]);

            deviceBridgeServiceProvider.when('ping', function () {
                // Do nothing
            });

            deviceBridgeServiceProvider.when('unknownSender', function () {
                this.sendResponse({
                    messageType: "Error",
                    result: "Unknown sender " + this.sender.id + ", message rejected"
                });
            });

            deviceBridgeServiceProvider.when('unknownMessageType', function () {
                this.sendResponse({
                    messageType: "Error",
                    result: "Unknown messageType " + this.request.messageType + ", message rejected"
                });
            });
        }
    ])
    .run(['DeviceBridgeService',
        function (deviceBridgeService) {
            deviceBridgeService.startListener();
        }
    ]);
