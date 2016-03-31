angular.module('kkWallet')
  .controller('PassphraseController', ['$scope', 'DeviceBridgeService',
    function PassphraseController($scope, deviceBridgeService) {
      $scope.userInput = {
        passphrase: ''
      };
      $scope.sendPassphrase = function() {
        deviceBridgeService.sendPassphrase($scope.userInput.passphrase);
        $scope.userInput.passphrase = '';
      };
    }
  ]);