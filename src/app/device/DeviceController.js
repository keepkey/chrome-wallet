angular.module('kkWallet')
  .controller('DeviceController', ['$scope', '$routeParams', 'NavigationService', 'DeviceBridgeService', 'DeviceFeatureService',
    function DeviceController($scope, $routeParams, navigationService, deviceBridgeService, deviceFeatureService) {
      $scope.backDestination = '/wallet/' + $routeParams.wallet;

      $scope.wipeDevice = function () {
        navigationService.setNextTransition('slideLeft');
        deviceBridgeService.wipeDevice();
      };

      $scope.device = deviceFeatureService.features;
    }
  ]);