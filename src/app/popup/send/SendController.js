angular.module('kkWallet')
  .controller('SendController', ['$scope', '$routeParams',
    'DeviceBridgeService', 'NavigationService', 'WalletNodeService',
    'TransactionService', 'FeeService', 'environmentConfig',
    'DeviceFeatureService', 'CurrencyLookupService',
    function SendController($scope, $routeParams, deviceBridgeService,
                            navigationService, walletNodeService,
                            transactionService, feeService, environmentConfig,
                            featureService, currencyLookupService) {

      walletNodeService.reload();

      $scope.feeOptions = feeService.feeOptions;
      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;

      $scope.wallet = walletNodeService.getWalletById($routeParams.wallet);
      $scope.currency = $scope.wallet.coinType;
      $scope.singleAccount = walletNodeService.wallets.length === 1;
      $scope.showForm = !$scope.wallet.highConfidenceBalance.equals(0);
      $scope.preparingTransaction = false;

      $scope.buttonText = 'Send';

      $scope.supportsSecureTransfer = featureService.get(
        "deviceCapabilities.supportsSecureAccountTransfer");
      $scope.oldFirmwareVersion =
        featureService.features.firmwareUpdateAvailable;
      $scope.vendorName =
        featureService.get('deviceCapabilities.vendorName');
      $scope.supportsSecureExchange = featureService.getPolicySetting('ShapeShift');

      $scope.showSecurityWarning =
        !$scope.supportsSecureTransfer || !$scope.supportsSecureExchange;

      $scope.config = environmentConfig;

      $scope.userInput = {
        sourceIndex: $routeParams.wallet,
        sourceName: $scope.wallet.name,
        address: '',
        amount: '',
        feeLevel: $scope.config.regularFeeLevel
      };

      $scope.buildTransaction = function () {
        if ($scope.form.$valid) {
          $scope.preparingTransaction = true;
          transactionService.transactionInProgress = {
            accountId: $scope.wallet.id,
            amount: currencyLookupService
              .unformatAmount($scope.currency, $scope.userInput.amount),
            feeLevel: $scope.userInput.feeLevel
          };

          var destinationAccount = _.get($scope.userInput, 'address.id');
          var destinationCurrency = _.get($scope.userInput, 'address.coinType');
          if (destinationAccount) {
            transactionService.transactionInProgress.sendToAccount =
              destinationAccount;
          } else {
            transactionService.transactionInProgress.sendTo =
              $scope.userInput.address;
          }

          var isCurrencyExchange =
            !!destinationCurrency && (destinationCurrency !== $scope.currency);

          if (!isCurrencyExchange) {
            deviceBridgeService.requestTransactionSignature(
              transactionService.transactionInProgress);
          } else {
            deviceBridgeService.requestCurrencyExchange(
              transactionService.transactionInProgress);
          }
          navigationService.setNextTransition('slideLeft');
        }
      };

      $scope.setFeeLevel = function (option) {
        $scope.userInput.feeLevel = option;
      };

      $scope.getFee = function (feeLevelOption) {
        return _.get($scope, 'estimatedFee.fee.' + feeLevelOption) || 0;
      };

      if ($scope.wallet.id) {
        feeService.getMaximumTransactionAmount($scope.wallet.id,
          $scope.userInput.feeLevel);
      }

      $scope.$watch('userInput.address', function () {
        var destinationCurrency = _.get($scope.userInput.address, 'coinType');
        if (destinationCurrency) {
          if (destinationCurrency !== $scope.currency) {
            $scope.buttonText = 'Convert and Send';
          } else {
            $scope.buttonText = 'Transfer';
          }
        } else {
          $scope.buttonText = 'Send';
        }
      });

      $scope.$watch('userInput.amount', function computeFees() {
        if ($scope.wallet.id) {
          feeService.compute($scope.wallet.id, currencyLookupService
            .unformatAmount($scope.currency, $scope.userInput.amount));
        }
      });
      $scope.$watch('wallet.id', function () {
        if ($scope.wallet.id) {
          feeService.getMaximumTransactionAmount($scope.wallet.id,
            $scope.userInput.feeLevel);
          feeService.compute($scope.wallet.id, currencyLookupService
            .unformatAmount($scope.currency, $scope.userInput.amount));
        }
      });
    }
  ]);
