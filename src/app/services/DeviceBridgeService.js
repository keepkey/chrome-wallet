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
                    chrome.runtime.sendMessage(environmentConfig.keepkeyProxy.applicationId, message, function (result) {
                        resolve(result);
                    });
                });
            }

            function respondToMessages(request, sender, sendResponse) {
                console.log("External message:", request.messageType)

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
                    return sendMessage({messageType: "deviceReady"});
                }
            };
        }];
    })
    .config(['DeviceBridgeServiceProvider',
        function (deviceBridgeServiceProvider) {

            function navigateToLocation(location) {
                return ['NavigationService', '$rootScope',
                    function (navigationService, $rootScope) {
                        navigationService.go(location);
                        $rootScope.$digest();

                    }
                ];
            }

            deviceBridgeServiceProvider.when('connected', navigateToLocation('/initialize'));

            deviceBridgeServiceProvider.when('disconnected', navigateToLocation('/connect'));

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
