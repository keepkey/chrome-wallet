//require('angular');
//require('environmentConfig');
//require('chrome');
//require('main');

angular.module('kkCommon')
  .provider('DeviceBridgeService', function DeviceBridgeServiceProvider() {
    var incomingMessages = {};

    this.when = function (name, callback) {
      incomingMessages[name] = callback;
    };

    this.$get = ['$rootScope', '$q', 'chrome', 'environmentConfig', '$injector',
      function ($rootScope, $q, chrome, environmentConfig, $injector) {
        function sendMessage(message) {
          console.log('message sent to proxy:', angular.copy(message));
          return $q(function (resolve) {
            chrome.runtime.sendMessage(environmentConfig.keepkeyProxy.applicationId, message, {}, resolve);
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

          //TODO Since messages are broadcast, rethink whether a dispatcher is the
          // right thing to do.
          $rootScope.$broadcast(request.messageType, request.message);

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
          wipeDevice: function () {
            return sendMessage({messageType: 'Wipe'});

          },
          changePin: function (options) {
            var message = angular.extend({messageType: 'ChangePin'}, options);
            return sendMessage(message);
          },
          applySettings: function (options) {
            var message = angular.extend({messageType: 'ApplySettings'}, options);
            return sendMessage(message);
          },
          sendPin: function (options) {
            var message = angular.extend({messageType: 'PinMatrixAck'}, options);
            return sendMessage(message);
          },
          initialize: function () {
            return sendMessage({messageType: 'Initialize'});
          },
          cancel: function () {
            return sendMessage({messageType: 'Cancel'});
          },
          recoverDevice: function (options) {
            var message = angular.extend({messageType: 'RecoveryDevice'}, options);
            return sendMessage(message);
          },
          acknowledgeWord: function (word) {
            var message = {messageType: 'WordAck', word: word};
            return sendMessage(message);
          },
          characterAck: function (character, deleteChar, done) {
            var message = {
              messageType: 'CharacterAck',
              character: character,
              delete: deleteChar,
              done: done
            };
            return sendMessage(message);
          },
          updateFirmware: function () {
            return sendMessage({
              messageType: 'FirmwareUpdate'
            });
          },
          getUnusedExternalAddressNode: function(walletId) {
            var message = angular.extend({}, {
              messageType: 'GetUnusedExternalAddressNode'
            });
            return sendMessage(message);
          },
          getAddress: function (options) {
            var message = angular.extend({}, {
              messageType: 'GetAddress',
              addressN: [0],
              coinName: "Bitcoin",
              showDisplay: false
            }, options);
            return sendMessage(message);
          },
          getPublicKey: function (options) {
            var message = angular.extend({}, {
              messageType: 'GetPublicKey',
              addressN: [0]
            }, options);
            return sendMessage(message);
          },
          getWalletNodes: function () {
            return sendMessage({
              messageType: 'GetWalletNodes'
            });
          },
          reloadBalances: function() {
            return sendMessage({
              messageType: 'ReloadBalances'
            });
          },
          requestTransactionSignature: function (transactionRequest) {
            var message = angular.extend({}, {
              messageType: 'RequestTransactionSignature'
            }, transactionRequest);
            message.amount *= 100000000;
            return sendMessage(message);
          },
          getFees: function () {
            return sendMessage({
              messageType: 'GetFees'
            });
          },
          estimateFeeForTransaction: function (node, transactionAmount) {
            return sendMessage({
              messageType: 'EstimateFeeForTransaction',
              walletNode: node,
              transactionAmount: transactionAmount * 100000000
            })
          },
          getMaximumTransactionAmount: function (node, feeLevel) {
            return sendMessage({
              messageType: 'GetMaximumTransactionAmount',
              walletNode: node,
              feeLevel: feeLevel
            });
          }
        };
      }
    ];
  })
  .run(['DeviceBridgeService',
    function (deviceBridgeService) {
      deviceBridgeService.startListener();
    }
  ]);