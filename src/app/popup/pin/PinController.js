angular.module('kkWallet')
  .controller('PinController', ['$scope', '$routeParams', 'NavigationService', 'DeviceFeatureService',
    function PinController($scope, $routeParams, navigationService, deviceFeatureService) {
      var previousRoute = navigationService.getPreviousRoute();
      $scope.showDeviceConfigurationButton = false;

      if (previousRoute === '/walletlist') {
        $scope.successRoute = previousRoute;
        $scope.showDeviceConfigurationButton = true;
      } else if (previousRoute.startsWith('/send/')) {
        $scope.successRoute = '/preparing';
        navigationService.setNextTransition('slideLeft');
      } else if(navigationService.getCurrentRoute() === '/pin/pin_matrix_request_type_new_second' &&
        deviceFeatureService.features.initialized) {
        navigationService.setNextTransition('slideRight');
      } else {
        navigationService.setNextTransition('slideLeft');
      }
    }
  ]);
