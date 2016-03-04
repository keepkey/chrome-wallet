angular.module('kkWallet')
  .controller('SendController', ['$scope', '$routeParams', '$interpolate', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService', 'FeeService',
    function SendController($scope, $routeParams, $interpolate, deviceBridgeService, navigationService, walletNodeService, transactionService, feeService) {
      walletNodeService.reload();

      feeService.update();

      $scope.feeOptions = feeService.feeOptions;
      $scope.estimatedFee = feeService.estimatedFee;
      $scope.maxAmount = feeService.maxTransactionAmount;

      if ($routeParams.wallet === 'walletList') {
        $scope.showSourceField = true;
        $scope.wallet = { name: 'Click to Select' };
        $scope.destWallet = { name: 'Click to Select' };
        $scope.showForm = true;
        $scope.titleTemplate = 'app/popup/send/transferTitle.tpl.html';
        $scope.wallets = walletNodeService.wallets;
      } else {
        $scope.showSourceField = false;
        $scope.wallet = walletNodeService.getWalletById($routeParams.wallet);
        $scope.showForm = !!($scope.wallet.highConfidenceBalance);
        $scope.titleTemplate = 'app/popup/send/sendTitle.tpl.html';
      }

      $scope.userInput = {
        sourceIndex: $routeParams.wallet,
        sourceName: $scope.wallet.name,
        address: '',
        amount: '',
        feeLevel: $scope.feeOptions[0]
      };
      $scope.buildTransaction = function () {
        //if ($scope.userInput.address && $scope.userInput.amount) {
          transactionService.transactionInProgress = {
            accountId: $scope.wallet.id,
            sendTo: $scope.userInput.address,
            sendToAccount: _.get($scope.destWallet, 'id'),
            amount: $scope.userInput.amount,
            feeLevel: $scope.userInput.feeLevel
          };

          deviceBridgeService.requestTransactionSignature(transactionService.transactionInProgress);
          navigationService.setNextTransition('slideLeft');
        //}
      };

      $scope.fillMaxDetector = function(ev) {
        if (ev.charCode === 33) {
          $scope.userInput.amount = $scope.getMaxAmount();
          return false;
        }
        return true;
      };

      $scope.getMaxAmount = function () {
        if ($scope.maxAmount.max) {
          return $scope.maxAmount.max / 100000000;
        } else {
          return 21000000;
        }
      };

      $scope.setFeeLevel = function (option) {
        $scope.userInput.feeLevel = option;
      };

      $scope.getFee = function (feeLevelOption) {
        var fee = _.get($scope, 'estimatedFee.fee' + feeLevelOption);

        if (_.isUndefined(fee)) {
          fee = 0.0;
        }

        return fee;
      };

      $scope.selectWallet = function(wallet) {
        $scope.wallet = wallet;
        feeService.getMaximumTransactionAmount($scope.wallet.id);
        feeService.compute($scope.wallet.id, $scope.userInput.amount);
      };

      $scope.selectDestWallet = function(wallet) {
        $scope.destWallet = wallet;
      };

      //$scope.backDestination = '/wallet/' + $routeParams.wallet;

      function computeFees() {
        if ($scope.wallet.id) {
          feeService.compute($scope.wallet.id, $scope.userInput.amount);
        }
      }

      if ($scope.wallet.id) {
        feeService.getMaximumTransactionAmount($scope.wallet.id);
      }

      $scope.$watch('userInput.amount', computeFees);
    }
  ]);
