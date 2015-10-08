angular.module('kkTransactions')
  .config(['DeviceBridgeServiceProvider',
    function (deviceBridgeServiceProvider) {
      deviceBridgeServiceProvider.when('connected', ['DeviceBridgeService',
        function (deviceBridgeService) {
          deviceBridgeService.initialize();
        }
      ]);
      deviceBridgeServiceProvider.when('disconnected', ['$injector', 'WalletNodeService',
        function ($injector, walletNodeService) {
          walletNodeService.clear();
          $injector.invoke(navigateToLocation('/connect'), this);
        }
      ]);

      deviceBridgeServiceProvider.when('WalletNodes', ['WalletNodeService',
        function (walletNodeService) {
          walletNodeService.updateWalletNodes(this.request.message);
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
