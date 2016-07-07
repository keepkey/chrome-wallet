// ConfirmExchangeController
angular.module('kkWallet')
  .controller('ConfirmExchangeController', [
    '$scope', 'DeviceBridgeService', 'ExchangeService',
    function ($scope, deviceBridgeService, exchangeService) {
      $scope.depositAmount = exchangeService.get('deposit.amount');
      $scope.depositCurrency = exchangeService.get('deposit.coinType');
      $scope.depositAccount = exchangeService.get('deposit.accountId');
      $scope.withdrawalAmount = exchangeService.get('withdrawal.amount');
      $scope.withdrawalCurrency = exchangeService.get('withdrawal.coinType');
      $scope.withdrawalAccount = exchangeService.get('withdrawal.accountId');
      $scope.exchangeRate = exchangeService.get('rate');
      $scope.minerFee = exchangeService.get('minerFee');
      $scope.transactionId = exchangeService.get('transactionId');
      
      $scope.nextAction = function() {
        deviceBridgeService.confirmCurrencyExchange($scope.transactionId);
      }
    }
  ]);
