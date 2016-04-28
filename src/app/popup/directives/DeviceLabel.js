angular.module('kkWallet')
  .directive('deviceLabel', function deviceLabel() {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'DeviceFeatureService',
        function ($scope, deviceFeatureService) {
          $scope.deviceLabel = deviceFeatureService.get('label') ||
            deviceFeatureService.get('deviceCapabilities.vendorName') ||
            'KeepKey';
        }
      ],
      template: '<span class="device-label"> {{deviceLabel}} </span>'
    };
  });