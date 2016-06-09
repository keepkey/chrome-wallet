angular.module('kkWallet')
  .controller('UpdateFirmwareCtrl', ['$scope', 'DeviceFeatureService',
    'EntryPointNavigationService',
    function UpdateFirmwareCtrl($scope, featureService, navigationService) {
      $scope.skipable = featureService.get('initialized');
      $scope.goToTop = navigationService.goToTop;
    }
  ]);