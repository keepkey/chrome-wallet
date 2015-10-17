angular.module('kkTransactions')
  .config(['DeviceBridgeServiceProvider',
    function (deviceBridgeServiceProvider) {
      deviceBridgeServiceProvider.when('connected', ['DeviceBridgeService', 'NavigationService',
        function (deviceBridgeService, navigationService) {
          deviceBridgeService.initialize();
          navigationService.go('/0');
        }
      ]);
      deviceBridgeServiceProvider.when('disconnected', ['WalletNodeService',
        function (walletNodeService) {
          walletNodeService.clear();
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
