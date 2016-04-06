angular.module('kkWallet')
  .controller('PassphraseController', ['$scope', 'DeviceBridgeService',
    function PassphraseController($scope, deviceBridgeService) {
      $scope.userInput = {
        passphrase: '',
        confirmPassphrase: ''
      };
      $scope.sendPassphrase = function () {
        if ($scope.passphraseForm.$valid) {
          deviceBridgeService.sendPassphrase($scope.userInput.passphrase);
          $scope.userInput.passphrase = '';
          $scope.userInput.confirmPassphrase = '';
        }
      };
    }
  ]);
