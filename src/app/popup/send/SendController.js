angular.module('kkWallet')
  .controller('SendController', ['$scope', '$routeParams',
    'DeviceBridgeService', 'NavigationService', 'WalletNodeService',
    'TransactionService', 'FeeService', 'environmentConfig',
    function SendController($scope, $routeParams, deviceBridgeService,
                            navigationService, walletNodeService,
                            transactionService, feeService, environmentConfig) {
      function bitcoinsToSatoshis(amount) {
        return Math.round(amount * 100000000);
      }

      walletNodeService.reload();

      $scope.feeOptions = feeService.feeOptions;
      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;

      $scope.wallet = walletNodeService.getWalletById($routeParams.wallet);
      $scope.singleAccount = walletNodeService.wallets.length === 1;
      $scope.showForm = !!($scope.wallet.highConfidenceBalance);
      $scope.preparingTransaction = false;

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
          if (destinationAccount) {
            transactionService.transactionInProgress.sendToAccount = 
              destinationAccount;
          } else {
            transactionService.transactionInProgress.sendTo = 
              $scope.userInput.address;
          }

          deviceBridgeService.requestTransactionSignature(
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

      $scope.$watch('userInput.amount', function computeFees() {
        if ($scope.wallet.id) {
          feeService.compute($scope.wallet.id, 
            bitcoinsToSatoshis($scope.userInput.amount));
        }
      });
      $scope.$watch('wallet.id', function () {
        if ($scope.wallet.id) {
          feeService.getMaximumTransactionAmount($scope.wallet.id,
            $scope.userInput.feeLevel);
          feeService.compute($scope.wallet.id,
            bitcoinsToSatoshis($scope.userInput.amount));
        }
      });
    }
  ]);
