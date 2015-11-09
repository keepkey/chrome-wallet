angular.module('kkWallet')
  .controller('SupportController', ['$scope', 'DeviceFeatureService',
    function DeviceController($scope, deviceFeatureService) {
      $scope.backDestination = '/device';

      $scope.launchSupportTab = function() {
        window.open('https://keepkey.freshdesk.com/support/solutions', '_blank');
      };

      $scope.openEmail = function() {
        window.open('mailto:support@keepkey.com');
      };
      $scope.device = angular.copy(deviceFeatureService.features);
      delete $scope.device.coins;
    }
  ]);