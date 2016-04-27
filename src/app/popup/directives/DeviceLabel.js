angular.module('kkWallet')
  .directive('deviceLabel', function deviceLabel() {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'DeviceFeatureService',
        function ($scope, deviceFeatureService) {
          console.log('label:', deviceFeatureService.get('label'));
          console.log('vendorName:', deviceFeatureService.get('deviceCapabilities.vendorName'));
          $scope.deviceLabel = deviceFeatureService.get('label') ||
            deviceFeatureService.get('deviceCapabilities.vendorName') ||
            'KeepKey';
          console.log('deviceLabel:', $scope.deviceLabel);
        }
      ],
      template: '<span class="device-label"> {{deviceLabel}} </span>'
    };
  });