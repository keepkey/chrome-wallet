// ConfirmExchangeController
angular.module('kkWallet')
  .controller('SignExchangeController', [
    '$scope',
    function ($scope) {
      $scope.cancelExchangeRequest = function() {
        $scope.cancelDeviceOperation();
      }
    }
  ]);
