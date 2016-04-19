angular.module('kkWallet')
  .controller('PinController', ['$scope', '$routeParams', 'NavigationService',
    function PinController($scope, $routeParams, navigationService) {
      var previousRoute = navigationService.getPreviousRoute();
      $scope.showDeviceConfigurationButton = false;

      if (previousRoute === '/walletlist') {
        $scope.successRoute = previousRoute;
        $scope.showDeviceConfigurationButton = true;
      } else {
        navigationService.setNextTransition('slideLeft');
      }
    }
  ]);
