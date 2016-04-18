angular.module('kkWallet')
  .controller('FailureController', ['$scope', '$timeout', 'FailureMessageService', 'DeviceBridgeService', 'NavigationService',
    function FailureController($scope, $timeout, failureMessageService, deviceBridgeService, navigationService) {
      $scope.failures = failureMessageService.get();

      navigationService.setNextTransition('slideRight');

      $scope.ok = function () {
        deviceBridgeService.initialize();
        $timeout(function () {
          failureMessageService.clear();
        }, 2000);
      };
    }
  ]);
