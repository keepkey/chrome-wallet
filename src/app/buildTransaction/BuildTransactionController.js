angular.module('kkWallet')
  .controller('BuildTransactionController', ['$scope', '$routeParams', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService', 'FeeService',
    function BuildTransactionController($scope, $routeParams, deviceBridgeService, navigationService, walletNodeService, transactionService, feeService) {
      walletNodeService.reload();

      feeService.update();

      $scope.fees = feeService.fees;
      $scope.feeOptions = feeService.feeOptions;

      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;
      $scope.signButtonDisabled = function() {
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
      $scope.getMaxAmount = function() {
        return $scope.maxAmount.max / 100000000;
      };

      getMaximumTransactionAmount();

      function computeFee() {
        feeService.compute($scope.wallet.hdNode, $scope.userInput.amount, $scope.userInput.feeLevel);
      }

      function getMaximumTransactionAmount() {
        feeService.getMaximumTransactionAmount($scope.wallet.hdNode, $scope.userInput.feeLevel);
      }

      $scope.$watch('userInput.feeLevel', computeFee);
      $scope.$watch('userInput.feeLevel', getMaximumTransactionAmount);
      $scope.$watch('userInput.amount', computeFee);
    }
  ]);
