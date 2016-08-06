// ConfirmExchangeController
angular.module('kkWallet')
  .controller('SignExchangeController', [
    '$scope',
    function ($scope) {
      $scope.cancelExchangeRequest = function() {
        console.error('TODO: Implement cancel exchange request in the ConfirmExchangeController');
        $scope.cancelDeviceOperation();
        $scope.goBack();
      }
    }
  ]);
