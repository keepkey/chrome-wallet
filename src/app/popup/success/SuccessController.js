angular.module('kkWallet')
  .controller('SuccessController', ['$scope', '$routeParams', 'NavigationService', 'WalletNodeService',
    function SuccessController($scope, $routeParams, navigationService, walletNodeService) {
      if ($routeParams.message === 'device_wiped') {
        walletNodeService.clear();
      }
      $scope.message = decodeURIComponent($routeParams.message);
      navigationService.setNextTransition('slideLeft');
    }
  ]);
