angular.module('kkWallet')
  .controller('DeviceController', ['$scope', '$routeParams', 'NavigationService', 'DeviceBridgeService', 'DeviceFeatureService',
    function DeviceController($scope, $routeParams, navigationService, deviceBridgeService, deviceFeatureService) {
      $scope.backDestination = '/wallet/0';

      $scope.wipeDevice = function () {
        navigationService.setNextTransition('slideLeft');
        deviceBridgeService.wipeDevice();
      };

      $scope.changePin = function () {
        navigationService.setNextTransition('slideLeft');
        deviceBridgeService.changePin();
      };

      $scope.device = deviceFeatureService.features;
    }
  ]);