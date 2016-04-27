angular.module('kkWallet')
  .controller('SupportController', ['$scope', 'DeviceFeatureService',
    function DeviceController($scope, deviceFeatureService) {
      $scope.backDestination = '/device';

      $scope.supportEmailAddress = 'support@keepkey.com';
      $scope.supportWebLink = 'https://keepkey.freshdesk.com/support/solutions';
      $scope.supportPhoneNumber = '+1-855-463-8550';

      if (deviceFeatureService.get('deviceCapabilities.vendorName') === 'KeepKey') {
        $scope.supportName = 'Your KeepKey';
      } else {
        $scope.supportName = 'The KeepKey Chrome Wallet';
      }

      $scope.launchSupportTab = function() {
        window.open($scope.supportWebLink, '_blank');
      };

      $scope.openEmail = function() {
        window.open('mailto:' + $scope.supportEmailAddress);
      };
      $scope.device = deviceFeatureService.features;
    }
  ]);