angular.module('kkWallet')
  .controller('SuccessController', ['$scope', '$routeParams', 'NavigationService', 'WalletNodeService',
    function SuccessController($scope, $routeParams, navigationService, walletNodeService) {
      $scope.message = decodeURIComponent($routeParams.message);
      navigationService.setNextTransition('slideLeft');
    }
  ]);
