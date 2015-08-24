angular.module('kkWallet')
  .controller('SendController', ['$scope', '$routeParams', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService', 'FeeService',
    function BuildTransactionController($scope, $routeParams, deviceBridgeService, navigationService, walletNodeService, transactionService, feeService) {
      walletNodeService.reload();

      feeService.update();

      $scope.fees = feeService.fees;
      $scope.feeOptions = feeService.feeOptions;

      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;
      $scope.signButtonDisabled = function () {
        return !$scope.userInput.address || !$scope.userInput.amount;
      };

      $scope.wallet = walletNodeService.getWalletById($routeParams.wallet);
      $scope.walletTransactions = transactionService.walletBalances[$scope.wallet.hdNode];
      $scope.userInput = {
        sourceIndex: $routeParams.wallet,
        sourceName: $scope.wallet.name,
        address: '',
        amount: 0.0,
        feeLevel: $scope.feeOptions[0]
      };
      $scope.buildTransaction = function () {
        if ($scope.userInput.address && $scope.userInput.amount) {
          angular.copy($scope.userInput, transactionService.transactionInProgress);
          deviceBridgeService.requestTransactionSignature(transactionService.transactionInProgress);
          $scope.go('/success/bouncies');
        }
      };
      $scope.getMaxAmount = function () {
        return $scope.maxAmount.max / 100000000;
      };

      $scope.setAmountToMax = function () {
        $scope.userInput.amount = $scope.maxAmount.max / 100000000;
      };

      $scope.setFeeLevel = function (option) {
        $scope.userInput.feeLevel = option;
      };

      $scope.formatFee = function (feeLevelOption) {
        var fee = $scope.estimatedFee.fee && $scope.estimatedFee.fee[feeLevelOption];
        if (_.isUndefined(fee)) {
          return 'not available';
        } else {
          return fee / 100 + ' \u00B5btc';
        }
      };

      getMaximumTransactionAmount();

      function computeFees() {
        feeService.compute($scope.wallet.hdNode, $scope.userInput.amount);
      }

      function getMaximumTransactionAmount() {
        feeService.getMaximumTransactionAmount($scope.wallet.hdNode, $scope.userInput.feeLevel);
      }

      function verifyFeeLevel() {
        $scope.userInput.feeLevel = 'fast';
        var translation = {
          'fast': 'medium',
          'medium': 'slow',
          'slow': 'slow'
        };

        if ($scope.estimatedFee && $scope.estimatedFee.fee) {
          while (_.isUndefined($scope.estimatedFee.fee[$scope.userInput.feeLevel])) {
            $scope.userInput.feeLevel = translation[$scope.userInput.feeLevel];
            if ($scope.userInput.feeLevel === 'slow') {
              break;
            }
          }
        }
      }

      $scope.$watch('userInput.amount', computeFees);
      $scope.$watch('estimatedFee', verifyFeeLevel, true);
      $scope.$watch('estimatedFee', getMaximumTransactionAmount, true);
    }
  ]);
