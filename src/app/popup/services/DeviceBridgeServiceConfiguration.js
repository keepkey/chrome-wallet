angular.module('kkWallet')
  .config(['DeviceBridgeServiceProvider',
    function (deviceBridgeServiceProvider) {

      function navigateToLocation(locationTemplate) {
        return ['NavigationService', '$rootScope',
          function (navigationService, $rootScope) {
            var location = locationTemplate;
            for (var field in this.request.message) {
              if (this.request.message.hasOwnProperty(field)) {
                location = location.replace(':' + field, encodeURIComponent(_.snakeCase(this.request.message[field])));
              }
            }
            navigationService.go(location);
            $rootScope.$digest();
          }
        ];
      }

      function navigateToPreviousLocation() {
        return ['NavigationService', '$rootScope',
          function (navigationService, $rootScope) {
            navigationService.goToPrevious('slideRight');
            $rootScope.$digest();
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
      deviceBridgeServiceProvider.when('ButtonRequest', ['$injector', 'NavigationService',
        function ($injector, navigationService) {
          if (this.request.message.code === 'ButtonRequest_ProtectCall') {
            if (navigationService.getCurrentRoute() == '/label/settings') {
              this.request.message.code += 'ChangeLabel';
            } else {
              this.request.message.code += 'ChangePin';
            }
          }

          if (this.request.message.code !== 'ButtonRequest_Address') {
            $injector.invoke(navigateToLocation('/buttonRequest/:code'), this);
          }
        }]);
      deviceBridgeServiceProvider.when('WordRequest', navigateToLocation('/wordRequest'));
      deviceBridgeServiceProvider.when('CharacterRequest', navigateToLocation('/characterRequest/:word_pos/:character_pos'));
      deviceBridgeServiceProvider.when('Success', navigateToLocation('/success/:message'));
      deviceBridgeServiceProvider.when('PassphraseRequest', navigateToLocation('/passphrase'));
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
            'Recovery cancelled'
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
      deviceBridgeServiceProvider.when('TxRequest', ['NavigationService', 'TransactionService', '$rootScope',
        function (navigationService, transactionService, $rootScope) {
          if (this.request.message.request_type === 'TXFINISHED') {
            angular.copy({}, transactionService.transactionInProgress);
            navigationService.go('/wallet');
            $rootScope.$digest();
          }
        }
      ]);
      deviceBridgeServiceProvider.when('Features', ['NavigationService', 'DeviceFeatureService', '$rootScope',
        function (navigationService, deviceFeatureService, $rootScope) {
          deviceFeatureService.set(this.request.message);
          if (deviceFeatureService.features.bootloader_mode) {
            navigationService.go('/bootloader');
          }
          else if (deviceFeatureService.features.passphrase_protection) {
            navigationService.go('/passphrase');
          }
          else if (deviceFeatureService.features.initialized) {
            navigationService.go('/wallet');
          }
          else {
            navigationService.go('/initialize');
          }
          $rootScope.$digest();
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

      deviceBridgeServiceProvider.when('Fees', ['FeeService',
        function (feeService) {
          feeService.set(this.request.message);
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
