angular.module('kkWallet')
  .controller('PinController', ['$scope', '$routeParams', 'NavigationService',
    function PinController($scope, $routeParams, navigationService) {
      var previousRoute = navigationService.getPreviousRoute();
      if (previousRoute === '/walletlist') {
        $scope.successRoute = previousRoute;
      }
    }
  ]);
