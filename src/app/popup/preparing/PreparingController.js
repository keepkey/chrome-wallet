angular.module('kkWallet')
  .controller('PreparingController', ['$scope', 'ProgressService', 'NavigationService',
    function ($scope, progressService, navigationService) {
      progressService.clear();
      $scope.progress = progressService;
      navigationService.setNextTransition('slideLeft');
    }
  ]);
