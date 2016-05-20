angular.module('kkWallet')
  .config(['DeviceBridgeServiceProvider',
    function (deviceBridgeServiceProvider) {

      function navigateToLocation(locationTemplate) {
        return ['NavigationService',
          function (navigationService) {
            var location = locationTemplate;
            for (var field in this.request.message) {
              if (this.request.message.hasOwnProperty(field)) {
                location = location.replace(':' + field, encodeURIComponent(_.snakeCase(this.request.message[field])));
              }
            }
            navigationService.go(location);
          }
        ];
      }

      function navigateToPreviousLocation() {
        return ['NavigationService',
          function (navigationService) {
            navigationService.goToPrevious('slideRight');
          }
        ];
      }

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
      deviceBridgeServiceProvider.when('PinMatrixRequest', navigateToLocation('/pin/:type'));
      deviceBridgeServiceProvider.when('PassphraseRequest', navigateToLocation('/passphrase'));
      deviceBridgeServiceProvider.when('ButtonRequest', ['$injector', 'NavigationService',
        function ($injector, navigationService) {
          if (this.request.message.code !== 'ButtonRequest_Address') {
            $injector.invoke(navigateToLocation('/buttonRequest/:code'), this);
          }
        }]);
      deviceBridgeServiceProvider.when('WordRequest', navigateToLocation('/wordRequest'));
      deviceBridgeServiceProvider.when('CharacterRequest', navigateToLocation('/characterRequest/:word_pos/:character_pos'));
      deviceBridgeServiceProvider.when('Success', [ '$injector', 'NotificationMessageService', 'WalletNodeService',
        function($injector, notificationMessageService, walletNodeService) {
          var destination;
          switch (this.request.message.message) {
            case 'Device wiped':
              notificationMessageService.set('Your KeepKey was successfully wiped!');
              destination = '/initialize';
              break;
            case 'Settings applied':
              notificationMessageService.set('Your device label was successfully changed!');
              destination = '/device';
              break;
            case 'PIN changed':
              notificationMessageService.set('Your PIN was successfully changed!');
              destination = '/device';
              break;
            case 'Device reset':
            case 'Device recovered':
              destination = '/walletList';
              break;
            case 'Transaction sent':
              notificationMessageService.set('Your bitcoin transaction was successfully sent!');

              if(walletNodeService.wallets.length > 1) {
                destination = '/walletList';
              } else {
                destination = '/wallet/' + walletNodeService.wallets[0].id;
              }

              break;
            case 'Account name updated':
              $injector.invoke(navigateToPreviousLocation(), this);
              break;
            default:
              destination = '/success/:message';
          }
          if (destination) {
            $injector.invoke(navigateToLocation(destination), this);
          }
        }
      ]);
      deviceBridgeServiceProvider.when('Address', navigateToPreviousLocation());
      deviceBridgeServiceProvider.when('Failure', ['$injector', 'FailureMessageService', 'NavigationService',
        function ($injector, failureMessageService, navigationService) {
          const IGNORED_FAILURES = [
            'Show address cancelled',
            'Firmware erase cancelled',
            'PIN Cancelled',
            'Signing cancelled by user',
            'Wipe cancelled',
            'Reset cancelled',
            'Recovery cancelled',
            'Apply settings cancelled',
            'PIN change cancelled'
          ];
          if (_.indexOf(IGNORED_FAILURES, this.request.message.message) !== -1) {
            $injector.invoke(navigateToPreviousLocation(), this);
            return;
          }
          failureMessageService.add(this.request.message);
          navigationService.setNextDestination();
          $injector.invoke(navigateToLocation('/failure/:message'), this);
        }
      ]);
      deviceBridgeServiceProvider.when('TxRequest', ['NavigationService', 'TransactionService',
        function (navigationService, transactionService) {
          if (this.request.message.request_type === 'TXFINISHED') {
            angular.copy({}, transactionService.transactionInProgress);
            navigationService.go('/walletlist');
          }
        }
      ]);
      deviceBridgeServiceProvider.when('Features', ['NavigationService', 'DeviceFeatureService',
        function (navigationService, deviceFeatureService) {
          deviceFeatureService.set(this.request.message);
          navigationService.dumpHistory();
          if (deviceFeatureService.features.bootloader_mode) {
            navigationService.go('/bootloader');
          }
          else if (deviceFeatureService.features.firmwareUpdateAvailable) {
            navigationService.go('/update-firmware');
          }
          else if (deviceFeatureService.features.initialized) {
            navigationService.go('/walletlist');
          }
          else {
            navigationService.go('/initialize');
          }
        }
      ]);

      deviceBridgeServiceProvider.when('ImageHashCode', ['ProxyInfoService',
        function (proxyInfoService) {
          proxyInfoService.set(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('ping', function () {
        // Do nothing
      });

      deviceBridgeServiceProvider.when('WalletNodes', ['WalletNodeService',
        function (walletNodeService) {
          walletNodeService.updateWalletNodes(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('EstimatedTransactionFee', ['FeeService',
        function (feeService) {
          feeService.setEstimate(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('MaximumTransactionAmount', ['FeeService',
        function (feeService) {
          feeService.setMaxTransactionAmount(this.request.message);
        }
      ]);
      
      deviceBridgeServiceProvider.when('Processed', ['ProgressService',
        function(progressService) {
          progressService.update(this.request.message);
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
