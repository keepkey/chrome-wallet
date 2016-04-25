angular.module('kkWallet')
  .controller('PassphraseController', ['$scope', 'DeviceBridgeService', 'NavigationService',
    function PassphraseController($scope, deviceBridgeService, navigationService) {
      $scope.userInput = {
        passphrase: '',
        confirmPassphrase: ''
      };
      $scope.sendPassphrase = function () {
        if(!$scope.form.$valid) {
          return false;
        }
        navigationService.setNextTransition('cross-fade');
        deviceBridgeService.sendPassphrase($scope.userInput.passphrase);
        $scope.userInput.passphrase = '';
        $scope.userInput.confirmPassphrase = '';
      };
    }
  ]);
