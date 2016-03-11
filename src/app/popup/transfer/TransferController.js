angular.module('kkWallet')
  .controller('TransferController', ['$scope', '$interpolate', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService', 'FeeService',
    function TransferController($scope, $interpolate, deviceBridgeService, navigationService, walletNodeService, transactionService, feeService) {
      walletNodeService.reload();

      feeService.update();

      $scope.feeOptions = feeService.feeOptions;
      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;
      $scope.wallet = { name: 'Click to Select' };
      $scope.destWallet = { name: 'Click to Select' };
      $scope.wallets = walletNodeService.wallets;
      $scope.preparingTransaction = false;

      $scope.userInput = {
        amount: '',
        feeLevel: $scope.feeOptions[0]
      };
      $scope.buildTransaction = function () {
        $scope.preparingTransaction = true;
        transactionService.transactionInProgress = {
          accountId: $scope.wallet.id,
          sendToAccount: _.get($scope.destWallet, 'id'),
          amount: $scope.userInput.amount,
          feeLevel: $scope.userInput.feeLevel
        };

        deviceBridgeService.requestTransactionSignature(transactionService.transactionInProgress);
        navigationService.setNextTransition('slideLeft');
      };

      $scope.setFeeLevel = function (option) {
        $scope.userInput.feeLevel = option;
      };

      $scope.getFee = function (feeLevelOption) {
        return _.get($scope, 'estimatedFee.fee.' + feeLevelOption) || 0;
      };

      $scope.$watch('userInput.amount', function computeFees() {
        if ($scope.wallet.id) {
          feeService.compute($scope.wallet.id, $scope.userInput.amount);
        }
      });
      $scope.$watch('wallet.id', function() {
        if ($scope.wallet.id) {
          feeService.getMaximumTransactionAmount($scope.wallet.id);
          feeService.compute($scope.wallet.id, $scope.userInput.amount);
        }
      });
    }
  ]);
