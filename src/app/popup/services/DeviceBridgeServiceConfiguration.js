angular.module('kkWallet')
  .config(['DeviceBridgeServiceProvider',
    function (deviceBridgeServiceProvider) {

      function navigateToLocation(locationTemplate) {
        return ['NavigationService',
          function (navigationService) {
            var location = locationTemplate;
            for (var field in this.request.message) {
              if (this.request.message.hasOwnProperty(field)) {
                location = location.replace(':' + field,
                  encodeURIComponent(_.snakeCase(this.request.message[field])));
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

      deviceBridgeServiceProvider.when('disconnected', [
        '$injector', 'WalletNodeService',
        function ($injector, walletNodeService) {
          walletNodeService.clear();
          $injector.invoke(navigateToLocation('/connect'), this);
        }
      ]);
      deviceBridgeServiceProvider.when('PinMatrixRequest',
        navigateToLocation('/pin/:type'));
      deviceBridgeServiceProvider.when('PassphraseRequest',
        navigateToLocation('/passphrase'));
      deviceBridgeServiceProvider.when('ButtonRequest', [
        '$injector', 'NavigationService',
        function ($injector, navigationService) {
          if (this.request.message.code !== 'ButtonRequest_Address') {
            var fields, policy, state;
            var rawData = _.get(this, 'request.message.data');
            if (rawData) {
              fields = rawData.split(':');
              this.request.message.policy = fields[0];
              this.request.message.state = fields[1];
              $injector.invoke(navigateToLocation('/buttonRequest/:code/:policy/:state'), this);
            } else {
              $injector.invoke(navigateToLocation('/buttonRequest/:code'), this);
            }
          }
        }]);
      deviceBridgeServiceProvider.when('WordRequest',
        navigateToLocation('/wordRequest'));
      deviceBridgeServiceProvider.when('CharacterRequest',
        navigateToLocation('/characterRequest/:word_pos/:character_pos'));
      deviceBridgeServiceProvider.when('Success', [
        '$injector', 'NotificationMessageService', 'WalletNodeService',
        function ($injector, notificationMessageService, walletNodeService) {
          var destination;

          function navigateToWalletRoot() {
            if (walletNodeService.wallets.length > 1) {
              destination = '/walletList';
            } else {
              destination = '/wallet/' + walletNodeService.wallets[0].id;
            }
          }

          switch (this.request.message.message) {
            case 'Device wiped':
              notificationMessageService.set(
                'Your KeepKey was successfully wiped!');
              destination = '/initialize';
              break;
            case 'Settings applied':
              notificationMessageService.set(
                'Your device label was successfully changed!');
              destination = '/device';
              break;
            case 'PIN changed':
              notificationMessageService.set(
                'Your PIN was successfully changed!');
              destination = '/device';
              break;
            case 'Policies applied':
              notificationMessageService.set(
                'Your device policies were updated!');
              navigateToWalletRoot();
              break;
            case 'Device reset':
            case 'Device recovered':
              navigateToWalletRoot();
              break;
            case 'Transaction sent':
              notificationMessageService.set(
                'Your transaction was successfully sent!');
              navigateToWalletRoot();
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
      deviceBridgeServiceProvider.when('Failure', [
        '$injector', 'FailureMessageService', 'NavigationService',
        function ($injector, failureMessageService, navigationService) {
          const GO_BACK = 0;
          const DO_NOTHING = 1;
          const FailureModes = [{
            message: 'Firmware erase cancelled',
            action: GO_BACK
          }, {
            message: 'PIN Cancelled',
            action: GO_BACK
          }, {
            message: 'Signing cancelled by user',
            action: GO_BACK
          }, {
            message: 'Wipe cancelled',
            action: GO_BACK
          }, {
            message: 'Reset cancelled',
            action: GO_BACK
          }, {
            message: 'Recovery cancelled',
            action: GO_BACK
          }, {
            message: 'Apply settings cancelled',
            action: GO_BACK
          }, {
            message: 'PIN change cancelled',
            action: GO_BACK
          }, {
            message: 'Exchange cancelled',
            action: GO_BACK
          }, {
            message: 'Show address cancelled',
            action: DO_NOTHING
          }, {
            message: 'Aborted',
            action: DO_NOTHING
          }];

          var action =
            _.find(FailureModes, {message: this.request.message.message});
          switch (_.get(action, 'action')) {
            case GO_BACK:
              $injector.invoke(navigateToPreviousLocation(), this);
            case DO_NOTHING:
              return;
            default:
              failureMessageService.add(this.request.message);
              navigationService.setNextDestination();
              $injector.invoke(navigateToLocation('/failure/:message'), this);
          }
        }
      ]);
      deviceBridgeServiceProvider.when('TxRequest', [
        'NavigationService', 'TransactionService',
        function (navigationService, transactionService) {
          if (this.request.message.request_type === 'TXFINISHED') {
            angular.copy({}, transactionService.transactionInProgress);
            navigationService.go('/walletlist');
          }
        }
      ]);
      deviceBridgeServiceProvider.when('Features', [
        'EntryPointNavigationService', 'DeviceFeatureService',
        function (navigationService, deviceFeatureService) {
          deviceFeatureService.set(this.request.message);
          navigationService.goToTop(true);
        }
      ]);

      deviceBridgeServiceProvider.when('ImageHashCode', [
        'ProxyInfoService',
        function (proxyInfoService) {
          proxyInfoService.set(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('ping', function () {
        // Do nothing
      });

      deviceBridgeServiceProvider.when('WalletNodes', [
        'WalletNodeService',
        function (walletNodeService) {
          walletNodeService.updateWalletNodes(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('EstimatedTransactionFee', [
        'FeeService',
        function (feeService) {
          feeService.setEstimate(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('MaximumTransactionAmount', [
        'FeeService',
        function (feeService) {
          feeService.setMaxTransactionAmount(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('Processed', [
        'ProgressService',
        function (progressService) {
          progressService.update(this.request.message);
        }
      ]);

      deviceBridgeServiceProvider.when('PreconnectCheck', [
        'NavigationService', 'ChromeManagementService', 'DeviceBridgeService',
        function (navigationService, chromeManagementService, deviceBridgeService) {
          if (this.request.message.productName === 'KeepKey') {
            deviceBridgeService.initialize();
          } else {
            chromeManagementService.getConflictingAppIds()
              .then(function(apps) {
                if (apps.length) {
                  navigationService.go('/disableConflicting/' + apps[0]);
                } else {
                  deviceBridgeService.initialize();
                }
              });
          }
        }
      ]);

      deviceBridgeServiceProvider.when('RequestCurrencyExchangeConfirmation', [
        'NavigationService', 'ExchangeService',
        function(navigationService, exchangeService) {
          exchangeService.set(this.request.message);
          navigationService.go('/confirm-exchange');
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
          result: "Unknown messageType " + this.request.messageType +
          ", message rejected"
        });
      });
    }
  ]);
