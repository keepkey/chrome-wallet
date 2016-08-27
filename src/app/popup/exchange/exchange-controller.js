angular.module('kkWallet')
  .controller('ExchangeController', ['$scope', '$routeParams',
    'DeviceBridgeService', 'NavigationService', 'WalletNodeService',
    'TransactionService', 'FeeService', 'environmentConfig',
    'DeviceFeatureService', 'ShapeshiftMarketDataService',
    function ExchangeController($scope, $routeParams, deviceBridgeService,
                                navigationService, walletNodeService,
                                transactionService, feeService, environmentConfig,
                                featureService, marketService) {
      function bitcoinsToSatoshis(amount) {
        return Math.round(amount * 100000000);
      }

      walletNodeService.reload();
      marketService.clear();

      $scope.feeOptions = feeService.feeOptions;
      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;

      $scope.wallet = walletNodeService.getWalletById($routeParams.wallet);
      $scope.currency = $scope.wallet.coinType;
      $scope.singleAccount = walletNodeService.wallets.length === 1;
      $scope.showForm = !!($scope.wallet.highConfidenceBalance);
      $scope.preparingTransaction = false;
      $scope.buttonText = 'Exchange';

      $scope.vendorName =
        featureService.get('deviceCapabilities.vendorName');
      $scope.supportsSecureExchange = featureService.getPolicySetting('ShapeShift');
      $scope.showSecurityWarning = !$scope.supportsSecureExchange;

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
            amount: bitcoinsToSatoshis($scope.userInput.amount),
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

          deviceBridgeService.requestCurrencyExchange(
            transactionService.transactionInProgress);

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

      $scope.$watch('userInput.depositAmount', function computeFees() {
        if ($scope.wallet.id) {
          feeService.compute($scope.wallet.id,
            bitcoinsToSatoshis($scope.userInput.depositAmount));
        }
        marketService.setDeposit($scope.userInput.depositAmount);
        $scope.userInput.withdrawalAmount = marketService.data.withdrawalAmount ?
          parseFloat(marketService.data.withdrawalAmount.toFixed(8)) : undefined;
      });

      $scope.$watch('userInput.withdrawalAmount', function() {
        marketService.setWithdrawal($scope.userInput.withdrawalAmount);
        $scope.userInput.depositAmount = marketService.data.depositAmount ?
          parseFloat(marketService.data.depositAmount.toFixed(8)) : undefined;
      });


      // $scope.$watch('wallet.id', function () {
      //   if ($scope.wallet.id) {
      //     feeService.getMaximumTransactionAmount($scope.wallet.id,
      //       $scope.userInput.feeLevel);
      //     feeService.compute($scope.wallet.id,
      //       bitcoinsToSatoshis($scope.userInput.amount));
      //   }
      // });
    }
  ]);
