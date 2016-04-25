angular.module('kkTransactions')
  .config(['DeviceBridgeServiceProvider',
    function (deviceBridgeServiceProvider) {
      deviceBridgeServiceProvider.when('disconnected', ['WalletNodeService',
        function (walletNodeService) {
          walletNodeService.clear();
          chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
          });
        }
      ]);

      deviceBridgeServiceProvider.when('TransactionHistory', ['WalletNodeService',
        function (walletNodeService) {
          walletNodeService.updateWalletHistory(this.request.message);
        }
      ]);

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
  ]);
